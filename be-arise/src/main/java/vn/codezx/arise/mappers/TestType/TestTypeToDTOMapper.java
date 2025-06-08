package vn.codezx.arise.mappers.TestType;

import org.springframework.stereotype.Component;
import vn.codezx.arise.dtos.testType.TestTypeDTO;
import vn.codezx.arise.entities.course.TestType;
import vn.codezx.arise.mappers.DtoMapper;

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
