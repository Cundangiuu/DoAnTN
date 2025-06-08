package vn.codezx.arise.dtos.lesson;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import vn.codezx.arise.constants.TypeOfTest;
import vn.codezx.arise.dtos.base.BaseInfoDTO;
import vn.codezx.arise.dtos.testType.TestTypeDTO;

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
