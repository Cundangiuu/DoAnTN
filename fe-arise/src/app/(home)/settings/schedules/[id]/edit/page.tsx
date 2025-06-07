import NotFound from "@/app/not-found";
import { ScheduleService } from "@/services";
import Form from "../../components/Form";

type Props = {
  params: Promise<{ id: number }>;
};

const Page: React.FC<Props> = async ({ params }) => {
  const { id } = await params;

  const response = await ScheduleService.getSchedule(id);

  if (!response.data) {
    return <NotFound />;
  }

  return (
    <div>
      <Form schedule={response.data} />
    </div>
  );
};

export default Page;
