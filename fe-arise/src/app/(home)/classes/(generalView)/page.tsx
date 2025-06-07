import { classQuery } from "@/services/ClassService";
import { notFound, redirect } from "next/navigation";
import ClassTable from "./components/ClassTable";
import GeneralClassContextProvider from "./context";

type SearchParams = Promise<{ [key: string]: string | undefined }>

export default async function Classes(props: Readonly<{ searchParams: SearchParams }>) {
  const searchParams = await props.searchParams;

  const page = searchParams["page"]
    ? Number(searchParams["page"]) - 1
    : 0;
  const size = searchParams["size"] ? Number(searchParams["size"]) : 5;
  const searchString = searchParams["query"] ?? undefined;
  const status = searchParams["status"];
  const currentView = searchParams["view"] ?? undefined;

  const classesResponse = await classQuery(page, size, currentView, searchString, status)

  if (classesResponse.status === 401) {
    return redirect("/login");
  }

  if (!classesResponse.data) {
    notFound();
  }

  return (
    <GeneralClassContextProvider classes={classesResponse.data}>
      <ClassTable />
    </GeneralClassContextProvider>
  );
}
