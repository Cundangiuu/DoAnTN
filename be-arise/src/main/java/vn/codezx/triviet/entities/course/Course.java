package vn.codezx.triviet.entities.course;

import java.util.ArrayList;
import java.util.List;

import org.springframework.core.annotation.Order;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import vn.codezx.triviet.constants.CourseLevelConstants;
import vn.codezx.triviet.entities.base.BaseInfo;
import vn.codezx.triviet.entities.reporting.Enrollment;
import vn.codezx.triviet.entities.setting.Formula;
import vn.codezx.triviet.entities.staff.Staff;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Data
@EqualsAndHashCode(callSuper = true)
@Table(name = "course")
public class Course extends BaseInfo {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;

  @Column(name = "code", unique = true)
  private String code;

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name = "tuition_rate")
  private float tuitionRate;

  @Column(name = "number_hour")
  private int numberHour;

  @Column(name = "description")
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(name = "course_level")
  private CourseLevelConstants courseLevel;

  @OneToMany(mappedBy = "course", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
  @OrderBy("created_at ASC")
  @Builder.Default
  private List<Lesson> lessons = new ArrayList<>();

  @OneToMany(mappedBy = "course", fetch = FetchType.EAGER)
  @OrderBy("created_at ASC")
  @Builder.Default
  private List<Enrollment> enrollments = new ArrayList<>();

  @Builder.Default
  @ManyToMany(mappedBy = "courses")
  private List<Staff> staffs = new ArrayList<>();

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "formula_id", referencedColumnName = "id", nullable = true)
  private Formula formula;
}
