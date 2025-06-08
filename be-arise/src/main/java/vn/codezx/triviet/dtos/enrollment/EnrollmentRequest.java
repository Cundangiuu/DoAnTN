package vn.codezx.triviet.dtos.enrollment;

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
public class EnrollmentRequest {

  private int studentId;
  private int courseId;
  private String classCode;
  private Date enrollmentDate;
}
