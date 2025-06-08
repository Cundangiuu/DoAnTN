package vn.codezx.triviet.mappers.absence;

import org.springframework.stereotype.Component;
import vn.codezx.triviet.dtos.absence.AbsenceDTO;
import vn.codezx.triviet.entities.student.Absence;
import vn.codezx.triviet.mappers.DtoMapper;

@Component
public class AbsenceToDTOMapper extends DtoMapper<Absence, AbsenceDTO> {

  @Override
  public AbsenceDTO toDto(Absence entity) {
    return AbsenceDTO.
        builder()
        .id(entity.getId())
        .studentId(entity.getStudent().getId())
        .classCode(entity.getClassTvms().getCode())
        .classDayId(entity.getClassDay().getId())
        .checkAbsent(entity.getIsAbsent())
        .classDate(entity.getClassDay().getClassDate())
        .createdBy(entity.getCreatedBy())
        .createdAt(entity.getCreatedAt())
        .updatedAt(entity.getUpdatedAt())
        .updatedBy(entity.getUpdatedBy())
        .isDelete(entity.getIsDelete())
        .build();
  }
}
