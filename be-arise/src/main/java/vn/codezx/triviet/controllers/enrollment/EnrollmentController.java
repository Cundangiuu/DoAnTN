package vn.codezx.triviet.controllers.enrollment;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.codezx.triviet.dtos.enrollment.EnrollmentDTO;
import vn.codezx.triviet.dtos.enrollment.EnrollmentRequest;
import vn.codezx.triviet.services.EnrollmentService;


@RestController
@RequestMapping("/api/enrollment")
public class EnrollmentController {

  private final EnrollmentService enrollmentService;

  @Autowired
  public EnrollmentController(EnrollmentService enrollmentService) {
    this.enrollmentService = enrollmentService;
  }

  @PostMapping("/{request-id}")
  public ResponseEntity<List<EnrollmentDTO>> addEnrollment(
      @PathVariable("request-id") String requestId,
      @RequestBody List<EnrollmentRequest> request) {
    return ResponseEntity.ok(enrollmentService.addEnrollment(requestId, request));
  }

  @GetMapping("/{request-id}/{course-code}")
  public ResponseEntity<List<EnrollmentDTO>> getListEnrollment(
      @PathVariable("request-id") String requestId,
      @PathVariable("course-code") String courseCode,
      @RequestParam(value = "classCode", required = false, defaultValue = "") String classCode) {
    return ResponseEntity.ok(enrollmentService.getListEnrollment(requestId, courseCode, classCode));
  }

  @GetMapping("{request-id}/{student-code}/student")
  public ResponseEntity<List<EnrollmentDTO>> getListEnrollmentByStudent(
      @PathVariable("request-id") String requestId,
      @PathVariable("student-code") String studentCode
  ) {
    return ResponseEntity.ok(enrollmentService.getListEnrollmentByStudent(requestId, studentCode));
  }

  @DeleteMapping("/{request-id}/{enrollment-id}")
  public ResponseEntity<EnrollmentDTO> deleteEnrollment(
      @PathVariable("request-id") String requestId, @PathVariable("enrollment-id") int enrollmentId
  ) {
    return ResponseEntity.ok(enrollmentService.deleteEnrollment(requestId, enrollmentId));
  }

  @PutMapping("/{request-id}/{enrollment-id}")
  public ResponseEntity<EnrollmentDTO> updateEnrollment(
      @PathVariable("request-id") String requestId, @PathVariable("enrollment-id") int enrollmentId,
      @RequestBody EnrollmentRequest enrollmentRequest
  ) {
    return ResponseEntity.ok(
        enrollmentService.updateEnrollment(requestId, enrollmentId, enrollmentRequest));
  }
}
