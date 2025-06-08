package vn.codezx.triviet.entities.student;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import vn.codezx.triviet.entities.base.BaseInfo;
import vn.codezx.triviet.entities.course.ClassDay;
import vn.codezx.triviet.entities.course.ClassTvms;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Data
@Table(name = "absence")
public class Absence extends BaseInfo {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;

  @ManyToOne
  @JoinColumn(name = "student_id", nullable = false)
  private Student student;

  @ManyToOne
  @JoinColumn(name = "class_id", nullable = false)
  private ClassTvms classTvms;

  @ManyToOne
  @JoinColumn(name = "class_day_id", nullable = false)
  private ClassDay classDay;

  @Column(name = "is_absent")
  private Boolean isAbsent;
}
