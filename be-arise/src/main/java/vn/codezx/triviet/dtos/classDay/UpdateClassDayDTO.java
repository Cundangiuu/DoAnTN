package vn.codezx.triviet.dtos.classDay;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class UpdateClassDayDTO {
    int id;
    Date classDate;
    Integer teacherId;
    Integer locationId;
    Integer scheduleId;
}
