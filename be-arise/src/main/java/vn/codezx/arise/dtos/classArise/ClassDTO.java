package vn.codezx.arise.dtos.classArise;

import java.util.Date;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import vn.codezx.arise.dtos.classDay.ClassDayDTO;
import vn.codezx.arise.dtos.course.CourseDTO;
import vn.codezx.arise.dtos.schedule.ScheduleDTO;
import vn.codezx.arise.dtos.staff.StaffDTO;
import vn.codezx.arise.dtos.student.StudentDTO;
import vn.codezx.arise.entities.base.BaseInfo;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
@EqualsAndHashCode(callSuper = false)
public class ClassDTO extends BaseInfo {

  private int id;
  private String code;
  private String name;
  private Date startDate;
  private StaffDTO staff;
  private CourseDTO course;
  private List<ScheduleDTO> schedules;
  private List<StudentDTO> students;
  private List<ClassDayDTO> classDays;
}
