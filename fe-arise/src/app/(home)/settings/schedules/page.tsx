"use client";

import { Pageable } from "@/dtos/base";
import { ScheduleDTO } from "@/dtos/schedule/ScheduleDTO";
import { ScheduleService } from "@/services";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import Loading from "../../../../components/molecules/table/Loading";
import ScheduleTable from "./components/ScheduleTable";
import { ScheduleContext } from "./context/ScheduleContext";

const SchedulePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [schedules, setSchedules] = useState<Pageable<ScheduleDTO>>();
  const searchParams = useSearchParams();
  const page = searchParams.get("page")
    ? Number(searchParams.get("page")) - 1
    : 0;
  const size = searchParams.get("size") ? Number(searchParams.get("size")) : 5;

  const getSchedules = useCallback(async () => {
    setIsLoading(true);
    const response = await ScheduleService.getAllSchedules(page, size);
    setSchedules(response.data);
    setIsLoading(false);
  }, [page, size, setSchedules]);

  useEffect(() => {
    getSchedules();
  }, [getSchedules]);

  return (
    <ScheduleContext.Provider
      value={{
        schedules,
        setSchedules,
        isLoading,
        setIsLoading,
      }}
    >
      <ScheduleTable />
    </ScheduleContext.Provider>
  );
};

const Page: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <SchedulePage />
    </Suspense>
  );
};

export default Page;
