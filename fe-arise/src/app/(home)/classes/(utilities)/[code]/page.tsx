import { EditButton } from "@/components/molecules/form";
import Form from "../new/component/Form";

export default async function ClassDetail({
  params,
}: Readonly<{ params: Promise<{ code: string }> }>) {
  const { code } = await params;

  return (
    <>
      <div className="w-full mt-8 flex gap-3 justify-between">
        <h1 className="font-bold uppercase">{code}</h1>
        <EditButton href={`/classes/${code}/edit`} />
      </div>
      <Form isReadonly />
    </>
  );
}
