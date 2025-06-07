import { GroupActionButton } from "@/components";
import TableWrapper from "@/components/molecules/table/TableWrapper";
import { FormulaDTO } from "@/dtos/formula/FormulaDTO";
import { useMeaningfulContext } from "@/hooks";
import { useRouter } from "next/navigation";
import { FormulaContext } from "../context/FormulaContext";

const FormulaTable: React.FC = () => {
  const router = useRouter();
  const { isLoading, formulas } = useMeaningfulContext(FormulaContext);

  const data = formulas;

  const columns = [
    { name: "Name", key: "name", align: "start" },
    { name: "Action", key: "Action" },
  ];

  const renderCell = (key: string, data: FormulaDTO) => {
    switch (key) {
      case "name":
        return <div>{data.name}</div>;
      case "Action":
        return <GroupActionButton detailId={data.id} />;
    }
  };

  return (
    <TableWrapper<FormulaDTO>
      columns={columns}
      renderCell={renderCell}
      data={data?.content}
      isLoading={isLoading}
      onNew={() => router.push("/settings/formulas/new")}
    />
  );
};

export default FormulaTable;
