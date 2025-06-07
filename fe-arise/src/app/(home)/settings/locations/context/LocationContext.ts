import { Pageable } from "@/dtos/base";
import { LocationDTO } from "@/dtos/location/LocationDTO";
import { createContext } from "react";

interface LocationContextProps {
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    locations: Pageable<LocationDTO> | undefined;
    setLocations: (students: Pageable<LocationDTO> | undefined) => void;
}

const LocationContext = createContext<LocationContextProps | undefined>(undefined);

export { LocationContext };
