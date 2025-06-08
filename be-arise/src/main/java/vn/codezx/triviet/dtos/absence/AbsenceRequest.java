package vn.codezx.triviet.dtos.absence;

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
public class AbsenceRequest {
  private int studentId;
  private String classCode;
  private int classDayId;
  private boolean checkAbsent;
}
