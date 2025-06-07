import NotFound from "@/app/not-found";
import { getSchedule } from "@/services/ScheduleService";
import Form from "../components/Form";

type Props = {
  params: Promise<{ id: number }>;
};

const Page: React.FC<Props> = async ({ params }) => {
  const { id } = await params;

  const response = await getSchedule(id);

  if (!response.data) {
    return <NotFound />;
  }

  return <Form schedule={response.data} />;
};

export default Page;
