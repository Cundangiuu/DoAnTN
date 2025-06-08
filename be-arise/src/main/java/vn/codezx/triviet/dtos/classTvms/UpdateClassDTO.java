package vn.codezx.triviet.dtos.classTvms;

import java.util.Date;
import java.util.List;
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
public class UpdateClassDTO {
  private Date startDate;
  private String className;
  private List<Integer> scheduleIds;
  private List<Integer> studentIds;
  private int staffId;
}
