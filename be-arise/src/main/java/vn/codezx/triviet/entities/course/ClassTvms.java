package vn.codezx.triviet.entities.course;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import vn.codezx.triviet.entities.base.BaseInfo;
import vn.codezx.triviet.entities.setting.Schedule;
import vn.codezx.triviet.entities.staff.Staff;
import vn.codezx.triviet.entities.student.Student;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Data
@EqualsAndHashCode(callSuper = false)
@Table(name = "class_tvms")
public class ClassTvms extends BaseInfo {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;

  @Column(name = "code", nullable = false)
  private String code;

  @Column(name = "class_name", nullable = false)
  private String name;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "course_id", nullable = false)
  private Course course;

  @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
  @JoinTable(name = "class_class_schedule", joinColumns = @JoinColumn(name = "class_id"),
      inverseJoinColumns = @JoinColumn(name = "schedule_id"))
  private List<Schedule> schedules;

  @Column(name = "start_date")
  private Date startDate;

  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(name = "class_student", joinColumns = @JoinColumn(name = "class_id"),
      inverseJoinColumns = @JoinColumn(name = "student_id"))
  @Builder.Default
  private List<Student> students = new ArrayList<>();

  @OneToMany(fetch = FetchType.EAGER, mappedBy = "classTvms")
  @OrderBy("id")
  @Builder.Default
  private List<ClassDay> classDays = new ArrayList<>();

  @OneToOne
  @JoinColumn(name = "staff_id")
  private Staff staff;
}
