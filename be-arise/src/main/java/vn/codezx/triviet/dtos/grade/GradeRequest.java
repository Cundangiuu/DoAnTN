package vn.codezx.triviet.dtos.grade;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.codezx.triviet.constants.TypeOfTest;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class GradeRequest {
  private Integer studentId;
  private Integer classId;
  private TypeOfTest typeOfTest;
  private String comment;
  private Float score;
  private Float sum;
  private String classification;
  private List<SkillRequest> skills;
  private CriteriaRequest criteria;
}
