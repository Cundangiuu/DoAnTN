package vn.codezx.triviet.mappers.staff;

import org.springframework.stereotype.Component;
import vn.codezx.triviet.dtos.staff.RoleDTO;
import vn.codezx.triviet.entities.staff.Role;
import vn.codezx.triviet.mappers.DtoMapper;

@Component
public class RoleToDTOMapper extends DtoMapper<Role, RoleDTO> {
  @Override
  public RoleDTO toDto(Role entity) {
    return RoleDTO.builder().id(entity.getId()).name(entity.getName())
        .createdAt(entity.getCreatedAt()).createdBy(entity.getCreatedBy())
        .updatedAt(entity.getUpdatedAt()).updatedBy(entity.getUpdatedBy()).build();
  }
}
