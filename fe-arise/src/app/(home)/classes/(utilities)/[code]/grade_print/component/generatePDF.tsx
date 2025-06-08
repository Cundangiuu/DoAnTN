"use client";

import { GradeDTO } from "@/dtos";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generatePDF = async (grade: GradeDTO) => {
  const elements = document.querySelectorAll(".pdf-report");
  if (elements.length === 0) return;

  // Ensure the PDF renders with correct dimensions
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  // Process each element as a separate page
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i] as HTMLElement;

    // Make sure any scrollable content is expanded
    const scrollableElements = element.querySelectorAll(
      '.overflow-auto, [style*="overflow"]'
    );
    const originalStyles: { [key: string]: string } = {};

    scrollableElements.forEach((el, index) => {
      const htmlEl = el as HTMLElement;
      originalStyles[index] = htmlEl.style.overflow || "";
      htmlEl.style.overflow = "visible";

      if (htmlEl.classList.contains("max-h-24")) {
        htmlEl.classList.remove("max-h-24");
      }
    });

    // Apply higher quality settings
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: "#ffffff",
      onclone: (clonedDoc) => {
        // Ensure all content is visible in the cloned document too
        const clonedScrollables = clonedDoc.querySelectorAll(
          '.overflow-auto, [style*="overflow"]'
        );
        clonedScrollables.forEach((el) => {
          const htmlEl = el as HTMLElement;
          htmlEl.style.overflow = "visible";

          if (htmlEl.classList.contains("max-h-24")) {
            htmlEl.classList.remove("max-h-24");
          }
        });
      },
    });

    // Restore original styles
    scrollableElements.forEach((el, index) => {
      (el as HTMLElement).style.overflow = originalStyles[index];
    });

    const imgData = canvas.toDataURL("image/png");

    // Calculate dimensions to fit A4 properly
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add new page if not the first page
    if (i > 0) pdf.addPage();

    // Add with minimal margins
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  }

  // Use original filename format
  pdf.save(
    grade.classArise.name +
      "_" +
      grade.classArise.code +
      "_" +
      grade.testType.type +
      ".pdf"
  );
};
