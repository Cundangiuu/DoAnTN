package vn.codezx.arise.dtos.grade;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import vn.codezx.arise.dtos.base.BaseInfoDTO;
import vn.codezx.arise.dtos.classArise.ClassDTO;
import vn.codezx.arise.dtos.student.StudentDTO;
import vn.codezx.arise.entities.course.TestType;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class GradeDTO extends BaseInfoDTO {
  private int id;
  private StudentDTO student;
  private ClassDTO classArise;
  private TestType testType;
  private String comment;
  private Float sum;
  private Float score;
  private String classification;
  private List<SkillDTO> skills;
  private CriteriaDTO criteria;
}
