import Form from "../../new/component/Form";

export default async function ClassEdit({
  params,
}: Readonly<{ params: Promise<{ code: string }> }>) {
  const { code } = await params;

  return (
    <>
      <div className="w-full mt-8 flex gap-3 justify-between">
        <h1 className="font-bold uppercase">{code}</h1>
      </div>
      <Form
        operation="update"
        showGrades={false}
        showSchedule={false}
      />
    </>
  );
}
