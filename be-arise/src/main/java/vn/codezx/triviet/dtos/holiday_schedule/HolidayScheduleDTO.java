package vn.codezx.triviet.dtos.holiday_schedule;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import vn.codezx.triviet.dtos.base.BaseInfoDTO;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class HolidayScheduleDTO extends BaseInfoDTO {
    private int id;
    private Date startDate;
    private Date endDate;
    private String holidayType;
    private String description;
}
