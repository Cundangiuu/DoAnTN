package vn.codezx.arise.entities.setting;

import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import vn.codezx.arise.entities.base.BaseInfo;
import vn.codezx.arise.entities.course.Course;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Data
@EqualsAndHashCode(callSuper = true)
@Table(name = "formula",
    uniqueConstraints = @UniqueConstraint(columnNames = {"course_id", "test_type_id"}))
public class Formula extends BaseInfo {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name = "midterm_listening_max_score")
  private Float midtermListeningMaxScore;

  @Column(name = "midterm_reading_max_score")
  private Float midtermReadingMaxScore;

  @Column(name = "midterm_speaking_max_score")
  private Float midtermSpeakingMaxScore;

  @Column(name = "midterm_writing_max_score")
  private Float midtermWritingMaxScore;

  @Column(name = "midterm_percentage_formula")
  private String midtermPercentageFormula;

  @Column(name = "midterm_classification_formula")
  private String midtermClassificationFormula;

  @Column(name = "final_listening_max_score")
  private Float finalListeningMaxScore;

  @Column(name = "final_reading_max_score")
  private Float finalReadingMaxScore;

  @Column(name = "final_speaking_max_score")
  private Float finalSpeakingMaxScore;

  @Column(name = "final_writing_max_score")
  private Float finalWritingMaxScore;

  @Column(name = "final_percentage_formula")
  private String finalPercentageFormula;

  @Column(name = "final_classification_formula")
  private String finalClassificationFormula;

  @Column(name = "midterm_grade_weight")
  private Float midtermGradeWeight;

  @Column(name = "final_grade_weight")
  private Float finalGradeWeight;

  @Column(name = "bonus_grade_weight")
  private Float bonusGradeWeight;

  @Column(name = "classification_formula")
  private String classificationFormula;

  @Builder.Default
  @OneToMany(mappedBy = "formula", cascade = {CascadeType.PERSIST, CascadeType.MERGE},
      orphanRemoval = false)
  private List<Course> courses = new ArrayList<>();
}
