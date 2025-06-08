package vn.codezx.arise.services.impl;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.codezx.arise.constants.CourseLevelConstants;
import vn.codezx.arise.constants.MessageCode;
import vn.codezx.arise.dtos.course.CourseDTO;
import vn.codezx.arise.dtos.course.CourseExportDTO;
import vn.codezx.arise.dtos.course.CourseRequest;
import vn.codezx.arise.entities.course.Course;
import vn.codezx.arise.entities.course.Lesson;
import vn.codezx.arise.exceptions.AriseException;
import vn.codezx.arise.mappers.course.CourseExportToDTOMapper;
import vn.codezx.arise.mappers.course.CourseToDTOMapper;
import vn.codezx.arise.repositories.ClassAriseRepository;
import vn.codezx.arise.repositories.CourseRepository;
import vn.codezx.arise.repositories.LessonRepository;
import vn.codezx.arise.services.CourseService;
import vn.codezx.arise.utils.DateTimeUtil;
import vn.codezx.arise.utils.MessageUtil;
import vn.codezx.arise.utils.StringUtil;

@Service
@Slf4j
@AllArgsConstructor
public class CourseServiceImpl implements CourseService {

  private final CourseRepository courseRepository;
  private final CourseToDTOMapper courseToDTOMapper;
  private final MessageUtil messageUtil;
  private final ClassAriseRepository classAriseRepository;
  private final LessonRepository lessonRepository;
  private final CourseExportToDTOMapper courseExportToDTOMapper;

  @Override
  @Transactional
  public CourseDTO addCourse(String requestId, CourseRequest request) {
    String generateCourse = generateCourseCode();

    Course course = Course.builder().code(generateCourse).name(request.getName())
        .tuitionRate(request.getTuitionRate()).numberHour(request.getNumberHour())
        .courseLevel(request.getCourseLevelConstants()).description(request.getDescription())
        .build();
    return courseToDTOMapper.toDto(courseRepository.save(course));
  }

  private String generateCourseCode() {
    Optional<Course> latestCourseInDay = courseRepository.findTop1ByCreatedAtBetweenOrderByCodeDesc(
        DateTimeUtil.startOfDay(), DateTimeUtil.endOfDay());

    if (latestCourseInDay.isPresent()) {
      String latestCourseCode = latestCourseInDay.get().getCode();
      Integer number = Integer.parseInt(latestCourseCode.substring(latestCourseCode.length() - 2));
      return StringUtil.generateCourseCode("COU", number + 1);
    } else {
      return StringUtil.generateCourseCode("COU", 1);
    }
  }

  @Override
  @Transactional(readOnly = true)
  public CourseDTO getCourseByCode(String requestId, String courseCode) {
    Course courseEntity = courseRepository.findByCodeAndIsDeleteFalse(courseCode);
    if (ObjectUtils.isEmpty(courseEntity)) {
      throw new AriseException(requestId, messageUtil.getMessage(MessageCode.MESSAGE_NOT_FOUND));
    }
    courseEntity.getEnrollments().stream()
        .filter(enrollment -> ObjectUtils.isEmpty(enrollment.getClassArise()));
    return courseToDTOMapper.toDto(courseEntity);
  }

  @Override
  @Transactional
  public CourseDTO deleteCourseByCode(String requestId, String courseCode) {
    Course courseEntity = courseRepository.findByCodeAndIsDeleteFalse(courseCode);
    if (ObjectUtils.isEmpty(courseEntity)) {
      throw new AriseException(requestId, messageUtil.getMessage(MessageCode.MESSAGE_NOT_FOUND));
    }

    boolean hasClass = classAriseRepository.existsByCourseId(courseEntity.getId());
    if (hasClass) {
      throw new AriseException(requestId, messageUtil.getMessage(MessageCode.MESSAGE_DUPLICATE));
    }
    courseEntity.setIsDelete(true);
    List<Lesson> lessonGroup = courseEntity.getLessons();
    if (!ObjectUtils.isEmpty(lessonGroup)) {
      lessonRepository.updateIsDeleteByLessons(lessonGroup, true);
    }

    CourseDTO courseDTO = courseToDTOMapper.toDto(courseEntity);
    courseRepository.save(courseEntity);
    return courseDTO;
  }

  @Override
  @Transactional(readOnly = true)
  public Page<CourseDTO> getAllCourse(String requestId, List<CourseLevelConstants> level,
      String courseCode, Pageable pageable) {
    if (!ObjectUtils.isEmpty(courseCode)) {
      return ObjectUtils.isEmpty(level)
          ? courseRepository.searchCourse(courseCode.toLowerCase(), pageable)
              .map(courseToDTOMapper::toDto)
          : courseRepository.findByCourseLevelAndCode(level, courseCode.toLowerCase(), pageable)
              .map(courseToDTOMapper::toDto);
    }
    return ObjectUtils.isEmpty(level)
        ? courseRepository.findAllByIsDeleteFalse(pageable).map(courseToDTOMapper::toDto)
        : courseRepository.findByCourseLevelAndIsDeleteFalse(level, pageable)
            .map(courseToDTOMapper::toDto);
  }

  @Override
  @Transactional(readOnly = true)
  public List<CourseDTO> getFullCourse(String requestId) {
    return courseRepository.findAllByIsDeleteFalse().stream().map(courseToDTOMapper::toDto)
        .toList();
  }

  @Override
  public List<CourseExportDTO> getCourseExport(String requestId, List<CourseLevelConstants> level,
      String courseCode) {
    if (!ObjectUtils.isEmpty(courseCode)) {
      return ObjectUtils.isEmpty(level)
          ? courseRepository.searchCourseWithoutPage(courseCode.toLowerCase()).stream()
              .map(courseExportToDTOMapper::toDto).toList()
          : courseRepository.findByCourseLevelAndCodeWithoutPage(level, courseCode.toLowerCase())
              .stream().map(courseExportToDTOMapper::toDto).toList();
    }
    return ObjectUtils.isEmpty(level)
        ? courseRepository.findAllByIsDeleteFalse().stream().map(courseExportToDTOMapper::toDto)
            .toList()
        : courseRepository.findByCourseLevelAndIsDeleteFalseWithoutPage(level).stream()
            .map(courseExportToDTOMapper::toDto).toList();
  }

  @Override
  @Transactional
  public CourseDTO editCourse(String requestId, CourseRequest request, String courseCode) {
    Course courseEdit = courseRepository.findByCodeAndIsDeleteFalse(courseCode);
    if (ObjectUtils.isEmpty(courseEdit)) {
      throw new AriseException(requestId, messageUtil.getMessage(MessageCode.MESSAGE_NOT_FOUND));
    }
    if (!ObjectUtils.isEmpty(request.getName())) {
      courseEdit.setName(request.getName());
    }
    if (!ObjectUtils.isEmpty(request.getTuitionRate())) {
      courseEdit.setTuitionRate(request.getTuitionRate());
    }
    if (!ObjectUtils.isEmpty(request.getNumberHour())) {
      courseEdit.setNumberHour(request.getNumberHour());
    }
    if (!ObjectUtils.isEmpty(request.getCourseLevelConstants())) {
      courseEdit.setCourseLevel(request.getCourseLevelConstants());
    }
    if (request.getDescription() != null) {
      courseEdit.setDescription(request.getDescription());
    }
    courseRepository.save(courseEdit);
    return courseToDTOMapper.toDto(courseEdit);
  }
}
