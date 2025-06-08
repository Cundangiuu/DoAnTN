package vn.codezx.triviet.dtos.absence;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import vn.codezx.triviet.dtos.base.BaseInfoDTO;
import vn.codezx.triviet.entities.course.ClassDay;
import vn.codezx.triviet.entities.course.ClassTvms;
import vn.codezx.triviet.entities.student.Student;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class AbsenceDTO extends BaseInfoDTO {

  private int id;
  private int studentId;
  private String classCode;
  private int classDayId;
  private Date classDate;
  private boolean checkAbsent;
}
