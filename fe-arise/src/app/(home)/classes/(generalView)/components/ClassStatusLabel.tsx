import { ClassDTO } from "@/dtos/classes/ClassDTO";

const ClassStatusLabel = ({ classArise }: Readonly<{ classArise: ClassDTO }>) => {
  if (!classArise.startDate) {
    return <p className="font-semibold text-gray-600">Không có</p>;
  }

  const classDays = classArise.classDays
    .map((c) => (c.classDate ? new Date(c.classDate).getTime() : undefined))
    .filter((c) => c !== undefined);
  const lastClassDate =
    classDays.length > 0 ? Math.max(...classDays) : undefined;

  if (new Date(classArise.startDate).getTime() > Date.now() || !lastClassDate) {
    return (
      <p className="font-semibold whitespace-nowrap text-white uppercase px-3 py-1 bg-green-500 rounded-full text-xs">
        Mới
      </p>
    );
  }

  if (Date.now() < lastClassDate) {
    return (
      <p className="font-semibold whitespace-nowrap text-white uppercase px-3 py-1 bg-blue-500 rounded-full text-xs">
        Đang diễn ra
      </p>
    );
  }
  return (
    <p className="font-semibold whitespace-nowrap text-white uppercase px-3 py-1 bg-gray-500 rounded-full text-xs">
        Đã kết thúc
    </p>
  );
};

export default ClassStatusLabel;