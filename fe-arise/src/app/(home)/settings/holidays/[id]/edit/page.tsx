import NotFound from "@/app/not-found";
import { HolidayService } from "@/services";
import Form from "../../components/Form";

type Props = {
  params: Promise<{ id: number }>;
};

const Page: React.FC<Props> = async ({ params }) => {
  const { id } = await params;

  const response = await HolidayService.getHoliday(id);

  if (!response.data) {
    return <NotFound />;
  }
  return <Form holiday={response.data} />;
};

export default Page;
