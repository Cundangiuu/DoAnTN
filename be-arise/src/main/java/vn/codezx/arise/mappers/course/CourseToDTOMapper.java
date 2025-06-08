package vn.codezx.arise.mappers.course;

import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;
import lombok.RequiredArgsConstructor;
import vn.codezx.arise.dtos.course.CourseDTO;
import vn.codezx.arise.entities.course.Course;
import vn.codezx.arise.mappers.DtoMapper;
import vn.codezx.arise.mappers.enrollment.EnrollmentToDTOMapper;
import vn.codezx.arise.mappers.lesson.LessonToDTOMapper;
import vn.codezx.arise.mappers.setting.FormulaToDTOMapper;

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
            .filter(enrollment -> ObjectUtils.isEmpty(enrollment.getClassArise())).toList()))
        .createdAt(entity.getCreatedAt()).createdBy(entity.getCreatedBy())
        .updatedAt(entity.getUpdatedAt()).updatedBy(entity.getUpdatedBy()).build();
  }
}
