import { Pageable } from '@/dtos/base';
import { StudentDTO } from '@/dtos/student/StudentDTO';
import { Selection } from '@nextui-org/react';
import { createContext, Dispatch, SetStateAction } from 'react';

interface StudentContextProps {
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    students: Pageable<StudentDTO> | undefined;
    setStudents: (students: Pageable<StudentDTO> | undefined) => void;
    filterValue: string | null;
    setFilterValue: (filterValue: string | null) => void;
    hasAvatarValue: Selection
    setHasAvatarValue: Dispatch<SetStateAction<Selection>>;
}

const StudentContext = createContext<StudentContextProps | undefined>(undefined);


export { StudentContext };
