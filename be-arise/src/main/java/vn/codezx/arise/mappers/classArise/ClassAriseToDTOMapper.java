package vn.codezx.arise.mappers.classArise;

import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import vn.codezx.arise.dtos.classArise.ClassDTO;
import vn.codezx.arise.entities.course.ClassArise;
import vn.codezx.arise.mappers.DtoMapper;
import vn.codezx.arise.mappers.ClassDay.ClassDayToDTOMapper;
import vn.codezx.arise.mappers.course.CourseToDTOMapper;
import vn.codezx.arise.mappers.setting.ScheduleToDTOMapper;
import vn.codezx.arise.mappers.staff.StaffToDTOMapper;
import vn.codezx.arise.mappers.student.StudentToDTOMapper;

@Component
@RequiredArgsConstructor
public class ClassAriseToDTOMapper extends DtoMapper<ClassArise, ClassDTO> {
  private final CourseToDTOMapper courseToDTOMapper;
  private final ScheduleToDTOMapper scheduleToDTOMapper;
  private final StudentToDTOMapper studentToDTOMapper;
  private final ClassDayToDTOMapper classDayToDTOMapper;
  private final StaffToDTOMapper staffToDTOMapper;

  @Override
  public ClassDTO toDto(ClassArise entity) {
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
