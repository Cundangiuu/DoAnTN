package vn.codezx.triviet.dtos.grade;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import vn.codezx.triviet.constants.SkillName;
import vn.codezx.triviet.dtos.base.BaseInfoDTO;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class SkillDTO extends BaseInfoDTO {
  private int id;
  private SkillName name;
  private Float score;
}
