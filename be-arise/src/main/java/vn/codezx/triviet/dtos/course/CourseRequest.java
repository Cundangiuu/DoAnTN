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
public class CourseRequest {

  private String name;
  private int tuitionRate;
  private int numberHour;
  private CourseLevelConstants courseLevelConstants;
  private String description;
}
