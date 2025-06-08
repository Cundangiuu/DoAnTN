package vn.codezx.arise.controllers.staff;

import java.util.List;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.SortDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import vn.codezx.arise.dtos.staff.StaffDTO;
import vn.codezx.arise.dtos.staff.request.StaffRequest;
import vn.codezx.arise.services.StaffService;

@RestController
@RequestMapping(value = "api/settings/staffs", produces = MediaType.APPLICATION_JSON_VALUE)
public class StaffController {
  private final StaffService staffService;

  public StaffController(StaffService staffService) {
    this.staffService = staffService;
  }

  @PostMapping(value = "/{request-id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<StaffDTO> createStaff(@PathVariable("request-id") String requestId,
      @RequestPart("staffRequest") StaffRequest staffRequest,
      @RequestPart(value = "avatar", required = false) MultipartFile avatar) {
    return ResponseEntity.ok(staffService.createStaff(requestId, staffRequest, avatar));
  }

  @GetMapping("/{request-id}")
  public ResponseEntity<Page<StaffDTO>> getStaffs(@PathVariable("request-id") String requestId,
      @RequestParam(value = "query", required = false) String query,
      @SortDefault(sort = "createdAt",
          direction = Direction.DESC) @ParameterObject Pageable pageable) {
    return ResponseEntity.ok(staffService.getStaffs(requestId, query, pageable));
  }

  @PutMapping("/{request-id}/{staff-id}")
  public ResponseEntity<StaffDTO> updateStaff(@PathVariable("request-id") String requestId,
      @PathVariable("staff-id") Integer staffId,
      @RequestPart("staffRequest") StaffRequest staffRequest,
      @RequestPart(value = "avatar", required = false) MultipartFile avatar) {

    return ResponseEntity.ok(staffService.updateStaff(requestId, staffId, staffRequest, avatar));
  }

  @GetMapping("/{request-id}/{staff-id}")
  public ResponseEntity<StaffDTO> getStaff(@PathVariable("request-id") String requestId,
      @PathVariable("staff-id") Integer staffId) {
    return ResponseEntity.ok(staffService.getStaff(requestId, staffId));
  }

  @DeleteMapping("/{request-id}/{staff-id}")
  public ResponseEntity<StaffDTO> deleteStaff(@PathVariable("request-id") String requestId,
      @PathVariable("staff-id") Integer staffId) {
    return ResponseEntity.ok(staffService.deleteStaff(requestId, staffId));
  }

  @GetMapping("filtered/{request-id}")
  public ResponseEntity<Page<StaffDTO>> filteredStaff(@PathVariable("request-id") String requestId,
      @RequestParam(value = "query", required = false, defaultValue = "") String query,
      @RequestParam(value = "scheduleIds", required = false) List<Integer> scheduleIds,
      @RequestParam(value = "roleIds", required = false) List<Integer> roleIds,
      @ParameterObject Pageable pageable) {
    return ResponseEntity
        .ok(staffService.getStaffs(requestId, query, scheduleIds, roleIds, pageable));
  }

}
