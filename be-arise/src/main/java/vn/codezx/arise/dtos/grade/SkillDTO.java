package vn.codezx.arise.dtos.grade;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import vn.codezx.arise.constants.SkillName;
import vn.codezx.arise.dtos.base.BaseInfoDTO;

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
