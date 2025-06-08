package vn.codezx.arise.dtos.staff;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import vn.codezx.arise.constants.RoleName;
import vn.codezx.arise.dtos.base.BaseInfoDTO;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class RoleDTO extends BaseInfoDTO {
  private int id;
  private RoleName name;
}
