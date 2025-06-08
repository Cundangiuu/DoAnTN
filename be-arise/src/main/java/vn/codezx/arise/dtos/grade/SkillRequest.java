package vn.codezx.arise.dtos.grade;

import com.google.auto.value.AutoValue.Builder;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.codezx.arise.constants.SkillName;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class SkillRequest {
  private SkillName name;
  private Float score;
}
