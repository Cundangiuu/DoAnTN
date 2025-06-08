package vn.codezx.triviet.mappers.setting;

import org.springframework.stereotype.Component;
import vn.codezx.triviet.dtos.holiday_schedule.HolidayScheduleDTO;
import vn.codezx.triviet.entities.setting.HolidaySchedule;
import vn.codezx.triviet.mappers.DtoMapper;

@Component
public class HolidayScheduleToDTOMapper extends DtoMapper<HolidaySchedule, HolidayScheduleDTO> {
    @Override
    public HolidayScheduleDTO toDto(HolidaySchedule entity) {
        return HolidayScheduleDTO.builder().id(entity.getId()).startDate(entity.getStartDate())
                .endDate(entity.getEndDate()).holidayType(entity.getHolidayType())
                .description(entity.getDescription()).build();
    }
}
