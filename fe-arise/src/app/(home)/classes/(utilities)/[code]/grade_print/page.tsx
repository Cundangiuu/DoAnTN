"use client";

import { GradeDTO } from "@/dtos";
import { GradeService } from "@/services";
import { Button, Spinner } from "@nextui-org/react";
import { notFound, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { generatePDF } from "./component/generatePDF";
import ReportContent from "./component/gradeReportContent";

const ReportPage = () => {
  const searchParams = useSearchParams();
  const testType = searchParams.get("testType") || "MIDTERM";
  const classId = Number(searchParams.get("classId"));
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [grades, setGrades] = useState<GradeDTO[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const dataResponse = await GradeService.getAllGradesByClassId({
        testType: testType,
        classId: classId,
      });
      if (!dataResponse.data) return notFound();
      setGrades(dataResponse.data.content);
      setLoading(false);
    };

    fetchData();
  }, [classId, testType]);

  const handleDownload = async () => {
    if (grades.length === 0) return;

    try {
      setDownloading(true);
      await generatePDF(grades[0]);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 gap-2 relative">
      <Button
        onPress={handleDownload}
        color="primary"
        isDisabled={loading || grades.length === 0 || downloading}
        className="fixed right-8 top-20"
        startContent={
          downloading ? <Spinner size="sm" color="white" /> : <FiDownload />
        }
      >
        {downloading ? "Generating PDF..." : "Download PDF"}
      </Button>
      {loading && <Spinner color="primary" />}
      {!loading && grades.length === 0 && <p>No grades to print</p>}
      {grades.map((grade) => (
        <ReportContent key={grade.id} grade={grade} />
      ))}
    </div>
  );
};

export default ReportPage;
