package vn.codezx.triviet.dtos.enrollment;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import vn.codezx.triviet.entities.base.BaseInfo;
import vn.codezx.triviet.entities.student.Student;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class EnrollmentDTO extends BaseInfo {
  private int id;
  private Student student;
  private int courseId;
  private String className;
  private String classCode;
  private String courseCode;
  private String courseName;
  private Date enrollmentDate;
}
