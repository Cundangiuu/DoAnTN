package vn.codezx.arise.services;

import java.util.List;
import vn.codezx.arise.dtos.lesson.LessonDTO;
import vn.codezx.arise.dtos.lesson.LessonRequest;

public interface LessonService {
  List<LessonDTO> createLesson(String requestId, List<LessonRequest> request);

  List<LessonDTO> getLessonByCourse(String requestId, String courseCode);

  LessonDTO editLesson(String requestId, LessonRequest request, int lessonId);

  LessonDTO deleteLesson(String requestId, int lessonId);
}
