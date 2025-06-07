import { useMeaningfulContext } from "@/hooks";
import { Button } from "@nextui-org/react";
import { ComponentProps, Fragment, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import DropdownForm from "./Dropdown";
import { DropdownContext } from "./DropdownContextProvider";
import { FormContext } from "./FormContext";

type Props = {
  color?: ComponentProps<typeof Button>["color"];
  scheduleIds?: number[];
  utilities?: React.ReactNode;
};
export default function LocationDropdown({
  color,
  scheduleIds,
  utilities,
}: Readonly<Props>) {
  const { searchValue, setOptions, selected } =
    useMeaningfulContext(DropdownContext);
  const { locations } = useMeaningfulContext(FormContext);

  useEffect(() => {
    if (!locations) return;
    const sv = searchValue ?? "";
    const sch = scheduleIds ?? [];

    const filteredLocations = locations.filter(
      (l) =>
        (l.branch.toLowerCase().includes(sv.toLowerCase()) ||
          l.room.toLowerCase().includes(sv.toLowerCase())) &&
        sch.some((s) => l.scheduleIds.includes(s))
    );
    setOptions(
      filteredLocations.map((location) => ({
        key: `${location.branch} - ${location.room}`,
        value: location.id.toString(),
      }))
    );
  }, [searchValue, locations, scheduleIds]);

  if (!locations) {
    return (
      <DropdownForm>
        {[
          <p className="text-xs opacity-50" key={-1}>
            Failed to load schedules
          </p>,
        ]}
      </DropdownForm>
    );
  }

  return (
    <DropdownForm
      utilities={utilities}
      trigger={
        <Button
          variant="flat"
          color={color}
          size="sm"
          endContent={<IoIosArrowDown />}
        >
          {selected.length == 0 ? "N/A" : selected.map((s) => s.key)}
        </Button>
      }
    >
      {locations
        .filter((l) => {
          const sv = searchValue ?? "";
          const sch = scheduleIds ?? [];
          return (
            (l.branch.toLowerCase().includes(sv.toLowerCase()) ||
              l.room.toLowerCase().includes(sv.toLowerCase())) &&
            sch.some((s) => l.scheduleIds.includes(s))
          );
        })
        .filter(
          (location) =>
            !selected.some(
              (s) => s.key === `${location.branch} - ${location.room}`
            )
        )
        .slice(0, 5)
        .map((location) => (
          <Fragment key={location.id}>
            <p className="text-xs opacity-50">{location.code}</p>
            <p className="font-bold">
              {location.branch} - {location.room}
            </p>
          </Fragment>
        ))}
    </DropdownForm>
  );
}
