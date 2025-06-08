package vn.codezx.arise.controllers.student;

import java.util.List;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.beans.factory.annotation.Autowired;
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
import vn.codezx.arise.dtos.grade.StudentGradeDTO;
import vn.codezx.arise.dtos.student.StudentDTO;
import vn.codezx.arise.dtos.student.StudentRequest;
import vn.codezx.arise.entities.student.Student;
import vn.codezx.arise.services.StudentService;

@RestController
@RequestMapping(value = "/api/students", produces = MediaType.APPLICATION_JSON_VALUE)
public class StudentController {

  private final StudentService studentService;

  @Autowired
  public StudentController(StudentService studentService) {
    this.studentService = studentService;
  }

  @PostMapping(value = "/{request-id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<StudentDTO> createStudent(@PathVariable("request-id") String requestId,
      @RequestPart("studentRequest") StudentRequest studentRequest,
      @RequestPart(value = "avatar", required = false) MultipartFile avatar) {
    return ResponseEntity.ok(studentService.createStudent(requestId, studentRequest, avatar));
  }

  @GetMapping("/{request-id}/{id}/id")
  public ResponseEntity<StudentDTO> getStudentById(@PathVariable("request-id") String requestId, @PathVariable("id") Integer id){
    return ResponseEntity.ok(studentService.getStudentById(requestId, id));
  }

  @GetMapping("/{request-id}")
  public ResponseEntity<Page<StudentDTO>> getStudents(@PathVariable("request-id") String requestId,
      @RequestParam(value = "query", required = false) String query,
      @RequestParam(value = "hasAvatar", required = false) String hasAvatar,
      @SortDefault(sort = "createdAt",
          direction = Direction.DESC) @ParameterObject Pageable pageable) {
    return ResponseEntity.ok(studentService.getStudents(requestId, query, hasAvatar, pageable));
  }

  @GetMapping("/{request-id}/export")
  public ResponseEntity<List<StudentDTO>> exportStudents(
      @PathVariable("request-id") String requestId,
      @RequestParam(value = "query", required = false) String query,
      @RequestParam(value = "hasAvatar", required = false) String hasAvatar) {
    return ResponseEntity.ok(studentService.exportStudents(requestId, query, hasAvatar));
  }


  @GetMapping("/{request-id}/total")
  public ResponseEntity<Integer> getTotalNumberStudent(
      @PathVariable("request-id") String requestId) {
    return ResponseEntity.ok(studentService.getTotalStudent(requestId));
  }

  @GetMapping("/{request-id}/{student-code}")
  public ResponseEntity<StudentDTO> getStudent(@PathVariable("request-id") String requestId,
      @PathVariable("student-code") String studentCode) {
    return ResponseEntity.ok(studentService.getStudent(requestId, studentCode));
  }

  @PutMapping("/{request-id}/{student-id}")
  public ResponseEntity<StudentDTO> updateStudent(@PathVariable("request-id") String requestId,
      @PathVariable("student-id") Integer studentId,
      @RequestPart("studentRequest") StudentRequest studentRequest,
      @RequestPart(value = "avatar", required = false) MultipartFile avatar) {
    return ResponseEntity
        .ok(studentService.updateStudent(requestId, studentId, studentRequest, avatar));
  }

  @DeleteMapping("/{request-id}/{student-id}")
  public ResponseEntity<StudentDTO> deleteStudent(@PathVariable("request-id") String requestId,
      @PathVariable("student-id") Integer studentId) {
    return ResponseEntity.ok(studentService.deleteStudent(requestId, studentId));
  }

  @GetMapping("/{request-id}/pre-enrollment")
  public ResponseEntity<List<StudentDTO>> getPreEnrollmentStudent(
      @PathVariable("request-id") String requestId) {
    return ResponseEntity.ok(studentService.getPreEnrollmentStudent(requestId));
  }

  @GetMapping("/{request-id}/{class-code}/class-code")
  public ResponseEntity<List<StudentDTO>> getStudentByClass(
      @PathVariable("request-id") String requestId, @PathVariable("class-code") String classCode) {
    return ResponseEntity.ok(studentService.getStudentsByClassCode(requestId, classCode));
  }

  @GetMapping("/{request-id}/not-debt")
  public ResponseEntity<Page<StudentDTO>> getStudentWithoutDebt(
      @RequestParam(value = "hasAvatar", required = false) String hasAvatar,
      @RequestParam(value = "query", required = false) String query,
      @SortDefault(sort = "createdAt",
          direction = Direction.DESC) @ParameterObject Pageable pageable,
      @PathVariable("request-id") String requestId) {
    return ResponseEntity.ok(studentService.getStudentsWithoutDebt(requestId, query, pageable));
  }

  @GetMapping("/{request-id}/{student-id}/grade")
  public ResponseEntity<List<StudentGradeDTO>> getGradeOfStudent(
      @PathVariable("request-id") String requestId, @PathVariable("student-id") Integer studentId) {
    return ResponseEntity.ok(studentService.getGradeOfStudent(studentId));
  }
}
