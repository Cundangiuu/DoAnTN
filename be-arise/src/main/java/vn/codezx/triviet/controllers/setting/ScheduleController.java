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
import vn.codezx.triviet.dtos.schedule.ScheduleDTO;
import vn.codezx.triviet.dtos.schedule.ScheduleRequest;
import vn.codezx.triviet.services.ScheduleService;

@RestController
@RequestMapping("/api/settings/schedules")
public class ScheduleController {

  private final ScheduleService scheduleService;

  ScheduleController(ScheduleService scheduleService) {
    this.scheduleService = scheduleService;
  }

  @PostMapping("/{request-id}")
  public ResponseEntity<ScheduleDTO> createSchedule(@PathVariable("request-id") String requestId,
      @RequestBody ScheduleRequest scheduleRequest) {
    return ResponseEntity.ok(scheduleService.createSchedule(requestId, scheduleRequest));
  }

  @GetMapping("/{request-id}")
  public ResponseEntity<Page<ScheduleDTO>> getSchedules(
      @PathVariable("request-id") String requestId, @SortDefault(sort = "createdAt",
          direction = Direction.DESC) @ParameterObject Pageable pageable) {
    return ResponseEntity.ok(scheduleService.getSchedules(requestId, pageable));
  }

  @GetMapping("/{request-id}/{schedule-id}")
  public ResponseEntity<ScheduleDTO> getSchedule(@PathVariable("request-id") String requestId,
      @PathVariable("schedule-id") Integer scheduleId) {
    return ResponseEntity.ok(scheduleService.getSchedule(requestId, scheduleId));
  }

  @PutMapping("/{request-id}/{schedule-id}")
  public ResponseEntity<ScheduleDTO> updateSchedule(@PathVariable("request-id") String requestId,
      @PathVariable("schedule-id") Integer scheduleId,
      @RequestBody ScheduleRequest scheduleRequest) {
    return ResponseEntity
        .ok(scheduleService.updateSchedule(requestId, scheduleId, scheduleRequest));
  }

  @DeleteMapping("/{request-id}/{schedule-id}")
  public ResponseEntity<ScheduleDTO> deleteDiscount(@PathVariable("request-id") String requestId,
      @PathVariable("schedule-id") Integer scheduleId) {
    return ResponseEntity.ok(scheduleService.deleteSchedule(requestId, scheduleId));
  }
}
