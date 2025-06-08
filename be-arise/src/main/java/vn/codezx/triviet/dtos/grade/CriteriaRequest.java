package vn.codezx.triviet.dtos.grade;

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
public class CriteriaRequest {
  private String attitude;
  private String homeworkCompletion;
  private String listening;
  private String speaking;
  private String reading;
  private String writing;
  private String vocabulary;
  private String grammar;
  private String progress;
}
