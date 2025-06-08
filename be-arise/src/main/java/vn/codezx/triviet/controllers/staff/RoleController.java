package vn.codezx.triviet.controllers.staff;

import java.util.List;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.SortDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.codezx.triviet.dtos.staff.RoleDTO;
import vn.codezx.triviet.services.RoleService;

@RestController
@RequestMapping(value = "api/roles", produces = MediaType.APPLICATION_JSON_VALUE)
public class RoleController {
  private final RoleService roleService;

  public RoleController(RoleService roleService) {
    this.roleService = roleService;
  }

  @GetMapping("/{request-id}")
  public ResponseEntity<Page<RoleDTO>> getRoles(@PathVariable("request-id") String requestId,
      @RequestParam(value = "query", required = false) String query,
      @SortDefault(sort = "createdAt",
          direction = Direction.DESC) @ParameterObject Pageable pageable) {
    return ResponseEntity.ok(roleService.getRoles(requestId, query, pageable));
  }

  @GetMapping("/{request-id}/user")
  public ResponseEntity<List<RoleDTO>> getRolesByUser(@PathVariable("request-id") String requestId,
      @RequestParam("email") String email) {
    return ResponseEntity.ok(roleService.getRolesByUser(requestId, email));
  }
}
