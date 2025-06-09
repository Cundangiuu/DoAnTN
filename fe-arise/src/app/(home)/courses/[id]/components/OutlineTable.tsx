"use client";

import { ActionButton, DeleteActionButton } from "@/components";
import { SubmitButton } from "@/components/molecules/form";
import TableWrapper from "@/components/molecules/table/TableWrapper";
import { Rest } from "@/components/type";
import { LessonRequest, TypeOfLesson } from "@/dtos";
import { LessonDTO } from "@/dtos/lesson/LessonDTO";
import {
  createLesson,
  deleteLesson,
  updateLesson,
} from "@/services/LessonService";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
  Select,
  SelectItem,
  ButtonGroup,
  Textarea,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaPen } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import { toast } from "sonner";
import * as XLSX from "xlsx";

type Props = {
  defaultLessons?: LessonDTO[];
  disabled?: boolean;
  isReadonly?: boolean;
  isNew?: boolean;
  courseCode?: string;
};

type IndexedOutlineDTO = {
  index: number;
} & LessonDTO;

export default function OutlineTable({
  defaultLessons,
  isReadonly,
  isNew,
  courseCode,
}: Readonly<Props>) {
  const router = useRouter();
  const [data] = useState(defaultLessons ?? []);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentLesson, setCurrentLesson] = useState<LessonDTO | null>(null);
  const [lessons, setLessons] = useState<Array<LessonRequest>>([]);
  const [loading, setLoading] = useState(false);

    const columns = [
    { name: "STT", key: "index", align: "start" },            // STT = Số thứ tự
    { name: "Mô tả", key: "description", align: "left" },     // Mô tả nội dung bài học
    { name: "Loại bài học", key: "lessonType" },              // Kiểu bài học (Lý thuyết / Thực hành / Trắc nghiệm, v.v.)
    { name: "Thao tác", key: "action" },                      // Nút hành động (sửa, xóa, v.v.)
  ];


  const deleteAction = async (id: number) => {
    setLoading(true);
    const response = await deleteLesson(id);
    if (response.status !== 200) {
      toast.error("Failed to delete lesson");
      return response;
    }

    toast.success("Lesson deleted");
    if (!lessons) {
      return response;
    }
    setLoading(false);
    window.location.reload();
    return response;
  };

  const renderCell = (key: string, data: IndexedOutlineDTO) => {
    switch (key) {
      case "index":
        return <p>{data[key] + 1}</p>;
      case "description":
        return (
          <p className="w-full p-2 rounded whitespace-pre-line">
            {data.description}
          </p>
        );
      case "lessonType":
        return <span>{data.lessonType}</span>;
      case "action":
        return (
          <div className="w-full relative flex justify-center">
            <ButtonGroup>
              {isReadonly && (
                <ActionButton
                  icon={FaPen}
                  onClick={() => {
                    setCurrentLesson(data);
                    onOpen();
                  }}
                />
              )}

              <DeleteActionButton
                action={deleteAction}
                objectName="lesson"
                afterDelete={() => {}}
                id={data.id}
                isIconOnly={true}
              />
            </ButtonGroup>
          </div>
        );
    }
  };

  const handleAddLesson = () => {
    setLessons((prev) => [
      ...prev,
      {
        courseId: courseCode || "",
        description: "",
        lessonType: null,
      },
    ]);
  };

  const handleRemoveLesson = (index: number) => {
    setLessons((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangeLesson = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setLessons((prev) =>
      prev.map((lesson, i) =>
        i === index ? { ...lesson, [field]: value } : lesson
      )
    );
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

  const handleUpdate = async (formData: FormData) => {
    const testType = formData.get("lessonType") as TypeOfLesson;
    const description = formData.get("description") as string;
    if (!courseCode) {
      toast.error("Course not found");
      return;
    }
    const lessonRequest: LessonRequest = {
      courseId: courseCode,
      description: description,
      lessonType: testType,
    };
    try {
      let response;
      if (currentLesson) {
        response = await updateLesson(lessonRequest, currentLesson.id);
        if (!response.data) {
          toast.error(`Failed to create lesson`);
        }

        toast.success(`lesson update successfully`);
        onOpenChange();
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleSubmit = async () => {
    try {
      const responses = await createLesson(lessons);

      if (!responses.data) {
        toast.error(`Failed to create some lessons`);
        return;
      }

      toast.success(`Lessons created successfully`);
      setLessons([]);
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

    const formattedData = data.map((lesson, index) => ({
      No: index + 1,
      Description: lesson.description || "",
      "Lesson Type": lesson.lessonType || "Unknown",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Lessons");

    XLSX.writeFile(workbook, "Lesson.xlsx");
  };

  return (
    <>
      <TableWrapper<IndexedOutlineDTO>
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
                {currentLesson ? "Update Lesson" : "Create Lesson"}
              </ModalHeader>
              {!currentLesson ? (
                <ModalBody>
                  {lessons.map((lesson, index) => (
                    <div
                      key={index + "lesson"}
                      className="flex flex-col md:flex-row gap-4 items-center justify-center w-full"
                    >
                      <h1 className="text-center mt-5">{index + 1}.</h1>
                      <Select
                        name="lessonType"
                        label="Test Type"
                        placeholder="Select Test Type"
                        className="max-w-xs text-center"
                        labelPlacement="outside"
                        defaultSelectedKeys={
                          lesson?.lessonType ? [lesson?.lessonType] : []
                        }
                        onSelectionChange={(selected) => {
                          const selectedValue = Array.from(selected)[0];
                          handleChangeLesson(
                            index,
                            "lessonType",
                            selectedValue
                          );
                        }}
                      >
                        {Object.values(TypeOfLesson).map((value) => (
                          <SelectItem value={value} key={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </Select>
                      <Textarea
                        label="Description"
                        name="description"
                        placeholder="Enter description"
                        className="w-full p-2 text-center"
                        rows={3}
                        defaultValue={lesson?.description}
                        onChange={(e) =>
                          handleChangeLesson(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        required
                      />
                      <Button
                        isIconOnly
                        onPress={() => handleRemoveLesson(index)}
                        className="flex items-center justify-center rounded-full"
                      >
                        X
                      </Button>
                    </div>
                  ))}
                  <div className="flex justify-center mt-6">
                    <Button
                      isIconOnly
                      color="primary"
                      onPress={handleAddLesson}
                      className="flex items-center justify-center mt-6 w-12 h-12 rounded-full"
                    >
                      <IoMdAddCircleOutline size={30} />
                    </Button>
                  </div>
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
                      <Select
                        name="lessonType"
                        label="Test Type"
                        placeholder="Select Test Type"
                        className="max-w-xs"
                        labelPlacement="outside"
                        defaultSelectedKeys={
                          currentLesson?.lessonType
                            ? [currentLesson.lessonType]
                            : []
                        }
                      >
                        {Object.values(TypeOfLesson).map((value) => (
                          <SelectItem value={value} key={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </Select>
                      <Textarea
                        label="Description"
                        name="description"
                        placeholder="Enter description"
                        className="w-full p-2 text-center"
                        rows={3}
                        defaultValue={currentLesson?.description}
                        required
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
