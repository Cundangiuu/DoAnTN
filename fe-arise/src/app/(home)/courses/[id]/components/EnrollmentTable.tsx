"use client";
import { useRouter } from "next/navigation";
import { EnrollmentDTO } from "@/dtos/enrollment/EnrollmentDTO";
import { useState } from "react";
import {
  Button,
  ButtonGroup,
  DatePicker,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { EnrollmentRequest, StudentDTO } from "@/dtos";
import { ActionButton, DeleteActionButton } from "@/components";
import { FaPen } from "react-icons/fa";
import Image from "next/image";
import { DateToStringWithoutTime } from "@/utils/DateUtils";
import { Rest } from "@/components/type";
import TableWrapper from "@/components/molecules/table/TableWrapper";
import { IoMdAddCircleOutline } from "react-icons/io";
import { getStudentsWithoutClassCode } from "@/services/StudentService";
import { SubmitButton } from "@/components/molecules/form";
import { toast } from "sonner";
import {
  createEnrollment,
  deleteEnrollment,
  updateEnrollment,
} from "@/services/EnrollmentService";
import {
  getLocalTimeZone,
  parseAbsolute,
  today,
} from "@internationalized/date";
import * as XLSX from "xlsx";
import SearchableStudentDropdown from "./SearhableStudentDropdown";

type Props = {
  defaultEnrollments?: EnrollmentDTO[];
  disabled?: boolean;
  isReadonly?: boolean;
  isNew?: boolean;
  courseCode?: string;
  courseId?: number;
};

type IndexedEnrollmentDTO = {
  index: number;
} & EnrollmentDTO;

export default function EnrollmentTable({
  defaultEnrollments,
  isReadonly,
  isNew,
  courseCode,
  courseId,
}: Readonly<Props>) {
  const router = useRouter();
  const [data] = useState(defaultEnrollments ?? []);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentEnrollment, setCurrentEnrollment] =
    useState<EnrollmentDTO | null>(null);
  const [enrollments, setEnrollments] = useState<Array<EnrollmentRequest>>([]);
  const [students, setStudents] = useState<StudentDTO[]>([]);
  const [selectedEnrollments, setSelectedEnrollments] = useState<number[]>([]);

  const handleDropdownFocus = async () => {
    try {
      const response = await getStudentsWithoutClassCode();
      setStudents(response.data || []);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  const handleSelectEnrollment = (id: number) => {
    setSelectedEnrollments((prev) =>
      prev.includes(id)
        ? prev.filter((enrollId) => enrollId !== id)
        : [...prev, id]
    );
  };

  const handleCreateClass = () => {
    const selectedEnrollmentDTOs = data.filter((e) =>
      selectedEnrollments.includes(e.id)
    );

    const searchParams = new URLSearchParams();
    searchParams.set(
      "enrollments",
      selectedEnrollmentDTOs.map((e) => e.id).join(",")
    );
    searchParams.set("course", courseCode || "");
    router.push(`/classes/new?${searchParams.toString()}`);
  };

  const columns = [
    { name: "No.", key: "index" },
    { name: "Select Enrollment", key: "select", align: "start" },
    { name: "Avatar", key: "avatar" },
    { name: "Student Name", key: "studentName" },
    { name: "Student Description", key: "studentDescription" },
    { name: "Enrollment Date", key: "enrollmentDate" },
    { name: "Phone Number", key: "phoneNumber" },
    { name: "Date Of Birth", key: "dateOfBirth" },
    { name: "Action", key: "action" },
  ];

  const deleteAction = async (id: number) => {
    setLoading(true);
    const response = await deleteEnrollment(id);
    if (response.status !== 200) {
      toast.error("Failed to delete enrollment");
      return response;
    }

    toast.success("Enrollment deleted");
    if (!enrollments) {
      return response;
    }
    setLoading(false);
    window.location.reload();
    return response;
  };

  const renderCell = (key: string, data: IndexedEnrollmentDTO) => {
    switch (key) {
      case "index":
        return <p>{data[key] + 1}</p>;
      case "select":
        return (
          <input
            type="checkbox"
            checked={selectedEnrollments.includes(data.id)}
            onChange={() => handleSelectEnrollment(data.id)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
        );
      case "avatar":
        return (
          <div>
            {data.student?.avatarUrl ? (
              <Image
                src={
                  `/api/images?filePath=${data.student.avatarUrl}` ||
                  "/default/avatar.png"
                }
                alt="Avatar"
                className="rounded-full h-8 w-8"
                width={250}
                height={250}
              />
            ) : (
              "No Avatar"
            )}
          </div>
        );
      case "studentName":
        return (
          <Link
            href={`/students/${data.student?.code}`}
            className="m-4 hover:underline hover:text-blue-600"
          >
            {data.student?.name} ({data.student?.nickname})
          </Link>
        );
      case "studentDescription":
        return <div>{data.student.note}</div>;
      case "enrollmentDate":
        return <div>{DateToStringWithoutTime(data.enrollmentDate)}</div>;
      case "phoneNumber":
        return <div>{data.student.phoneNumber}</div>;
      case "dateOfBirth":
        return (
          <div>
            {DateToStringWithoutTime(new Date(data.student.dateOfBirth))}
          </div>
        );
      case "action":
        return (
          <div className="w-full relative flex justify-center">
            <ButtonGroup>
              <ActionButton
                icon={FaPen}
                onClick={() => {
                  setCurrentEnrollment(data);
                  onOpen();
                }}
              />
              <DeleteActionButton
                action={deleteAction}
                objectName="enrollment"
                afterDelete={() => { }}
                id={data.id}
                isIconOnly={true}
              />
            </ButtonGroup>
          </div>
        );
    }
  };

  const handleUpdate = async (formData: FormData) => {
    const student = Number(formData.get("student"));
    const enrollmentDate = new Date(
      (formData.get("enrollmentDate") as string).split("[")[0]
    );
    try {
      let response;
      if (currentEnrollment) {
        const enrollmentRequest: EnrollmentRequest = {
          studentId: student,
          courseId: currentEnrollment?.course,
          classCode: currentEnrollment?.classCode,
          enrollmentDate: enrollmentDate,
        };
        response = await updateEnrollment(
          enrollmentRequest,
          currentEnrollment.id
        );
        if (!response.data) {
          toast.error(`Failed to create lesson`);
        }

        toast.success(`lesson update successfully`);
        onOpenChange();
        router.push(`/courses/${courseCode}`);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleAddEnrollment = () => {
    if (!courseId) {
      toast.error("Course ID is required to add an enrollment.");
      return;
    }
    setEnrollments((prev) => [
      ...prev,
      {
        studentId: 0,
        courseId,
        classCode: "",
        enrollmentDate: new Date(),
      },
    ]);
  };

  const handleRemoveEnrollment = (index: number) => {
    setEnrollments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangeLesson = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setEnrollments((prev) =>
      prev.map((enrollment, i) =>
        i === index ? { ...enrollment, [field]: value } : enrollment
      )
    );
  };

  const handleSubmit = async () => {
    if (!courseId) {
      toast.error("Course ID is missing. Cannot create enrollments.");
      return;
    }
    try {
      const groupEnrollment: EnrollmentRequest[] = [];
      enrollments.forEach((enrollment) => {
        const request: EnrollmentRequest = {
          ...enrollment,
          courseId,
        };
        groupEnrollment.push(request);
      });
      const responses = await createEnrollment(groupEnrollment);

      if (!responses.data) {
        toast.error(`Failed to create enrollments`);
        return;
      }

      toast.success(`Enrollments created successfully`);
      setEnrollments([]);
      onOpenChange();
      router.push(`/courses/${courseCode}`);
    } catch (error) {
      console.log(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const exportToExcel = () => {
    if (!data || data.length === 0) {
      alert("No data available to export.");
      return;
    }

    const formattedData = data.map((enrollment, index) => ({
      No: index + 1,
      "Student Code": enrollment.student?.code || "",
      "Student Name": enrollment.student?.name || "Unknown",
      "Enrollment Date": DateToStringWithoutTime(enrollment.enrollmentDate),
      "Phone Number": enrollment.student?.phoneNumber || "",
      "Date Of Birth": DateToStringWithoutTime(
        new Date(enrollment.student?.dateOfBirth || "")
      ),
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Enrollments");

    XLSX.writeFile(workbook, "Enrollment.xlsx");
  };

  const rest: Rest | undefined = {
    totalElements: data.length,
    totalPages: 0,
    size: data.length,
    number: data.length,
    pageable: {
      pageNumber: 0,
      pageSize: data.length,
      offset: 0,
      sort: [],
      paged: true,
      unpaged: false,
    },
    sort: [],
    first: true,
    last: true,
    empty: false,
    numberOfElements: data.length,
  };

  return (
    <>
      <div className="flex justify-end mb-5">
        <button
          onClick={handleCreateClass}
          className={`px-4 py-2 text-white font-semibold rounded ${selectedEnrollments.length > 0
            ? "bg-green-500 hover:bg-green-400"
            : "bg-gray-300 cursor-not-allowed"
            }`}
          disabled={selectedEnrollments.length === 0}
        >
          Create Class
        </button>
      </div>
      <TableWrapper<IndexedEnrollmentDTO>
        rest={rest}
        columns={columns}
        renderCell={renderCell}
        data={data.map((c, i) => ({ index: i, ...c }))}
        isLoading={loading}
        showControls={false}
        isExport={exportToExcel}
      />
      {!isReadonly && !isNew && (
        <div className="flex justify-center mt-4">
          <Button isIconOnly color="primary" onPress={onOpen}>
            <IoMdAddCircleOutline size={30} />
          </Button>
        </div>
      )}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="w-full max-w-screen-md sm:max-w-sm md:max-w-xl lg:max-w-2xl xl:max-w-4xl">
          {(onClose) => (
            <>
              <ModalHeader>
                {currentEnrollment ? "Update Enrollment" : "Create Enrollment"}
              </ModalHeader>
              {!currentEnrollment ? (
                <ModalBody>
                  {enrollments.map((enrollment, index) => (
                    <div
                      key={index + "enrollment"}
                      className="flex flex-col md:flex-row gap-4 items-center justify-center w-full"
                    >
                      <h1 className="text-center mt-5">{index + 1}.</h1>
                      <SearchableStudentDropdown
                        initialStudents={students}
                        selectedId={enrollment.studentId}
                        onSelect={(student) =>
                          handleChangeLesson(index, "studentId", student.id)
                        }
                        onOpen={handleDropdownFocus}
                      />

                      <DatePicker
                        hideTimeZone
                        granularity="day"
                        minValue={today(getLocalTimeZone())}
                        isRequired
                        name="enrollmentDate"
                        label="Enrollment Date"
                        labelPlacement="outside"
                        variant="bordered"
                        onChange={(date) =>
                          handleChangeLesson(
                            index,
                            "enrollmentDate",
                            date?.toString() || ""
                          )
                        }
                      />
                      <Button
                        isIconOnly
                        className="flex items-center justify-center mt-6 rounded-full"
                        onPress={() => handleRemoveEnrollment(index)}
                      >
                        X
                      </Button>
                    </div>
                  ))}
                  <Button onPress={handleAddEnrollment}>Add Enrollment</Button>
                  <div className="flex justify-end gap-2">
                    <Button type="button" onPress={onClose}>
                      Cancel
                    </Button>
                    <Button onPress={handleSubmit} color="primary">
                      Save
                    </Button>
                  </div>
                </ModalBody>
              ) : (
                <ModalBody>
                  <form action={handleUpdate}>
                    <div className="flex flex-row gap-4 items-center mb-5">

                      <SearchableStudentDropdown
                        initialStudents={students}
                        selectedId={currentEnrollment.student.id}
                        onSelect={(student) =>
                          handleChangeLesson(0, "studentId", student.id)
                        }
                        onOpen={handleDropdownFocus}
                      />



                      <DatePicker
                        defaultValue={
                          currentEnrollment?.enrollmentDate
                            ? parseAbsolute(
                              currentEnrollment.enrollmentDate.toString(),
                              getLocalTimeZone()
                            )
                            : undefined
                        }
                        hideTimeZone
                        granularity="day"
                        minValue={today(getLocalTimeZone())}
                        isRequired
                        name="enrollmentDate"
                        label="Enrollment Date"
                        labelPlacement="outside"
                        variant="bordered"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button type="button" onPress={onClose}>
                        Cancel
                      </Button>
                      <SubmitButton />
                    </div>
                  </form>
                </ModalBody>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
