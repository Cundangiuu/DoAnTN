package vn.codezx.triviet.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.codezx.triviet.dtos.schedule.ScheduleDTO;
import vn.codezx.triviet.dtos.schedule.ScheduleRequest;

public interface ScheduleService {

  ScheduleDTO createSchedule(String requestId, ScheduleRequest scheduleRequest);

  Page<ScheduleDTO> getSchedules(String requestId, Pageable pageable);

  ScheduleDTO getSchedule(String requestId, Integer scheduleId);

  ScheduleDTO updateSchedule(String requestId, Integer scheduleId, ScheduleRequest scheduleRequest);

  ScheduleDTO deleteSchedule(String requestId, Integer scheduleId);
}
