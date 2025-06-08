package vn.codezx.arise.mappers.setting;

import org.springframework.stereotype.Component;
import vn.codezx.arise.dtos.schedule.ScheduleDTO;
import vn.codezx.arise.entities.setting.Schedule;
import vn.codezx.arise.mappers.DtoMapper;

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
