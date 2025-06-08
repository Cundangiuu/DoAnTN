package vn.codezx.triviet.mappers.TestType;

import org.springframework.stereotype.Component;
import vn.codezx.triviet.dtos.testType.TestTypeDTO;
import vn.codezx.triviet.entities.course.TestType;
import vn.codezx.triviet.mappers.DtoMapper;

@Component
public class TestTypeToDTOMapper extends DtoMapper<TestType, TestTypeDTO> {

  @Override
  public TestTypeDTO toDto(TestType entity) {
    return TestTypeDTO.builder()
        .type(entity.getType())
        .id(entity.getId())
        .description(entity.getDescription()).build();
  }
}
