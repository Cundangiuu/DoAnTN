package vn.codezx.arise.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.codezx.arise.dtos.holiday_schedule.HolidayScheduleDTO;
import vn.codezx.arise.dtos.holiday_schedule.HolidayScheduleRequest;

public interface HolidayScheduleService {
  HolidayScheduleDTO createHolidaySchedule(String requestId,
      HolidayScheduleRequest holidayScheduleRequest);

  Page<HolidayScheduleDTO> getHolidaySchedules(String requestId, Pageable pageable);

  HolidayScheduleDTO getHolidaySchedule(String requestId, Integer holidayScheduleId);

  HolidayScheduleDTO updateHolidaySchedule(String requestId, Integer holidayScheduleId,
      HolidayScheduleRequest holidayScheduleRequest);

  HolidayScheduleDTO deleteHolidaySchedule(String requestId, Integer holidayScheduleId);
}
