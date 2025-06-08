package vn.codezx.triviet.mappers.setting;

import org.springframework.stereotype.Component;
import vn.codezx.triviet.dtos.schedule.ScheduleDTO;
import vn.codezx.triviet.entities.setting.Schedule;
import vn.codezx.triviet.mappers.DtoMapper;

@Component
public class ScheduleToDTOMapper extends DtoMapper<Schedule, ScheduleDTO> {
  @Override
  public ScheduleDTO toDto(Schedule entity) {
    return ScheduleDTO.builder().id(entity.getId()).description(entity.getDescription())
        .code(entity.getCode()).startTime(entity.getStartTime().toString())
        .endTime(entity.getEndTime().toString()).dayOfWeek(entity.getDayOfWeek().name())
        .createdAt(entity.getCreatedAt()).createdBy(entity.getCreatedBy())
        .updatedAt(entity.getUpdatedAt()).updatedBy(entity.getUpdatedBy()).build();
  }
}
