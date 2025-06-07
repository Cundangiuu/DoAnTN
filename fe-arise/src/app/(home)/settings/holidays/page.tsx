"use client";

import Loading from "@/components/molecules/table/Loading";
import { Pageable } from "@/dtos/base";
import { HolidayDTO } from "@/dtos/holiday/HolidayDTO";
import { HolidayService } from "@/services";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import HolidayTable from "./components/HolidayTable";
import { HolidayContext } from "./context/HolidayContext";

const HolidayPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [holidays, setHolidays] = useState<Pageable<HolidayDTO>>();
  const searchParams = useSearchParams();
  const page = searchParams.get("page")
    ? Number(searchParams.get("page")) - 1
    : 0;
  const size = searchParams.get("size") ? Number(searchParams.get("size")) : 5;

  useEffect(() => {
    const getHolidays = async () => {
      setIsLoading(true);
      const response = await HolidayService.getAllHolidays(page, size);
      setHolidays(response.data);
      setIsLoading(false);
    };

    getHolidays();
  }, [page, size]);

  return (
    <HolidayContext.Provider
      value={{ holidays, setHolidays, isLoading, setIsLoading }}
    >
      <HolidayTable />
    </HolidayContext.Provider>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <HolidayPage />
    </Suspense>
  );
};

export default Page;
