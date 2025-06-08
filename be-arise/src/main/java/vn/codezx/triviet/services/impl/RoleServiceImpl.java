package vn.codezx.triviet.services.impl;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.codezx.triviet.dtos.staff.RoleDTO;
import vn.codezx.triviet.entities.staff.Staff;
import vn.codezx.triviet.mappers.staff.RoleToDTOMapper;
import vn.codezx.triviet.repositories.RoleRepository;
import vn.codezx.triviet.repositories.StaffRepository;
import vn.codezx.triviet.services.RoleService;

@Service
public class RoleServiceImpl implements RoleService {
  private final RoleRepository roleRepository;
  private final RoleToDTOMapper roleToDTOMapper;
  private final StaffRepository staffRepository;

  public RoleServiceImpl(RoleRepository roleRepository, RoleToDTOMapper roleToDTOMapper,
      StaffRepository staffRepository) {
    this.roleRepository = roleRepository;
    this.roleToDTOMapper = roleToDTOMapper;
    this.staffRepository = staffRepository;
  }

  @Override
  @Transactional(readOnly = true)
  public Page<RoleDTO> getRoles(String requestId, String query, Pageable pageable) {
    return roleRepository.findAllByIsDeleteIsFalse(pageable).map(roleToDTOMapper::toDto);
  }

  @Override
  @Transactional(readOnly = true)
  public List<RoleDTO> getRolesByUser(String requestId, String email) {
    Staff staff = staffRepository.findByEmailAddressAndIsDeleteIsFalse(email);
    return roleToDTOMapper.toListDto(staff.getRoles());
  }

}
