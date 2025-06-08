package vn.codezx.triviet.dtos.classDay;

import java.util.Date;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import vn.codezx.triviet.dtos.absence.AbsenceDTO;
import vn.codezx.triviet.dtos.base.BaseInfoDTO;
import vn.codezx.triviet.dtos.lesson.LessonDTO;
import vn.codezx.triviet.dtos.location.LocationDTO;
import vn.codezx.triviet.dtos.schedule.ScheduleDTO;
import vn.codezx.triviet.dtos.staff.StaffDTO;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class ClassDayDTO extends BaseInfoDTO {
  private int id;
  private String classTvms;
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
