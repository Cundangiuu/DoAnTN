package vn.codezx.triviet.mappers.reports;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import vn.codezx.triviet.dtos.absence.AbsentStudentProjection;
import vn.codezx.triviet.dtos.reports.AbsenceReportDTO;
import vn.codezx.triviet.mappers.DtoMapper;

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
