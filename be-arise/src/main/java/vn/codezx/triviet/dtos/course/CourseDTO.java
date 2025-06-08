package vn.codezx.triviet.dtos.course;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import vn.codezx.triviet.constants.CourseLevelConstants;
import vn.codezx.triviet.dtos.base.BaseInfoDTO;
import vn.codezx.triviet.dtos.enrollment.EnrollmentDTO;
import vn.codezx.triviet.dtos.lesson.LessonDTO;
import vn.codezx.triviet.dtos.formula.FormulaDTO;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class CourseDTO extends BaseInfoDTO {
  private int id;
  private String code;
  private String name;
  private float tuitionRate;
  private int numberHour;
  private String description;
  private FormulaDTO formula;
  private List<LessonDTO> lessons;
  private List<EnrollmentDTO> enrollments;
  private CourseLevelConstants courseLevel;
}
