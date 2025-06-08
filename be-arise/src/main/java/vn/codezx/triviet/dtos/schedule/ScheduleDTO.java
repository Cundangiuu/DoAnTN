package vn.codezx.triviet.dtos.schedule;

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
public class ScheduleDTO extends BaseInfoDTO {
  private int id;
  private String code;
  private String description;
  private String startTime;
  private String endTime;
  private String dayOfWeek;
}
