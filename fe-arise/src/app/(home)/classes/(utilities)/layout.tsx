import { LocationDTO, ScheduleDTO } from "@/dtos";
import { getAllLocations } from "@/services/LocationService";
import { getAllSchedules } from "@/services/ScheduleService";
import { notFound } from "next/navigation";
import FormContextProvider from "./new/component/Form/FormContext";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const count = 1_500_000;
    const schedulePromise = getAllSchedules(0, count);
    const locationPromise = getAllLocations(0, count);

    let schedules: ScheduleDTO[] = []
    let locations: LocationDTO[] = []

    try {
        const [scheduleResponse, locationResponse] = await Promise.all([schedulePromise, locationPromise])
        if (!scheduleResponse.data) {
            notFound();
        } else {
            schedules = scheduleResponse.data.content
        }

        if (!locationResponse.data) {
            notFound();
        } else {
            locations = locationResponse.data.content
        }
    } catch (e) {
        console.log("Error fetching schedules or locations", e);
        notFound()
    }


    return (
        <FormContextProvider schedules={schedules} locations={locations}>
            <div className="mt-6">
                <div className="flex flex-col gap-4">{children}</div>
            </div>
        </FormContextProvider>
    );
}