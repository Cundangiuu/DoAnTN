package vn.codezx.arise.dtos.testType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import vn.codezx.arise.constants.TypeOfTest;
import vn.codezx.arise.entities.base.BaseInfo;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class TestTypeDTO extends BaseInfo {

  private int id;
  private TypeOfTest type;
  private String description;
}
