"use client";

import { useMeaningfulContext } from "@/hooks";
import { Fragment, useEffect } from "react";
import DropdownForm from "./Dropdown";
import { DropdownContext } from "./DropdownContextProvider";
import { FormContext } from "./FormContext";

export default function ScheduleDropdown() {
  const { searchValue, setOptions, selected, setLoading } =
    useMeaningfulContext(DropdownContext);
  const { schedules } = useMeaningfulContext(FormContext);

  useEffect(() => {
    setLoading(false);
    if (!schedules) return;
    setOptions(
      schedules
        .filter(
          (schedule) =>
            !selected.some((s) => s.key === schedule.code) &&
            schedule.code
              .toLowerCase()
              .includes(searchValue?.toLowerCase() ?? "")
        )
        .map((schedule) => ({
          key: schedule.code,
          value: JSON.stringify({
            id: schedule.id,
            code: schedule.code,
          }),
        }))
    );
  }, []);

  useEffect(() => {
    if (searchValue && schedules) {
      setOptions(
        schedules
          .filter(
            (schedule) =>
              !selected.some((s) => s.key === schedule.code) &&
              schedule.code
                .toLowerCase()
                .includes(searchValue?.toLowerCase() ?? "")
          )
          .map((schedule) => ({
            key: schedule.code,
            value: JSON.stringify({
              id: schedule.id,
              code: schedule.code,
            }),
          }))
      );
      setLoading(false);
    }
  }, [searchValue, schedules]);

  if (!schedules) {
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
    <DropdownForm>
      {schedules
        .filter(
          (schedule) =>
            !selected.some((s) => s.key === schedule.code) &&
            `${schedule.code}}`
              .toLowerCase()
              .includes(searchValue?.toLowerCase() ?? "")
        )
        .map((schedule) => (
          <Fragment key={schedule.id}>
            <p className="text-xs opacity-50">{schedule.code}</p>
            <p className="font-bold mt-1">
              <span className="underline font-normal">
                {schedule.dayOfWeek}:
              </span>{" "}
              {schedule.startTime.split(" ")[1].substring(0, 5)} -{" "}
              {schedule.endTime.split(" ")[1].substring(0, 5)}
            </p>
          </Fragment>
        ))}
    </DropdownForm>
  );
}
