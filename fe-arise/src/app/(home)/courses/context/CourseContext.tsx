import { CourseDTO } from "@/dtos";
import { Pageable } from "@/dtos/base";
import { Selection } from "@nextui-org/react";
import { createContext } from "react";

interface CoursesContextProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  courses: Pageable<CourseDTO> | undefined;
  setCourses: (courses: Pageable<CourseDTO> | undefined) => void;
  filterValue: string | null;
  setFilterValue: (filterValue: string | null) => void;
  selection: Selection;
  setSelection: React.Dispatch<React.SetStateAction<Selection>>;
}

const CourseContext = createContext<CoursesContextProps | undefined>(undefined);

export { CourseContext };
