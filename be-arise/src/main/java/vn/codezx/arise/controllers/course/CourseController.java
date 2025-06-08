package vn.codezx.arise.controllers.course;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.codezx.arise.constants.CourseLevelConstants;
import vn.codezx.arise.dtos.course.CourseDTO;
import vn.codezx.arise.dtos.course.CourseExportDTO;
import vn.codezx.arise.dtos.course.CourseRequest;
import vn.codezx.arise.services.CourseService;

@RestController
@RequestMapping(value = "/api/courses", produces = MediaType.APPLICATION_JSON_VALUE)
public class CourseController {

  @Autowired
  private CourseService courseService;

  @PostMapping("/{request-id}")
  public ResponseEntity<CourseDTO> addCourse(@PathVariable("request-id") String requestId,
      @RequestBody CourseRequest course) {
    CourseDTO createdCourse = courseService.addCourse(requestId, course);
    return ResponseEntity.ok(createdCourse);
  }

  @GetMapping("/{request-id}/getAll")
  public ResponseEntity<Page<CourseDTO>> getAllCourse(@PathVariable("request-id") String requestId,
      @RequestParam(required = false) List<CourseLevelConstants> level,
      @RequestParam(required = false) String courseCode, @SortDefault(sort = "createdAt",
          direction = Direction.DESC) @ParameterObject Pageable pageable) {
    return ResponseEntity.ok(courseService.getAllCourse(requestId, level, courseCode, pageable));
  }

  @GetMapping("/{request-id}/get-full")
  public ResponseEntity<List<CourseDTO>> getFullCourse(
      @PathVariable("request-id") String requestId) {
    return ResponseEntity.ok(courseService.getFullCourse(requestId));
  }

  @GetMapping("/{request-id}/export")
  public ResponseEntity<List<CourseExportDTO>> getCourseExport(
      @PathVariable("request-id") String requestId,
      @RequestParam(required = false) List<CourseLevelConstants> level,
      @RequestParam(required = false) String courseCode) {
    return ResponseEntity.ok(courseService.getCourseExport(requestId, level, courseCode));
  }

  @GetMapping("/{request-id}/{course-code}")
  public ResponseEntity<CourseDTO> getCourseById(@PathVariable("request-id") String requestId,
      @PathVariable("course-code") String courseCode) {
    return ResponseEntity.ok(courseService.getCourseByCode(requestId, courseCode));
  }

  @PutMapping("/{request-id}/{course-code}")
  public ResponseEntity<CourseDTO> editCourse(@PathVariable("course-code") String courseCode,
      @PathVariable("request-id") String requestId, @RequestBody CourseRequest courseRequest) {
    return ResponseEntity.ok(courseService.editCourse(requestId, courseRequest, courseCode));
  }

  @DeleteMapping("/{request-id}/{course-code}")
  public ResponseEntity<CourseDTO> deleteCourse(@PathVariable("course-code") String courseCode,
      @PathVariable("request-id") String requestId) {
    return ResponseEntity.ok(courseService.deleteCourseByCode(requestId, courseCode));
  }
}
