import { Suspense } from "react";
import CourseContextProvider from "./context";
import CourseTable from "./components/CourseTable";

export default function CoursePage() {
  return (
    <Suspense>
      <CourseContextProvider>
        <CourseTable />
      </CourseContextProvider>
    </Suspense>
  );
}
