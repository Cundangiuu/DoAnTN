package vn.codezx.triviet.mappers.setting;

import java.util.Collections;
import java.util.List;
import org.springframework.stereotype.Component;
import vn.codezx.triviet.dtos.formula.FormulaRequest;
import vn.codezx.triviet.entities.course.Course;
import vn.codezx.triviet.entities.setting.Formula;
import vn.codezx.triviet.mappers.EntityMapper;
import vn.codezx.triviet.repositories.CourseRepository;

@Component
public class FormulaToEntityMapper extends EntityMapper<FormulaRequest, Formula> {
  private final CourseRepository courseRepository;

  public FormulaToEntityMapper(CourseRepository courseRepository) {
    this.courseRepository = courseRepository;
  }

  @Override
  public Formula toEntity(FormulaRequest dto) {
    List<Course> courses =
        (dto.getCourseIds() == null || dto.getCourseIds().isEmpty()) ? Collections.emptyList()
            : courseRepository.findAllById(dto.getCourseIds());
    return Formula.builder().name(dto.getName())
        .midtermListeningMaxScore(dto.getMidtermListeningMaxScore())
        .midtermReadingMaxScore(dto.getMidtermReadingMaxScore())
        .midtermWritingMaxScore(dto.getMidtermWritingMaxScore())
        .midtermSpeakingMaxScore(dto.getMidtermSpeakingMaxScore())
        .midtermPercentageFormula(dto.getMidtermPercentageFormula())
        .midtermClassificationFormula(dto.getMidtermClassificationFormula())
        .finalListeningMaxScore(dto.getFinalListeningMaxScore())
        .finalReadingMaxScore(dto.getFinalReadingMaxScore())
        .finalWritingMaxScore(dto.getFinalWritingMaxScore())
        .finalSpeakingMaxScore(dto.getFinalSpeakingMaxScore())
        .finalPercentageFormula(dto.getFinalPercentageFormula())
        .finalClassificationFormula(dto.getFinalClassificationFormula())
        .midtermGradeWeight(dto.getMidtermGradeWeight()).finalGradeWeight(dto.getFinalGradeWeight())
        .bonusGradeWeight(dto.getBonusGradeWeight())
        .classificationFormula(dto.getClassificationFormula()).courses(courses).build();
  }
}
