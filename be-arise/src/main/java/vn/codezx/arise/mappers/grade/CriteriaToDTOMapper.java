package vn.codezx.arise.mappers.grade;

import org.springframework.stereotype.Component;
import vn.codezx.arise.dtos.grade.CriteriaDTO;
import vn.codezx.arise.entities.student.Criteria;
import vn.codezx.arise.mappers.DtoMapper;

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
