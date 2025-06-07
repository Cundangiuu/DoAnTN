"use client";

import {
  EditButton,
  SelectInput,
  SubmitButton,
} from "@/components/molecules/form";
import { NewOrEditContext } from "@/contexts/NewOrEditContext";
import { LocationDTO, LocationRequestDTO, ScheduleDTO } from "@/dtos";
import { useMeaningfulContext } from "@/hooks";
import { LocationService, ScheduleService } from "@/services";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  location?: LocationDTO;
};

const branchOptions: { key: string; label: string }[] = [
  { key: "Branch 1", label: "Branch 1" },
  { key: "Branch 2", label: "Branch 2" },
];

const roomOptions: Record<string, { key: string; label: string }[]> = {
  "Branch 1": [
    { key: "Room 1", label: "Room 1" },
    { key: "Room 2", label: "Room 2" },
    { key: "Room 3", label: "Room 3" },
    { key: "Room 4", label: "Room 4" },
    { key: "Room 5", label: "Room 5" },
    { key: "Room 6", label: "Room 6" },
    { key: "Room 7", label: "Room 7" },
    { key: "Room 8", label: "Room 8" },
    { key: "Room 9", label: "Room 9" },
    { key: "Room 10", label: "Room 10" },
  ],
  "Branch 2": [
    { key: "Room 1", label: "Room 1" },
    { key: "Room 2", label: "Room 2" },
    { key: "Room 3", label: "Room 3" },
    { key: "Room 4", label: "Room 4" },
    { key: "Room 5", label: "Room 5" },
    { key: "Room 6", label: "Room 6" },
    { key: "Room 7", label: "Room 7" },
    { key: "Room 8", label: "Room 8" },
    { key: "Room 9", label: "Room 9" },
    { key: "Room 10", label: "Room 10" },
  ],
};

const Form: React.FC<Props> = ({ location }) => {
  const [schedules, setSchedules] = useState<ScheduleDTO[] | undefined>();
  const router = useRouter();
  const [formSubmitting, setFormSubmitting] = useState(false);
  const { isNew, isEdit } = useMeaningfulContext(NewOrEditContext);

  const { handleSubmit, control, watch } = useForm<LocationRequestDTO>({
    defaultValues: {
      branch: location?.branch,
      room: location?.room,
      scheduleIds: location?.scheduleIds || [],
    },
  });

  const selectedBranch: string | undefined = watch("branch");

  const fetchSchedules = useCallback(async () => {
    try {
      const response = await ScheduleService.getAllSchedules();
      setSchedules(response.data?.content || []);
    } catch (error) {
      console.error("Error fetching schedules: ", error);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const onSubmit: SubmitHandler<LocationRequestDTO> = async (locationData) => {
    try {
      setFormSubmitting(true);
      const response = location
        ? await LocationService.updateLocation(locationData, location.id)
        : await LocationService.createLocation(locationData);

      if (!response.data) {
        toast.error(`Failed to ${isNew ? "create" : "update"} location`);
        return;
      }

      toast.success(`${isNew ? "Created" : "Updated"} location successfully!`);
      router.push(`/settings/locations/${response.data.id}`);
    } catch (error) {
      console.error("Error submitting the form: ", error);
      toast.error(`Failed to ${isNew ? "create" : "update"} location`);
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-3 my-5 justify-end">
        {!isEdit && !isNew ? (
          <EditButton
            href={`/settings/locations/${(location as LocationDTO)?.id}/edit`}
          />
        ) : (
          <SubmitButton isLoading={formSubmitting} />
        )}
        {/* {location && (
          <DeleteActionButton
            id={location.id}
            action={LocationService.deleteLocation}
            objectName={"Location"}
            afterDelete={() => router.push("/settings/locations")}
          />
        )} */}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <SelectInput
            control={control}
            name="branch"
            label="Branch"
            defaultSelectedKey={location && [location.branch]}
            required
            options={branchOptions}
            isDisable={location && !isEdit && !isNew}
          />
        </div>
        <div>
          <SelectInput
            control={control}
            name="room"
            label="Room"
            required
            defaultSelectedKey={location && [location.room]}
            isDisable={!selectedBranch || (location && !isEdit && !isNew)}
            options={roomOptions[selectedBranch] || []}
          />
        </div>
        <div>
          <SelectInput
            control={control}
            name="scheduleIds"
            label="Schedules"
            required
            multiple
            defaultSelectedKey={
              location && location.scheduleIds.map((id) => id.toString())
            }
            isDisable={location && !isEdit && !isNew}
            options={
              schedules?.map((schedule) => ({
                key: schedule.id,
                label: schedule.code,
              })) || []
            }
          />
        </div>
      </div>
    </form>
  );
};

export default Form;
