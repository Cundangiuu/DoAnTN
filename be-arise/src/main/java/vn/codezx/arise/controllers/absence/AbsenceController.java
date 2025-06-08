package vn.codezx.arise.controllers.absence;

import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.codezx.arise.dtos.absence.AbsenceDTO;
import vn.codezx.arise.dtos.absence.AbsenceRequest;
import vn.codezx.arise.services.AbsenceService;

@RestController
@RequestMapping("/api/attendance")
public class AbsenceController {

  private final AbsenceService absenceService;

  @Autowired
  AbsenceController(AbsenceService absenceService) {
    this.absenceService = absenceService;
  }

  @PostMapping("{request-id}")
  public ResponseEntity<AbsenceDTO> markAttendance(@PathVariable("request-id") String requestId,
      @RequestBody AbsenceRequest attendanceRequest) {
    AbsenceDTO createdAttendance = absenceService.markAbsence(requestId, attendanceRequest);
    return ResponseEntity.ok(createdAttendance);
  }

  @GetMapping("{request-id}")
  public ResponseEntity<List<AbsenceDTO>> getListAbsence(
      @PathVariable("request-id") String requestId) {
    return ResponseEntity.ok(absenceService.getAbsentGroup(requestId));
  }

  @GetMapping("{request-id}/{student-code}/student")
  public ResponseEntity<List<AbsenceDTO>> getListAbsenceByStudent(
      @PathVariable("request-id") String requestId,
      @PathVariable("student-code") String studentCode) {
    return ResponseEntity.ok(absenceService.getStudentAbsence(requestId, studentCode));
  }

  @GetMapping("{request-id}/{class-code}/class")
  public ResponseEntity<List<AbsenceDTO>> getListAbsenceByClass(
      @PathVariable("request-id") String requestId,
      @PathVariable("class-code") String classCode
  ) {
    return ResponseEntity.ok(absenceService.getAbsenceByClass(requestId, classCode));
  }

  @GetMapping("absence-report/{request-id}")
  public ResponseEntity<Resource> getAbsentReport(@PathVariable("request-id") String requestId,
      @DateTimeFormat(iso = ISO.DATE_TIME) @RequestParam(required = true) Date from,
      @DateTimeFormat(iso = ISO.DATE_TIME) @RequestParam(required = true) Date to) {
    var data = absenceService.absenceDayReport(requestId, from, to);
    var headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
    headers.setContentDisposition(
        ContentDisposition.attachment().filename(data.getFilename()).build());
    return ResponseEntity.ok().headers(headers).body(data.getResource());
  }
}
