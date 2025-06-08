package vn.codezx.arise.entities.reporting;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import java.util.Date;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import vn.codezx.arise.entities.base.BaseInfo;
import vn.codezx.arise.entities.course.ClassArise;
import vn.codezx.arise.entities.course.Course;
import vn.codezx.arise.entities.student.Student;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Data
@EqualsAndHashCode(callSuper = true)
@Table(name = "enrollment")
public class Enrollment extends BaseInfo {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;

  @ManyToOne
  @JoinColumn(name = "student_id", nullable = false)
  private Student student;

  @ManyToOne
  @JoinColumn(name = "course_id", nullable = false)
  private Course course;

  @ManyToOne
  @JoinColumn(name = "class_arise_id")
  private ClassArise classArise;

  @Column(name = "enrollment_date")
  private Date enrollmentDate;

  @OneToMany(mappedBy = "enrollment", fetch = FetchType.LAZY)
  @JsonIgnore
  private List<Invoice> invoices;
}
