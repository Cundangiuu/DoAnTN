package vn.codezx.triviet.dtos.grade;

import com.google.auto.value.AutoValue.Builder;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.codezx.triviet.constants.SkillName;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class SkillRequest {
  private SkillName name;
  private Float score;
}
