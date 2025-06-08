package vn.codezx.arise.mappers.staff;

import org.springframework.stereotype.Component;
import vn.codezx.arise.dtos.staff.RoleDTO;
import vn.codezx.arise.entities.staff.Role;
import vn.codezx.arise.mappers.DtoMapper;

@Component
public class RoleToDTOMapper extends DtoMapper<Role, RoleDTO> {
  @Override
  public RoleDTO toDto(Role entity) {
    return RoleDTO.builder().id(entity.getId()).name(entity.getName())
        .createdAt(entity.getCreatedAt()).createdBy(entity.getCreatedBy())
        .updatedAt(entity.getUpdatedAt()).updatedBy(entity.getUpdatedBy()).build();
  }
}
