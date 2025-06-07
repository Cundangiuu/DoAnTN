import NotFound from "@/app/not-found";
import { getFormula } from "@/services/FormulaService";
import React from "react";
import Form from "../../components/Form";

type Props = {
  params: Promise<{ id: number }>;
};

const Page: React.FC<Props> = async ({ params }) => {
  const { id } = await params;

  const response = await getFormula(id);

  if (!response.data) {
    return <NotFound />;
  }
  return <Form formula={response.data} />;
};

export default Page;
