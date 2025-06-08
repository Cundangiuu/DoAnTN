package vn.codezx.triviet.entities.course;

import java.util.Date;
import java.util.List;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import vn.codezx.triviet.entities.base.BaseInfo;
import vn.codezx.triviet.entities.setting.Location;
import vn.codezx.triviet.entities.setting.Schedule;
import vn.codezx.triviet.entities.staff.Staff;
import vn.codezx.triviet.entities.student.Absence;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Data
@EqualsAndHashCode(callSuper = true)
@Table(name = "class_day")
public class ClassDay extends BaseInfo {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;

  @ManyToOne
  @JoinColumn(name = "class_id")
  private ClassTvms classTvms;

  @ManyToOne
  @JoinColumn(name = "lesson_id")
  private Lesson lesson;

  @Column(name = "class_date")
  private Date classDate;

  @ManyToOne(cascade = CascadeType.DETACH)
  @JoinColumn(name = "schedule_id")
  private Schedule schedule;

  @Column(name = "is_final")
  private Boolean isFinal;

  @Column(name = "is_midterm")
  private Boolean isMidterm;

  @Column(name = "rating")
  private Integer rating;

  @Column(name = "comment", columnDefinition = "TEXT")
  private String comment;

  @Column(name = "home_work", columnDefinition = "TEXT")
  private String homeWork;

  @OneToMany(mappedBy = "classDay", cascade = CascadeType.ALL)
  private List<Absence> attendances;

  @OneToOne
  @JoinColumn(name = "teacher_id")
  private Staff teacher;

  @OneToOne
  @JoinColumn(name = "location_id")
  private Location location;

}
