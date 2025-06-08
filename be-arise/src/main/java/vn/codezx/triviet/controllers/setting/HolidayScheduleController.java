package vn.codezx.triviet.controllers.setting;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.SortDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.codezx.triviet.dtos.holiday_schedule.HolidayScheduleDTO;
import vn.codezx.triviet.dtos.holiday_schedule.HolidayScheduleRequest;
import vn.codezx.triviet.services.HolidayScheduleService;

@RestController
@RequestMapping("/api/settings/holiday-schedules")
public class HolidayScheduleController {
  private final HolidayScheduleService holidayScheduleService;

  HolidayScheduleController(HolidayScheduleService holidayScheduleService) {
    this.holidayScheduleService = holidayScheduleService;
  }

  @PostMapping("/{request-id}")
  public ResponseEntity<HolidayScheduleDTO> createHolidaySchedule(
      @PathVariable("request-id") String requestId,
      @RequestBody HolidayScheduleRequest holidayScheduleRequest) {
    return ResponseEntity
        .ok(holidayScheduleService.createHolidaySchedule(requestId, holidayScheduleRequest));
  }

  @GetMapping("/{request-id}")
  public ResponseEntity<Page<HolidayScheduleDTO>> getHolidaySchedules(
      @PathVariable("request-id") String requestId, @SortDefault(sort = "createdAt",
          direction = Direction.DESC) @ParameterObject Pageable pageable) {
    return ResponseEntity.ok(holidayScheduleService.getHolidaySchedules(requestId, pageable));
  }

  @GetMapping("/{request-id}/{holiday-schedule-id}")
  public ResponseEntity<HolidayScheduleDTO> getHolidaySchedule(
      @PathVariable("request-id") String requestId,
      @PathVariable("holiday-schedule-id") Integer holidayScheduleId) {
    return ResponseEntity
        .ok(holidayScheduleService.getHolidaySchedule(requestId, holidayScheduleId));
  }

  @PutMapping("/{request-id}/{holiday-schedule-id}")
  public ResponseEntity<HolidayScheduleDTO> updateHolidaySchedule(
      @PathVariable("request-id") String requestId,
      @PathVariable("holiday-schedule-id") Integer holidayScheduleId,
      @RequestBody HolidayScheduleRequest holidayScheduleRequest) {
    return ResponseEntity.ok(holidayScheduleService.updateHolidaySchedule(requestId,
        holidayScheduleId, holidayScheduleRequest));
  }

  @DeleteMapping("/{request-id}/{holiday-schedule-id}")
  public ResponseEntity<HolidayScheduleDTO> deleteHolidaySchedule(
      @PathVariable("request-id") String requestId,
      @PathVariable("holiday-schedule-id") Integer holidayScheduleId) {
    return ResponseEntity
        .ok(holidayScheduleService.deleteHolidaySchedule(requestId, holidayScheduleId));
  }
}
