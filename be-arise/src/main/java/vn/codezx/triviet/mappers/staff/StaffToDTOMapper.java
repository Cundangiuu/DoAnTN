package vn.codezx.triviet.mappers.staff;

import java.util.List;
import org.springframework.stereotype.Component;
import vn.codezx.triviet.dtos.course.CourseDTO;
import vn.codezx.triviet.dtos.schedule.ScheduleDTO;
import vn.codezx.triviet.dtos.staff.RoleDTO;
import vn.codezx.triviet.dtos.staff.StaffDTO;
import vn.codezx.triviet.entities.staff.Staff;
import vn.codezx.triviet.mappers.DtoMapper;
import vn.codezx.triviet.mappers.course.CourseToDTOMapper;
import vn.codezx.triviet.mappers.setting.ScheduleToDTOMapper;

@Component
public class StaffToDTOMapper extends DtoMapper<Staff, StaffDTO> {

  private final CourseToDTOMapper courseToDTOMapper;
  private final ScheduleToDTOMapper scheduleToDTOMapper;
  private final RoleToDTOMapper roleToDTOMapper;

  public StaffToDTOMapper(CourseToDTOMapper courseToDTOMapper,
      ScheduleToDTOMapper scheduleToDTOMapper, RoleToDTOMapper roleToDTOMapper) {
    this.courseToDTOMapper = courseToDTOMapper;
    this.scheduleToDTOMapper = scheduleToDTOMapper;
    this.roleToDTOMapper = roleToDTOMapper;
  }

  @Override
  public StaffDTO toDto(Staff entity) {
    List<ScheduleDTO> schedules = scheduleToDTOMapper.toListDto(entity.getSchedules());
    List<CourseDTO> courses = courseToDTOMapper.toListDto(entity.getCourses());
    List<RoleDTO> roles = roleToDTOMapper.toListDto(entity.getRoles());

    return StaffDTO.builder().id(entity.getId()).code(entity.getCode())
        .firstName(entity.getFirstName()).lastName(entity.getLastName())
        .emailAddress(entity.getEmailAddress()).phoneNumber(entity.getPhoneNumber())
        .refreshToken(entity.getRefreshToken()).avatarUrl(entity.getAvatarUrl())
        .weeklyHours(entity.getWeeklyHours()).rates(entity.getRates()).schedules(schedules)
        .courses(courses).roles(roles).createdAt(entity.getCreatedAt())
        .createdBy(entity.getCreatedBy()).updatedAt(entity.getUpdatedAt())
        .updatedBy(entity.getUpdatedBy()).build();
  }
}
