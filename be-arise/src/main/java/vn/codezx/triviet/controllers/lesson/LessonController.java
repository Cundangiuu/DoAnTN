package vn.codezx.triviet.controllers.lesson;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.codezx.triviet.dtos.lesson.LessonDTO;
import vn.codezx.triviet.dtos.lesson.LessonRequest;
import vn.codezx.triviet.services.LessonService;

@RestController
@RequestMapping(value = "/api/lesson", produces = MediaType.APPLICATION_JSON_VALUE)
public class LessonController {

  @Autowired
  private LessonService lessonService;


  @PostMapping("/{request-id}")
  public ResponseEntity<List<LessonDTO>> createLesson(@RequestBody List<LessonRequest> lessonRequest,
      @PathVariable("request-id") String requestId) {
    return ResponseEntity.ok(lessonService.createLesson(requestId, lessonRequest));
  }

  @GetMapping("/{request-id}/{course-code}")
  public ResponseEntity<List<LessonDTO>> getAllLessonByCourse(
      @PathVariable("request-id") String requestId,
      @PathVariable("course-code") String courseCode) {
    return ResponseEntity.ok(lessonService.getLessonByCourse(requestId, courseCode));
  }

  @DeleteMapping("/{request-id}/{lesson-id}")
  public ResponseEntity<LessonDTO> deleteLesson(@PathVariable("request-id") String requestId,
      @PathVariable("lesson-id") int lessonId) {
    return ResponseEntity.ok(lessonService.deleteLesson(requestId, lessonId));
  }

  @PutMapping("/{request-id}/{lesson-id}")
  public ResponseEntity<LessonDTO> updateLesson(@PathVariable("request-id") String requestId,
      @RequestBody LessonRequest lessonRequest, @PathVariable("lesson-id") int lessonId) {
    return ResponseEntity.ok(lessonService.editLesson(requestId, lessonRequest, lessonId));
  }
}
