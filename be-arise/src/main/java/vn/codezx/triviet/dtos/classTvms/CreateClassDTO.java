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
public class CreateClassDTO {
  private Date startDate;
  private List<Integer> scheduleIds;
  private String className;
  private int courseId;
  private List<Integer> studentIds;
  private int staffId;
}
