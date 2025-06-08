package vn.codezx.arise.mappers.enrollment;

import org.springframework.stereotype.Component;
import vn.codezx.arise.dtos.enrollment.EnrollmentDTO;
import vn.codezx.arise.entities.reporting.Enrollment;
import vn.codezx.arise.mappers.DtoMapper;

@Component
public class EnrollmentToDTOMapper extends DtoMapper<Enrollment, EnrollmentDTO> {

  @Override
  public EnrollmentDTO toDto(Enrollment entity) {
    return EnrollmentDTO.builder()
        .id(entity.getId())
        .className(entity.getClassArise() != null ? entity.getClassArise().getName() : "")
        .classCode(entity.getClassArise() != null ? entity.getClassArise().getCode() : "")
        .courseId(entity.getCourse().getId())
        .student(entity.getStudent())
        .courseCode(entity.getCourse().getCode())
        .courseName(entity.getCourse().getName())
        .enrollmentDate(entity.getEnrollmentDate())
        .build();
  }
}
