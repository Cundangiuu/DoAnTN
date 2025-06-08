package vn.codezx.triviet.mappers.enrollment;

import org.springframework.stereotype.Component;
import vn.codezx.triviet.dtos.enrollment.EnrollmentDTO;
import vn.codezx.triviet.entities.reporting.Enrollment;
import vn.codezx.triviet.mappers.DtoMapper;

@Component
public class EnrollmentToDTOMapper extends DtoMapper<Enrollment, EnrollmentDTO> {

  @Override
  public EnrollmentDTO toDto(Enrollment entity) {
    return EnrollmentDTO.builder()
        .id(entity.getId())
        .className(entity.getClassTvms() != null ? entity.getClassTvms().getName() : "")
        .classCode(entity.getClassTvms() != null ? entity.getClassTvms().getCode() : "")
        .courseId(entity.getCourse().getId())
        .student(entity.getStudent())
        .courseCode(entity.getCourse().getCode())
        .courseName(entity.getCourse().getName())
        .enrollmentDate(entity.getEnrollmentDate())
        .build();
  }
}
