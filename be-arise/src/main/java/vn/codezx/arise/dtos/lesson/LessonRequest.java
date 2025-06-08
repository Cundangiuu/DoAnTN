package vn.codezx.arise.dtos.lesson;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.codezx.arise.constants.TypeOfTest;
import vn.codezx.arise.utils.TypeOfTestDeserialize;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class LessonRequest {
  private String courseId;
  private String description;
  
  @JsonDeserialize(converter = TypeOfTestDeserialize.class)
  private TypeOfTest lessonType;
}
