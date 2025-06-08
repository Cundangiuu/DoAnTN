package vn.codezx.triviet.mappers.grade;

import org.springframework.stereotype.Component;
import vn.codezx.triviet.dtos.grade.CriteriaDTO;
import vn.codezx.triviet.entities.student.Criteria;
import vn.codezx.triviet.mappers.DtoMapper;

@Component
public class CriteriaToDTOMapper extends DtoMapper<Criteria, CriteriaDTO> {

  @Override
  public CriteriaDTO toDto(Criteria entity) {
    return CriteriaDTO.builder().id(entity.getId()).attitude(entity.getAttitude())
        .homeworkCompletion(entity.getHomeworkCompletion()).listening(entity.getListening())
        .speaking(entity.getSpeaking()).reading(entity.getReading()).writing(entity.getWriting())
        .vocabulary(entity.getVocabulary()).grammar(entity.getGrammar())
        .progress(entity.getProgress()).build();
  }
}
