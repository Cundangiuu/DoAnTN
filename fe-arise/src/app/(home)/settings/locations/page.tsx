"use client";

import Loading from "@/components/molecules/table/Loading";
import { Pageable } from "@/dtos/base";
import { LocationDTO } from "@/dtos/location/LocationDTO";
import { LocationService } from "@/services";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import LocationTable from "./components/LocationTable";
import { LocationContext } from "./context/LocationContext";

const LocationPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [locations, setLocations] = useState<Pageable<LocationDTO>>();
  const searchParams = useSearchParams();
  const page = searchParams.get("page")
    ? Number(searchParams.get("page")) - 1
    : 0;
  const size = searchParams.get("size") ? Number(searchParams.get("size")) : 5;

  const getLocations = useCallback(async () => {
    setIsLoading(true);
    const response = await LocationService.getAllLocations(page, size);
    setLocations(response.data);
    setIsLoading(false);
  }, [page, size, setLocations]);

  useEffect(() => {
    getLocations();
  }, [getLocations]);

  return (
    <LocationContext.Provider
      value={{ locations, setLocations, isLoading, setIsLoading }}
    >
      <LocationTable />
    </LocationContext.Provider>
  );
};

const Page = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <LocationPage />
      </Suspense>
    </>
  );
};

export default Page;
