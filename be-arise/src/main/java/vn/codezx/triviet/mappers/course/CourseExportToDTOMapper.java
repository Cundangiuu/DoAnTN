package vn.codezx.triviet.mappers.course;

import org.springframework.stereotype.Component;
import vn.codezx.triviet.dtos.course.CourseExportDTO;
import vn.codezx.triviet.entities.course.Course;
import vn.codezx.triviet.mappers.DtoMapper;

@Component
public class CourseExportToDTOMapper extends DtoMapper<Course, CourseExportDTO> {

  @Override
  public CourseExportDTO toDto(Course entity) {
    return CourseExportDTO.builder().code(entity.getCode()).name(entity.getName())
        .tuitionRate(entity.getTuitionRate()).numberHour(entity.getNumberHour())
        .description(entity.getDescription()).courseLevel(entity.getCourseLevel()).build();
  }
}
