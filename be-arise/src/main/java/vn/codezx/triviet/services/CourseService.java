package vn.codezx.triviet.services;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.codezx.triviet.constants.CourseLevelConstants;
import vn.codezx.triviet.dtos.course.CourseDTO;
import vn.codezx.triviet.dtos.course.CourseExportDTO;
import vn.codezx.triviet.dtos.course.CourseRequest;

public interface CourseService {

  CourseDTO addCourse(String requestId, CourseRequest request);

  CourseDTO getCourseByCode(String requestId, String courseCode);

  CourseDTO deleteCourseByCode(String requestId, String courseCode);

  Page<CourseDTO> getAllCourse(String requestId, List<CourseLevelConstants> level,
      String courseCode, Pageable pageable);

  List<CourseExportDTO> getCourseExport(String requestId, List<CourseLevelConstants> level,
      String courseCode);

  CourseDTO editCourse(String requestId, CourseRequest request, String courseCode);

  List<CourseDTO> getFullCourse(String requestId);
}
