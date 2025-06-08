package vn.codezx.triviet.controllers.grade;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.codezx.triviet.constants.TypeOfTest;
import vn.codezx.triviet.dtos.grade.GradeDTO;
import vn.codezx.triviet.dtos.grade.GradeRequest;
import vn.codezx.triviet.services.GradeService;

@RestController
@RequestMapping(value = "/api/grades", produces = MediaType.APPLICATION_JSON_VALUE)
public class GradeController {

  private final GradeService gradeService;

  public GradeController(GradeService gradeService) {
    this.gradeService = gradeService;
  }

  @PostMapping("/{request-id}")
  public ResponseEntity<GradeDTO> createGrade(@PathVariable("request-id") String requestId,
      @RequestBody GradeRequest gradeDTO) {
    GradeDTO grade = gradeService.createGrade(requestId, gradeDTO);
    return ResponseEntity.ok(grade);
  }

  @GetMapping("/{request-id}/students/{student-id}")
  public ResponseEntity<Page<GradeDTO>> getGradesByStudentId(
      @PathVariable("request-id") String requestId, @PathVariable("student-id") Integer studentId,
      @RequestParam(value = "testType", required = false) TypeOfTest testType,
      @RequestParam(value = "classId", required = false) Integer classId,
      @SortDefault(sort = "createdAt",
          direction = Direction.DESC) @ParameterObject Pageable pageable) {
    return ResponseEntity
        .ok(gradeService.getGradesByStudentId(requestId, studentId, testType, classId, pageable));
  }

  @GetMapping("/{request-id}/{grade-id}")
  public ResponseEntity<GradeDTO> getGradeById(@PathVariable("request-id") String requestId,
      @PathVariable("grade-id") Integer gradeId) {
    return ResponseEntity.ok(gradeService.getGrade(requestId, gradeId));
  }

  @GetMapping("/{request-id}/classes/{class-id}")
  public ResponseEntity<Page<GradeDTO>> getGradesByClassId(
      @PathVariable("request-id") String requestId, @PathVariable("class-id") Integer classId,
      @RequestParam(value = "testType", required = false) TypeOfTest testType,
      @SortDefault(sort = "createdAt",
          direction = Direction.DESC) @ParameterObject Pageable pageable) {
    return ResponseEntity
        .ok(gradeService.getGradesByClassId(requestId, classId, testType, pageable));
  }

  @PutMapping("/{request-id}/{grade-id}")
  public ResponseEntity<GradeDTO> updateGrade(@PathVariable("request-id") String requestId,
      @PathVariable("grade-id") Integer gradeId, @RequestBody GradeRequest gradeRequest) {
    return ResponseEntity.ok(gradeService.updateGrade(requestId, gradeId, gradeRequest));
  }

  @DeleteMapping("/{request-id}/{grade-id}")
  public ResponseEntity<GradeDTO> deleteGrade(@PathVariable("request-id") String requestId,
      @PathVariable("grade-id") Integer gradeId) {
    return ResponseEntity.ok(gradeService.deleteGrade(requestId, gradeId));
  }

  @PostMapping("/{request-id}/{class-code}/generate-grade")
  public ResponseEntity<List<GradeDTO>> generateClassGrade(
      @PathVariable("request-id") String requestId, @PathVariable("class-code") String classCode,
      @RequestParam(value = "testType") TypeOfTest testType) {
    return ResponseEntity.ok(gradeService.generateClassGrade(requestId, classCode, testType));
  }
}
