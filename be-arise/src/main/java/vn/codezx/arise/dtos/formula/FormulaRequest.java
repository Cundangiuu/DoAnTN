package vn.codezx.arise.dtos.formula;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class FormulaRequest {
  private String name;
  private Float midtermListeningMaxScore;
  private Float midtermReadingMaxScore;
  private Float midtermWritingMaxScore;
  private Float midtermSpeakingMaxScore;
  private String midtermPercentageFormula;
  private String midtermClassificationFormula;
  private Float finalListeningMaxScore;
  private Float finalReadingMaxScore;
  private Float finalWritingMaxScore;
  private Float finalSpeakingMaxScore;
  private String finalPercentageFormula;
  private String finalClassificationFormula;
  private Float midtermGradeWeight;
  private Float finalGradeWeight;
  private Float bonusGradeWeight;
  private String classificationFormula;
  private List<Integer> courseIds;
}
