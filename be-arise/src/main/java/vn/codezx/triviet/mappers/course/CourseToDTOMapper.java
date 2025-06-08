package vn.codezx.triviet.mappers.course;

import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;
import lombok.RequiredArgsConstructor;
import vn.codezx.triviet.dtos.course.CourseDTO;
import vn.codezx.triviet.entities.course.Course;
import vn.codezx.triviet.mappers.DtoMapper;
import vn.codezx.triviet.mappers.enrollment.EnrollmentToDTOMapper;
import vn.codezx.triviet.mappers.lesson.LessonToDTOMapper;
import vn.codezx.triviet.mappers.setting.FormulaToDTOMapper;

@Component
@RequiredArgsConstructor
public class CourseToDTOMapper extends DtoMapper<Course, CourseDTO> {

  private final LessonToDTOMapper lessonToDTOMapper;
  private final FormulaToDTOMapper formulaToDTOMapper;
  private final EnrollmentToDTOMapper enrollmentToDTOMapper;

  @Override
  public CourseDTO toDto(Course entity) {
    return CourseDTO.builder().id(entity.getId()).code(entity.getCode()).name(entity.getName())
        .tuitionRate(entity.getTuitionRate()).numberHour(entity.getNumberHour())
        .description(entity.getDescription()).courseLevel(entity.getCourseLevel())
        .formula(!ObjectUtils.isEmpty(entity.getFormula())
            ? formulaToDTOMapper.toDto(entity.getFormula())
            : null)
        .lessons(lessonToDTOMapper.toListDto(entity.getLessons()))
        .enrollments(enrollmentToDTOMapper.toListDto(entity.getEnrollments().stream()
            .filter(enrollment -> ObjectUtils.isEmpty(enrollment.getClassTvms())).toList()))
        .createdAt(entity.getCreatedAt()).createdBy(entity.getCreatedBy())
        .updatedAt(entity.getUpdatedAt()).updatedBy(entity.getUpdatedBy()).build();
  }
}
