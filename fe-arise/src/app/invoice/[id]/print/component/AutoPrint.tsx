"use client";  // This makes it a client component

import { useEffect } from "react";

export default function AutoPrint() {
  useEffect(() => {
    setTimeout(() => {
      window.print();
    }, 500); // Delay ensures the page is fully rendered before printing
  }, []);

  return null; // No UI needed, it just triggers printing
}
