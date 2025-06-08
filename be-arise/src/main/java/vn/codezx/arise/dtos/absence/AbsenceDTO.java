package vn.codezx.arise.dtos.absence;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import vn.codezx.arise.dtos.base.BaseInfoDTO;
import vn.codezx.arise.entities.course.ClassDay;
import vn.codezx.arise.entities.course.ClassArise;
import vn.codezx.arise.entities.student.Student;

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
