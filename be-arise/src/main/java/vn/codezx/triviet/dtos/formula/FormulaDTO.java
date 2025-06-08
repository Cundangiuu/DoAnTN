package vn.codezx.triviet.dtos.formula;

import java.util.List;
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
public class FormulaDTO extends BaseInfoDTO {
  private int id;
  private String name;
  private Float midtermListeningMaxScore;
  private Float midtermReadingMaxScore;
  private Float midtermWritingMaxScore;
  private Float midtermSpeakingMaxScore;
  private String midtermSumFormula;
  private String midtermPercentageFormula;
  private String midtermClassificationFormula;
  private Float finalListeningMaxScore;
  private Float finalReadingMaxScore;
  private Float finalWritingMaxScore;
  private Float finalSpeakingMaxScore;
  private String finalSumFormula;
  private String finalPercentageFormula;
  private String finalClassificationFormula;
  private Float midtermGradeWeight;
  private Float finalGradeWeight;
  private Float bonusGradeWeight;
  private String classificationFormula;
  private List<Integer> courseIds;
}
