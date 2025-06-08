package vn.codezx.triviet.dtos.staff;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import vn.codezx.triviet.dtos.base.BaseInfoDTO;
import vn.codezx.triviet.dtos.course.CourseDTO;
import vn.codezx.triviet.dtos.schedule.ScheduleDTO;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class StaffDTO extends BaseInfoDTO {
  private int id;
  private String code;
  private String firstName;
  private String lastName;
  private String emailAddress;
  private String phoneNumber;
  private String refreshToken;
  private Integer weeklyHours;
  private Integer rates;
  private String avatarUrl;
  private List<ScheduleDTO> schedules;
  private List<CourseDTO> courses;
  private List<RoleDTO> roles;
}
