package vn.codezx.triviet.entities.staff;

import java.util.ArrayList;
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
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import vn.codezx.triviet.entities.base.BaseInfo;
import vn.codezx.triviet.entities.course.Course;
import vn.codezx.triviet.entities.setting.Schedule;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Data
@EqualsAndHashCode(callSuper = true)
@Table(name = "staff")
public class Staff extends BaseInfo {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;

  @Column(name = "code", unique = true)
  private String code;

  @Column(name = "first_name", nullable = false)
  private String firstName;

  @Column(name = "last_name", nullable = false)
  private String lastName;

  @Column(name = "email_address", nullable = false, unique = true)
  private String emailAddress;

  @Column(name = "phone_number")
  private String phoneNumber;

  @Column(name = "refresh_token")
  private String refreshToken;

  @Column(name = "avatar_url")
  private String avatarUrl;

  @Column(name = "weekly_hours")
  private Integer weeklyHours;

  @Column(name = "rates")
  private Integer rates;

  @Builder.Default
  @ManyToMany(cascade = {CascadeType.ALL}, fetch = FetchType.EAGER)
  @JoinTable(name = "staff_class_schedule", joinColumns = {@JoinColumn(name = "staff_id")},
      inverseJoinColumns = {@JoinColumn(name = "class_schedule_id")})
  private List<Schedule> schedules = new ArrayList<>();

  @Builder.Default
  @ManyToMany(cascade = {CascadeType.ALL}, fetch = FetchType.EAGER)
  @JoinTable(name = "staff_course", joinColumns = {@JoinColumn(name = "staff_id")},
      inverseJoinColumns = {@JoinColumn(name = "course_id")})
  private List<Course> courses = new ArrayList<>();

  @Builder.Default
  @ManyToMany(cascade = {CascadeType.ALL}, fetch = FetchType.EAGER)
  @JoinTable(name = "staff_role", joinColumns = {@JoinColumn(name = "staff_id")},
      inverseJoinColumns = {@JoinColumn(name = "role_id")})
  private List<Role> roles = new ArrayList<>();
}
