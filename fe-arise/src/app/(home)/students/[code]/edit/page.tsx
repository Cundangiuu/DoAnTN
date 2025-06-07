import React from "react";
import { getStudent } from "@/services/StudentService";
import Form from "../../components/Form";
import NotFound from "@/app/not-found";

type Props = {
  params: Promise<{ code: string }>;
};

const Page: React.FC<Props> = async ({ params }) => {
  const { code } = await params;

  const response = await getStudent(code);

  if (!response.data) {
    return <NotFound />;
  }
  return <Form student={response.data} />;
};

export default Page;
