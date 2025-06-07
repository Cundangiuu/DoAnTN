import { StudentDTO } from "@/dtos";
import { getStudentById } from "@/services/StudentService";
import {
  Avatar,
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollShadow,
} from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";

type Props = {
  initialStudents: StudentDTO[]; // list to search/filter
  selectedId?: number;
  onSelect: (student: StudentDTO) => void;
  onOpen?: () => void;
};

export default function SearchableStudentDropdown({
  initialStudents,
  selectedId,
  onSelect,
  onOpen,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState<StudentDTO[]>(initialStudents);
  const [selectedStudent, setSelectedStudent] = useState<StudentDTO | null>(
    null
  );

  useEffect(() => {
    if (!selectedId) return;

    (async () => {
      try {
        const response = await getStudentById(selectedId);
        if (response.data) {
          setSelectedStudent(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch selected student:", error);
      }
    })();
  }, [selectedId]);

  // Update searchable list from parent
  useEffect(() => {
    setStudents(initialStudents);
  }, [initialStudents]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) =>
      `${s.code} ${s.name}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [students, search]);

  const handleSelect = (student: StudentDTO) => {
    onSelect(student);
    setSelectedStudent(student);
    setIsOpen(false);
    setSearch("");
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && onOpen) onOpen();
  };

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      placement="top-start"
      showArrow
    >
      <PopoverTrigger>
        <Button className="w-full justify-start text-left" variant="bordered">
          {selectedStudent
            ? `${selectedStudent.code} - ${selectedStudent.name}`
            : "Select a student"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[320px] p-3">
        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-lg font-semibold text-left">Select a student</h1>
          <Input
            size="sm"
            placeholder="Search for a student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ScrollShadow className="w-full max-h-[250px] mt-1">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <div
                  key={student.id}
                  onClick={() => handleSelect(student)}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer text-left w-full"
                >
                  <Avatar name={student.name} size="sm" />
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-medium">{student.code}</span>
                    <span className="text-xs text-gray-500">
                      {student.name}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-left text-gray-400 p-4">
                No students found
              </div>
            )}
          </ScrollShadow>
        </div>
      </PopoverContent>
    </Popover>
  );
}
