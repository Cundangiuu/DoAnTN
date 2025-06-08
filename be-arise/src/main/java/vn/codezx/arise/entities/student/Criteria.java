package vn.codezx.arise.entities.student;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import vn.codezx.arise.entities.base.BaseInfo;



@Entity
@Table(name = "criteria")
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true, exclude = "grade")
@Data
public class Criteria extends BaseInfo {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;

  @Column(name = "attitude")
  private String attitude;

  @Column(name = "homework_completion")
  private String homeworkCompletion;

  @Column(name = "listening")
  private String listening;

  @Column(name = "speaking")
  private String speaking;

  @Column(name = "reading")
  private String reading;

  @Column(name = "writing")
  private String writing;

  @Column(name = "vocabulary")
  private String vocabulary;

  @Column(name = "grammar")
  private String grammar;

  @Column(name = "progress")
  private String progress;

  @JsonIgnore
  @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
  @JoinColumn(name = "grade_id")
  private Grade grade;
}
