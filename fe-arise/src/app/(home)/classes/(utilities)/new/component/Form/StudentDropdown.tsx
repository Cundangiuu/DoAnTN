import { Pageable } from "@/dtos/base";
import { StudentDTO } from "@/dtos/student/StudentDTO";
import { useMeaningfulContext } from "@/hooks";
import { getAllStudentsWithoutDept } from "@/services/StudentService";
import { Button, User } from "@nextui-org/react";
import { Fragment, useEffect, useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { toast } from "sonner";
import DropdownForm from "./Dropdown";
import { DropdownContext } from "./DropdownContextProvider";

type Props = {
  setSelected: (selected: string[]) => void;
};

export default function StudentDropdown({ setSelected }: Readonly<Props>) {
  const {
    searchValue,
    setLoading,
    loading,
    setOptions,
    selected: selectedOptions,
  } = useMeaningfulContext(DropdownContext);
  const [students, setStudents] = useState<Pageable<StudentDTO>>();

  useEffect(() => {
    const getStudent = async () => {
      if (!loading) {
        setLoading(true);
      }
      const response = await getAllStudentsWithoutDept(0, 5, searchValue);
      setLoading(false);
      if (!response.data) {
        toast.error("Failed to fetch students");
        return;
      }

      setStudents(response.data);
      setOptions(
        response.data.content.map((student) => ({
          key: `${student.code} - ${student.name} (${student.nickname})`,
          value: JSON.stringify({ code: student.code, id: student.id }),
        }))
      );
    };

    getStudent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  useEffect(() => {
    setSelected(selectedOptions.map((s) => s.value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOptions]);

  return (
    <DropdownForm
      showSelectedLabel={false}
      placement="bottom-end"
      trigger={
        <Button
          color="primary"
          startContent={<IoMdAddCircleOutline size={20} />}
          size="sm"
          aria-label="add-student"
          className="uppercase"
        >
          Manage students
        </Button>
      }
    >
      {students?.content
        .filter(
          (student) =>
            !selectedOptions.some(
              (s) =>
                s.key ===
                `${student.code} - ${student.name} (${student.nickname})`
            )
        )
        .map((student) => (
          <Fragment key={student.id}>
            <p className="text-xs opacity-50">{student.code}</p>
            <User
              {...(student.avatarUrl
                ? {
                    avatarProps: {
                      src: `/api/images?filePath=${student.avatarUrl}`,
                    },
                  }
                : {})}
              description={student.emailAddress}
              name={`${student.name} (${student.nickname})`}
            >
              {student.name}
            </User>
          </Fragment>
        ))}
    </DropdownForm>
  );
}
