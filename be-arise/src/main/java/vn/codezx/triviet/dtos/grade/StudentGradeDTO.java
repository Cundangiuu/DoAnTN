package vn.codezx.triviet.dtos.grade;

import java.io.Serializable;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentGradeDTO implements Serializable {
  private String id;
  private Double midtermGrade;
  private Double finalGrade;
  private Double resultGrade;
}
