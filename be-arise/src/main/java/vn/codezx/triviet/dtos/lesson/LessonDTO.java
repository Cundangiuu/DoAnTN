package vn.codezx.triviet.dtos.lesson;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import vn.codezx.triviet.constants.TypeOfTest;
import vn.codezx.triviet.dtos.base.BaseInfoDTO;
import vn.codezx.triviet.dtos.testType.TestTypeDTO;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class LessonDTO extends BaseInfoDTO {
  private int id;
  private String description;
  private String courseCode;
  private TypeOfTest lessonType;
}
