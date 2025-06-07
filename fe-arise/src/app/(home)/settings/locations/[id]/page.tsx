import NotFound from "@/app/not-found";
import { getLocation } from "@/services/LocationService";
import Form from "../components/Form";

type Props = {
  params: Promise<{ id: number }>;
};

const Page: React.FC<Props> = async ({ params }) => {
  const { id } = await params;

  const response = await getLocation(id);

  if (!response.data) {
    return <NotFound />;
  }

  return <Form location={response.data} />;
};

export default Page;
