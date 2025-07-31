"use client";

import { Button } from "@nextui-org/react";
import { FaDownload } from "react-icons/fa";
import * as XLSX from "xlsx";

const ExcelTemplate: React.FC = () => {
  const downloadTemplate = () => {
    // Sample data for the template
    const templateData = [
      {
        Name: "Nguyễn Văn A",
        Nickname: "A",
        "Date of Birth": "2000-01-01",
        "Phone Number": "0123456789",
        "Email Address": "nguyenvana@example.com",
        Address: "123 Đường ABC, Quận 1, TP.HCM",
        Note: "Học sinh mới",
      },
      {
        Name: "Trần Thị B",
        Nickname: "B",
        "Date of Birth": "2001-05-15",
        "Phone Number": "0987654321",
        "Email Address": "tranthib@example.com",
        Address: "456 Đường XYZ, Quận 2, TP.HCM",
        Note: "",
      },
    ];

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students Template");

    // Set column widths
    const columnWidths = [
      { wch: 20 }, // Name
      { wch: 15 }, // Nickname
      { wch: 15 }, // Date of Birth
      { wch: 15 }, // Phone Number
      { wch: 25 }, // Email Address
      { wch: 30 }, // Address
      { wch: 20 }, // Note
    ];
    worksheet["!cols"] = columnWidths;

    // Generate file and download
    XLSX.writeFile(workbook, "students_template.xlsx");
  };

  return (
    <Button
      color="primary"
      variant="bordered"
      size="sm"
      startContent={<FaDownload />}
      onPress={downloadTemplate}
    >
      Download Template
    </Button>
  );
};

export default ExcelTemplate; 