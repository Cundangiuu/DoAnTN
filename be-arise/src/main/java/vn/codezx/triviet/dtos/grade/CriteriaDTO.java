package vn.codezx.triviet.dtos.grade;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import vn.codezx.triviet.dtos.base.BaseInfoDTO;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class CriteriaDTO extends BaseInfoDTO {
  private int id;
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
