package vn.codezx.triviet.dtos.schedule;

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
public class ScheduleRequest {
  private String description;
  private Date startTime;
  private Date endTime;
  private String dayOfWeek;
}
