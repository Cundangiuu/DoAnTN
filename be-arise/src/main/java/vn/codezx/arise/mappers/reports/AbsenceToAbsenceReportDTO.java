package vn.codezx.arise.mappers.reports;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.codezx.arise.dtos.absence.AbsentStudentProjection;
import vn.codezx.arise.dtos.reports.AbsenceReportDTO;
import vn.codezx.arise.mappers.DtoMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AbsenceToAbsenceReportDTO extends DtoMapper<AbsentStudentProjection, AbsenceReportDTO> {

  @Override
  public AbsenceReportDTO toDto(AbsentStudentProjection entity) {
    return AbsenceReportDTO.builder()
        .absentDate(entity.getAbsentDate().toString())
        .enrolledClass(entity.getEnrolledClass())
        .lessonDescription(entity.getLessonDescription())
        .studentName(entity.getStudentName())
        .comment(entity.getComment())
        .homeWork(entity.getHomeWork())
        .nickName(entity.getNickName())
        .build();
  }
}
