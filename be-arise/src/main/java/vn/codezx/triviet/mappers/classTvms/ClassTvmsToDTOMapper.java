package vn.codezx.triviet.mappers.classTvms;

import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import vn.codezx.triviet.dtos.classTvms.ClassDTO;
import vn.codezx.triviet.entities.course.ClassTvms;
import vn.codezx.triviet.mappers.DtoMapper;
import vn.codezx.triviet.mappers.ClassDay.ClassDayToDTOMapper;
import vn.codezx.triviet.mappers.course.CourseToDTOMapper;
import vn.codezx.triviet.mappers.setting.ScheduleToDTOMapper;
import vn.codezx.triviet.mappers.staff.StaffToDTOMapper;
import vn.codezx.triviet.mappers.student.StudentToDTOMapper;

@Component
@RequiredArgsConstructor
public class ClassTvmsToDTOMapper extends DtoMapper<ClassTvms, ClassDTO> {
  private final CourseToDTOMapper courseToDTOMapper;
  private final ScheduleToDTOMapper scheduleToDTOMapper;
  private final StudentToDTOMapper studentToDTOMapper;
  private final ClassDayToDTOMapper classDayToDTOMapper;
  private final StaffToDTOMapper staffToDTOMapper;

  @Override
  public ClassDTO toDto(ClassTvms entity) {
    return ClassDTO.builder().id(entity.getId()).code(entity.getCode())
        .course(courseToDTOMapper.toDto(entity.getCourse()))
        .schedules(scheduleToDTOMapper.toListDto(entity.getSchedules()))
        .classDays(classDayToDTOMapper.toListDto(entity.getClassDays()))
        .startDate(entity.getStartDate()).name(entity.getName())
        .students(studentToDTOMapper.toListDto(entity.getStudents()))
        .staff(staffToDTOMapper.toDto(entity.getStaff())).createdAt(entity.getCreatedAt())
        .createdBy(entity.getCreatedBy()).updatedAt(entity.getUpdatedAt())
        .updatedBy(entity.getUpdatedBy()).build();
  }
}
