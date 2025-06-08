package vn.codezx.arise.dtos.classDay;

import java.util.Date;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import vn.codezx.arise.dtos.absence.AbsenceDTO;
import vn.codezx.arise.dtos.base.BaseInfoDTO;
import vn.codezx.arise.dtos.lesson.LessonDTO;
import vn.codezx.arise.dtos.location.LocationDTO;
import vn.codezx.arise.dtos.schedule.ScheduleDTO;
import vn.codezx.arise.dtos.staff.StaffDTO;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class ClassDayDTO extends BaseInfoDTO {
  private int id;
  private String classArise;
  private String className;
  private LessonDTO lesson;
  private Date classDate;
  private ScheduleDTO schedule;
  private Boolean isFinal;
  private Boolean isMidterm;
  private String comment;
  private String homeWork;
  private StaffDTO teacher;
  private LocationDTO location;
  private List<AbsenceDTO> absence;
  private Integer rating;
}
