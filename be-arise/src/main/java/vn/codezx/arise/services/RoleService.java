package vn.codezx.arise.services;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.codezx.arise.dtos.staff.RoleDTO;

public interface RoleService {

  Page<RoleDTO> getRoles(String requestId, String query, Pageable pageable);

  List<RoleDTO> getRolesByUser(String requestId, String userCode);

}
