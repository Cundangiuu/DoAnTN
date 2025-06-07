import NotFound from "@/app/not-found";
import { getStudent } from "@/services/StudentService";
import React from "react";
import Form from "../components/Form";
import SwitchTable from "../components/SwitchTable";

type Props = {
  params: Promise<{ code: string }>;
};

const Page: React.FC<Props> = async ({ params }) => {
  const { code } = await params;

  const response = await getStudent(code);
  if (!response.data) {
    return <NotFound />;
  }

  return (
    <>
      <Form student={response.data} />

      <SwitchTable studentCode={code} studentId={response.data.id} />
    </>
  );
};

export default Page;
