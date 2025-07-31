"use client";

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Progress, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { StudentRequestDTO } from "@/dtos/student/StudentRequestDTO";
import { importStudentsFromExcel } from "@/services/StudentService";

interface ExcelImportProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
}

interface ExcelRow {
  name: string;
  nickname?: string;
  dateOfBirth: string;
  phoneNumber: string;
  emailAddress?: string;
  address?: string;
  note?: string;
  discountType?: string;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

const ExcelImport: React.FC<ExcelImportProps> = ({ isOpen, onClose, onImportSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<ExcelRow[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const validateData = useCallback((rows: ExcelRow[]): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    rows.forEach((row, index) => {
      const rowNumber = index + 2; // +2 because Excel starts from 1 and we have header
      
      // Validate required fields
      if (!row.name || row.name.trim() === '') {
        errors.push({ row: rowNumber, field: 'name', message: 'Name is required' });
      }
      
      if (!row.phoneNumber || row.phoneNumber.trim() === '') {
        errors.push({ row: rowNumber, field: 'phoneNumber', message: 'Phone number is required' });
      } else {
        // Làm sạch số điện thoại: loại bỏ mọi ký tự không phải số
        let phone = row.phoneNumber ? String(row.phoneNumber).replace(/[^0-9]/g, '') : '';
        if (phone.length === 9 && phone[0] !== '0') {
          phone = '0' + phone;
          row.phoneNumber = phone;
        }
        const phoneRegex = /^0[0-9]{9}$/;
        if (!phoneRegex.test(phone)) {
          errors.push({ row: rowNumber, field: 'phoneNumber', message: 'Invalid phone number format' });
        }
      }
      
      if (!row.dateOfBirth || row.dateOfBirth.trim() === '') {
        errors.push({ row: rowNumber, field: 'dateOfBirth', message: 'Date of birth is required' });
      } else {
        // Validate date format
        const date = new Date(row.dateOfBirth);
        if (isNaN(date.getTime())) {
          errors.push({ row: rowNumber, field: 'dateOfBirth', message: 'Invalid date format' });
        } else if (date > new Date()) {
          errors.push({ row: rowNumber, field: 'dateOfBirth', message: 'Date of birth cannot be in the future' });
        }
      }
      
      // Validate email format if provided
      if (row.emailAddress && row.emailAddress.trim() !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(row.emailAddress.trim())) {
          errors.push({ row: rowNumber, field: 'emailAddress', message: 'Invalid email format' });
        }
      }
    });
    
    return errors;
  }, []);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ];
    
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid Excel file (.xlsx, .xls) or CSV file');
      return;
    }

    setFile(file);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][];
        
        if (jsonData.length < 2) {
          toast.error('File must contain at least a header row and one data row');
          return;
        }
        
        // Extract header and data
        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1);
        
        // Map data to our interface
        const mappedData: ExcelRow[] = rows.map(row => {
          const rawPhone = row[headers.findIndex(h => h.toLowerCase().includes('phone'))];
          let phoneNumber = String(rawPhone).replace(/[^0-9]/g, '');
          if (phoneNumber.length === 9) {
            phoneNumber = '0' + phoneNumber;
          }
          return {
            name: String(row[headers.findIndex(h => h.toLowerCase().includes('name'))] || ''),
            nickname: String(row[headers.findIndex(h => h.toLowerCase().includes('nickname'))] || ''),
            dateOfBirth: String(row[headers.findIndex(h => h.toLowerCase().includes('date') || h.toLowerCase().includes('birth'))] || ''),
            phoneNumber,
            emailAddress: String(row[headers.findIndex(h => h.toLowerCase().includes('email'))] || ''),
            address: String(row[headers.findIndex(h => h.toLowerCase().includes('address'))] || ''),
            note: String(row[headers.findIndex(h => h.toLowerCase().includes('note'))] || ''),
            discountType: String(row[headers.findIndex(h => h.toLowerCase().includes('discount'))] || ''),
          };
        });
        
        setData(mappedData);
        
        // Validate data
        const validationErrors = validateData(mappedData);
        setErrors(validationErrors);
        
        if (validationErrors.length > 0) {
          toast.error(`Found ${validationErrors.length} validation errors. Please fix them before importing.`);
        } else {
          toast.success(`Successfully loaded ${mappedData.length} students from file`);
        }
        
      } catch (error) {
        console.error('Error reading file:', error);
        toast.error('Error reading file. Please check the file format.');
      }
    };
    
    reader.readAsArrayBuffer(file);
  }, [validateData]);

  const handleImport = async () => {
    if (errors.length > 0) {
      toast.error('Please fix all validation errors before importing');
      return;
    }
    
    if (data.length === 0) {
      toast.error('No data to import');
      return;
    }
    
    setIsProcessing(true);
    setUploadProgress(0);
    
    try {
      // Convert data to StudentRequestDTO format
      const students: StudentRequestDTO[] = data.map(row => ({
        name: row.name.trim(),
        nickname: row.nickname?.trim() || undefined,
        dateOfBirth: new Date(row.dateOfBirth).toISOString(),
        phoneNumber: row.phoneNumber.trim(),
        emailAddress: row.emailAddress?.trim() || undefined,
        address: row.address?.trim() || undefined,
        note: row.note?.trim() || undefined,
      }));
      
      // Call API to import students
      const response = await importStudentsFromExcel(students);
      
      if (response.status !== 200 || !response.data) {
        toast.error(response.message || 'Failed to import students');
        return;
      }
      
      toast.success(`Successfully imported ${response.data.length} students`);
      onImportSuccess();
      onClose();
      
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import students. Please try again.');
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setFile(null);
    setData([]);
    setErrors([]);
    setUploadProgress(0);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      size="4xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>Import Students from Excel</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {/* File Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
                id="excel-file-input"
                disabled={isProcessing}
              />
              <label
                htmlFor="excel-file-input"
                className="cursor-pointer block"
              >
                <div className="text-gray-600">
                  <p className="text-lg font-medium">Click to upload Excel file</p>
                  <p className="text-sm">or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Supported formats: .xlsx, .xls, .csv
                  </p>
                </div>
              </label>
              {file && (
                <p className="text-sm text-green-600 mt-2">
                  Selected: {file.name}
                </p>
              )}
            </div>

            {/* Progress Bar */}
            {isProcessing && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Importing students...</p>
                <Progress 
                  value={uploadProgress} 
                  className="w-full"
                  color="primary"
                />
                <p className="text-xs text-gray-500">
                  {Math.round(uploadProgress)}% complete
                </p>
              </div>
            )}

            {/* Data Preview */}
            {data.length > 0 && !isProcessing && (
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Data Preview ({data.length} students)</h3>
                <div className="max-h-60 overflow-auto">
                  <Table aria-label="Student data preview">
                    <TableHeader>
                      <TableColumn>Name</TableColumn>
                      <TableColumn>Phone</TableColumn>
                      <TableColumn>Email</TableColumn>
                      <TableColumn>Date of Birth</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {data.slice(0, 5).map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.phoneNumber}</TableCell>
                          <TableCell>{row.emailAddress || '-'}</TableCell>
                          <TableCell>{row.dateOfBirth}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {data.length > 5 && (
                    <p className="text-xs text-gray-500 text-center">
                      Showing first 5 rows of {data.length} total
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Validation Errors */}
            {errors.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-red-600">
                  Validation Errors ({errors.length})
                </h3>
                <div className="max-h-40 overflow-auto border border-red-200 rounded p-2">
                  {errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-600">
                      Row {error.row}: {error.field} - {error.message}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button 
            color="danger" 
            variant="light" 
            onPress={handleClose}
            isDisabled={isProcessing}
          >
            Cancel
          </Button>
          <Button 
            color="primary" 
            onPress={handleImport}
            isDisabled={data.length === 0 || errors.length > 0 || isProcessing}
            isLoading={isProcessing}
          >
            Import Students
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ExcelImport; 