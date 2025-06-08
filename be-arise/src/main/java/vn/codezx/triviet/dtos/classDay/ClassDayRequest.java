package vn.codezx.triviet.dtos.classDay;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ClassDayRequest {
  private String homework;
  private Integer rating;
  private String comment;
}
