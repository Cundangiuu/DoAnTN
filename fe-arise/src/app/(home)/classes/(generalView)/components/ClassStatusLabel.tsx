import { ClassDTO } from "@/dtos/classes/ClassDTO";

const ClassStatusLabel = ({ classArise }: Readonly<{ classArise: ClassDTO }>) => {
  if (!classArise.startDate) {
    return <p className="font-bold text-slate-400">N/A</p>;
  }

  const classDays = classArise.classDays
    .map((c) => (c.classDate ? new Date(c.classDate).getTime() : undefined))
    .filter((c) => c !== undefined);
  const lastClassDate =
    classDays.length > 0 ? Math.max(...classDays) : undefined;

  if (new Date(classArise.startDate).getTime() > Date.now() || !lastClassDate) {
    return (
      <p className="font-bold whitespace-nowrap text-slate-200 uppercase px-2 bg-green-800 rounded-full">
        New
      </p>
    );
  }

  if (Date.now() < lastClassDate) {
    return (
      <p className="font-bold whitespace-nowrap text-slate-200 uppercase px-2 bg-blue-800 rounded-full">
        On Going
      </p>
    );
  }
  return (
    <p className="font-bold whitespace-nowrap text-slate-200 uppercase px-2 bg-slate-800 rounded-full">
      Ended
    </p>
  );
};

export default ClassStatusLabel;
