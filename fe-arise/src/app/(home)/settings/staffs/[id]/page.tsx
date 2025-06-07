import NotFound from "@/app/not-found";
import { getStaff } from "@/services/StaffService";
import React from "react";
import Form from "../components/Form";

type Props = {
  params: Promise<{ id: number }>;
};

const Page: React.FC<Props> = async ({ params }) => {
  const { id } = await params;

  const response = await getStaff(id);

  if (!response.data) {
    return <NotFound />;
  }

  return (
    <>
      <Form staff={response.data} />
    </>
  );
};

export default Page;
