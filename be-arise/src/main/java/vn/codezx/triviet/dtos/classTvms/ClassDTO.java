package vn.codezx.triviet.dtos.classTvms;

import java.util.Date;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import vn.codezx.triviet.dtos.classDay.ClassDayDTO;
import vn.codezx.triviet.dtos.course.CourseDTO;
import vn.codezx.triviet.dtos.schedule.ScheduleDTO;
import vn.codezx.triviet.dtos.staff.StaffDTO;
import vn.codezx.triviet.dtos.student.StudentDTO;
import vn.codezx.triviet.entities.base.BaseInfo;

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
