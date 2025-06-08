package vn.codezx.arise.mappers.setting;

import org.springframework.stereotype.Component;
import vn.codezx.arise.dtos.holiday_schedule.HolidayScheduleDTO;
import vn.codezx.arise.entities.setting.HolidaySchedule;
import vn.codezx.arise.mappers.DtoMapper;

@Component
public class HolidayScheduleToDTOMapper extends DtoMapper<HolidaySchedule, HolidayScheduleDTO> {
    @Override
    public HolidayScheduleDTO toDto(HolidaySchedule entity) {
        return HolidayScheduleDTO.builder().id(entity.getId()).startDate(entity.getStartDate())
                .endDate(entity.getEndDate()).holidayType(entity.getHolidayType())
                .description(entity.getDescription()).build();
    }
}
