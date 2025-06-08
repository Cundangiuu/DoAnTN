package vn.codezx.triviet.dtos.grade;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import vn.codezx.triviet.dtos.base.BaseInfoDTO;
import vn.codezx.triviet.dtos.classTvms.ClassDTO;
import vn.codezx.triviet.dtos.student.StudentDTO;
import vn.codezx.triviet.entities.course.TestType;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class GradeDTO extends BaseInfoDTO {
  private int id;
  private StudentDTO student;
  private ClassDTO classTvms;
  private TestType testType;
  private String comment;
  private Float sum;
  private Float score;
  private String classification;
  private List<SkillDTO> skills;
  private CriteriaDTO criteria;
}
