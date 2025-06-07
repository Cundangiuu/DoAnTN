"use client";

import { Pageable } from "@/dtos/base";
import { DiscountDTO } from "@/dtos/discount/DiscountDTO";
import { DiscountService } from "@/services";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Loading from "../../../../components/molecules/table/Loading";
import DiscountTable from "./components/DiscountTable";
import { DiscountContext } from "./context/DiscountContext";

const DiscountPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [discounts, setDiscounts] = useState<Pageable<DiscountDTO>>();
  const searchParams = useSearchParams();
  const page = searchParams.get("page")
    ? Number(searchParams.get("page")) - 1
    : 0;
  const size = searchParams.get("size") ? Number(searchParams.get("size")) : 5;

  useEffect(() => {
    const getDiscounts = async () => {
      setIsLoading(true);
      const response = await DiscountService.getAllDiscounts(page, size);
      setDiscounts(response.data);
      setIsLoading(false);
    };

    getDiscounts();
  }, [page, size]);

  return (
    <DiscountContext.Provider
      value={{ discounts, setDiscounts, isLoading, setIsLoading }}
    >
      <DiscountTable />
    </DiscountContext.Provider>
  );
};
const Page: React.FC = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <DiscountPage />
      </Suspense>
    </>
  );
};

export default Page;
