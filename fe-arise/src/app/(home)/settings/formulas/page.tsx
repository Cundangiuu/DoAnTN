"use client";

import Loading from "@/components/molecules/table/Loading";
import { Pageable } from "@/dtos/base";
import { FormulaDTO } from "@/dtos/formula/FormulaDTO";
import { FormulaService } from "@/services";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import FormulaTable from "./components/FormulaTable";
import { FormulaContext } from "./context/FormulaContext";

const FormulaPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [formulas, setFormulas] = useState<Pageable<FormulaDTO>>();
  const searchParams = useSearchParams();
  const page = searchParams.get("page")
    ? Number(searchParams.get("page")) - 1
    : 0;
  const size = searchParams.get("size") ? Number(searchParams.get("size")) : 5;

  useEffect(() => {
    const getFormulas = async () => {
      setIsLoading(true);
      const response = await FormulaService.getAllFormulas(page, size);
      setFormulas(response.data);
      setIsLoading(false);
    };

    getFormulas();
  }, [page, size]);

  return (
    <FormulaContext.Provider
      value={{ isLoading, setIsLoading, formulas, setFormulas }}
    >
      <FormulaTable />
    </FormulaContext.Provider>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <FormulaPage />
    </Suspense>
  );
};

export default Page;
