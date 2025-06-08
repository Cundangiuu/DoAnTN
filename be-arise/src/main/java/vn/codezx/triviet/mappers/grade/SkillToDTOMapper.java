package vn.codezx.triviet.mappers.grade;

import org.springframework.stereotype.Component;
import vn.codezx.triviet.dtos.grade.SkillDTO;
import vn.codezx.triviet.entities.setting.Skill;
import vn.codezx.triviet.mappers.DtoMapper;

@Component
public class SkillToDTOMapper extends DtoMapper<Skill, SkillDTO> {

  @Override
  public SkillDTO toDto(Skill entity) {
    return SkillDTO.builder().id(entity.getId()).name(entity.getName()).score(entity.getScore())
        .createdAt(entity.getCreatedAt()).updatedAt(entity.getUpdatedAt())
        .createdBy(entity.getCreatedBy()).updatedBy(entity.getUpdatedBy()).build();
  }
}
