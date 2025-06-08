package vn.codezx.triviet.dtos.holiday_schedule;

import java.util.Date;
import com.google.auto.value.AutoValue.Builder;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class HolidayScheduleRequest {
    private Date startDate;
    private Date endDate;
    private String holidayType;
    private String description;
}
