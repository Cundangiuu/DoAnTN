package vn.codezx.triviet.mappers.setting;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import vn.codezx.triviet.dtos.formula.FormulaDTO;
import vn.codezx.triviet.entities.course.Course;
import vn.codezx.triviet.entities.setting.Formula;
import vn.codezx.triviet.mappers.DtoMapper;

@Component
public class FormulaToDTOMapper extends DtoMapper<Formula, FormulaDTO> {
  @Override
  public FormulaDTO toDto(Formula entity) {
    List<Integer> courseIds =
        entity.getCourses().stream().map(Course::getId).collect(Collectors.toList());
    return FormulaDTO.builder().id(entity.getId()).name(entity.getName())
        .midtermListeningMaxScore(entity.getMidtermListeningMaxScore())
        .midtermReadingMaxScore(entity.getMidtermReadingMaxScore())
        .midtermWritingMaxScore(entity.getMidtermWritingMaxScore()).createdAt(entity.getCreatedAt())
        .midtermSpeakingMaxScore(entity.getMidtermSpeakingMaxScore())
        .midtermPercentageFormula(entity.getMidtermPercentageFormula())
        .midtermClassificationFormula(entity.getMidtermClassificationFormula())
        .finalListeningMaxScore(entity.getFinalListeningMaxScore())
        .finalReadingMaxScore(entity.getFinalReadingMaxScore())
        .finalWritingMaxScore(entity.getFinalWritingMaxScore())
        .finalSpeakingMaxScore(entity.getFinalSpeakingMaxScore())
        .finalPercentageFormula(entity.getFinalPercentageFormula())
        .finalClassificationFormula(entity.getFinalClassificationFormula())
        .midtermGradeWeight(entity.getMidtermGradeWeight())
        .finalGradeWeight(entity.getFinalGradeWeight())
        .bonusGradeWeight(entity.getBonusGradeWeight())
        .classificationFormula(entity.getClassificationFormula()).courseIds(courseIds)
        .createdBy(entity.getCreatedBy()).updatedAt(entity.getUpdatedAt())
        .updatedBy(entity.getUpdatedBy()).build();
  }

}
