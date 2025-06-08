package vn.codezx.arise.mappers.grade;

import org.springframework.stereotype.Component;
import vn.codezx.arise.dtos.grade.GradeDTO;
import vn.codezx.arise.entities.student.Grade;
import vn.codezx.arise.mappers.DtoMapper;
import vn.codezx.arise.mappers.classArise.ClassAriseToDTOMapper;
import vn.codezx.arise.mappers.student.StudentToDTOMapper;

@Component
public class GradeToDTOMapper extends DtoMapper<Grade, GradeDTO> {

  private final StudentToDTOMapper studentToDTOMapper;

  private final ClassAriseToDTOMapper classAriseToDTOMapper;

  private final SkillToDTOMapper skillToDTOMapper;

  private final CriteriaToDTOMapper criteriaToDTOMapper;

  public GradeToDTOMapper(StudentToDTOMapper studentToDTOMapper,
      ClassAriseToDTOMapper classAriseToDTOMapper, SkillToDTOMapper skillToDTOMapper,
      CriteriaToDTOMapper criteriaToDTOMapper) {
    this.studentToDTOMapper = studentToDTOMapper;
    this.classAriseToDTOMapper = classAriseToDTOMapper;
    this.skillToDTOMapper = skillToDTOMapper;
    this.criteriaToDTOMapper = criteriaToDTOMapper;
  }

  @Override
  public GradeDTO toDto(Grade entity) {
    return GradeDTO.builder().id(entity.getId())
        .student(studentToDTOMapper.toDto(entity.getStudent()))
        .classArise(classAriseToDTOMapper.toDto(entity.getClassArise())).testType(entity.getTestType())
        .comment(entity.getComment()).skills(skillToDTOMapper.toListDto(entity.getSkills()))
        .score(entity.getScore()).sum(entity.getSum()).classification(entity.getClassification())
        .criteria(
            entity.getCriteria() != null ? criteriaToDTOMapper.toDto(entity.getCriteria()) : null)
        .createdAt(entity.getCreatedAt()).updatedAt(entity.getUpdatedAt())
        .createdBy(entity.getCreatedBy()).updatedBy(entity.getUpdatedBy()).build();
  }
}
