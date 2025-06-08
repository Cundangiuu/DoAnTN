package vn.codezx.triviet.dtos.course;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.codezx.triviet.constants.CourseLevelConstants;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class CourseExportDTO {
  private String code;
  private String name;
  private float tuitionRate;
  private int numberHour;
  private String description;
  private CourseLevelConstants courseLevel;
}
