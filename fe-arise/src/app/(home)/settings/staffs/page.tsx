"use client";

import Loading from "@/components/molecules/table/Loading";
import { Pageable } from "@/dtos/base";
import { StaffDTO } from "@/dtos/staff/StaffDTO";
import { StaffService } from "@/services";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import StaffTable from "./components/StaffTable";
import { StaffContext } from "./context/StaffContext";

const StaffsPage = () => {
  const [staffs, setStaffs] = useState<Pageable<StaffDTO>>();
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const page = searchParams.get("page")
    ? Number(searchParams.get("page")) - 1
    : 0;

  const size = searchParams.get("size") ? Number(searchParams.get("size")) : 5;
  useEffect(() => {
    const getStaffs = async () => {
      setIsLoading(true);
      const response = await StaffService.getAllStaffs(page, size);
      setStaffs(response.data);
      setIsLoading(false);
    };

    getStaffs();
  }, [page, size]);
  return (
    <StaffContext.Provider
      value={{
        staffs,
        setStaffs,
        isLoading,
        setIsLoading,
      }}
    >
      <StaffTable />
    </StaffContext.Provider>
  );
};

const Page: React.FC = () => (
  <Suspense fallback={<Loading />}>
    <StaffsPage />
  </Suspense>
);

export default Page;
