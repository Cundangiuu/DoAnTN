package vn.codezx.arise.services.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import lombok.extern.slf4j.Slf4j;
import vn.codezx.arise.constants.MessageCode;
import vn.codezx.arise.constants.TypeOfTest;
import vn.codezx.arise.dtos.lesson.LessonDTO;
import vn.codezx.arise.dtos.lesson.LessonRequest;
import vn.codezx.arise.entities.course.Course;
import vn.codezx.arise.entities.course.Lesson;
import vn.codezx.arise.exceptions.AriseException;
import vn.codezx.arise.mappers.lesson.LessonToDTOMapper;
import vn.codezx.arise.repositories.ClassDayRepository;
import vn.codezx.arise.repositories.ClassAriseRepository;
import vn.codezx.arise.repositories.CourseRepository;
import vn.codezx.arise.repositories.LessonRepository;
import vn.codezx.arise.repositories.TestTypeRepository;
import vn.codezx.arise.services.ClassDayService;
import vn.codezx.arise.services.LessonService;
import vn.codezx.arise.utils.LogUtil;
import vn.codezx.arise.utils.MessageUtil;

@Service
@Slf4j
public class LessonServiceImpl implements LessonService {

  private final CourseRepository courseRepository;
  private final TestTypeRepository testTypeRepository;
  private final LessonRepository lessonRepository;
  private final LessonToDTOMapper lessonToDTOMapper;
  private final MessageUtil messageUtil;
  private final ClassAriseRepository classAriseRepository;
  private final ClassDayService classDayService;
  private final ClassDayRepository classDayRepository;

  public LessonServiceImpl(MessageUtil messageUtil, CourseRepository courseRepository,
      LessonRepository lessonRepository, LessonToDTOMapper lessonToDTOMapper,
      ClassAriseRepository classAriseRepository, ClassDayService classDayService,
      ClassDayRepository classDayRepository, TestTypeRepository testTypeRepository) {
    this.messageUtil = messageUtil;
    this.courseRepository = courseRepository;
    this.lessonRepository = lessonRepository;
    this.lessonToDTOMapper = lessonToDTOMapper;
    this.classAriseRepository = classAriseRepository;
    this.classDayService = classDayService;
    this.classDayRepository = classDayRepository;
    this.testTypeRepository = testTypeRepository;
  }

  @Override
  @Transactional
  public List<LessonDTO> createLesson(String requestId, List<LessonRequest> request) {
    List<Lesson> lessonList = new ArrayList<>();
    Set<Course> courses = new HashSet<>();
    request.forEach(lessonElm -> {
      Course courseEntity = courseRepository.findByCodeAndIsDeleteFalse(lessonElm.getCourseId());
      if (ObjectUtils.isEmpty(courseEntity)) {
        throw new AriseException(requestId, messageUtil.getMessage(MessageCode.MESSAGE_NOT_FOUND));
      }

      courses.add(courseEntity);

      Lesson lesson =
          Lesson.builder().course(courseEntity).description(lessonElm.getDescription()).build();

      if (lessonElm.getLessonType() == TypeOfTest.MIDTERM
          || lessonElm.getLessonType() == TypeOfTest.FINAL) {
        var type = testTypeRepository.findByType(lessonElm.getLessonType());

        if (!type.isPresent()) {
          var message = LogUtil.buildFormatLog(requestId, messageUtil
              .getMessage(MessageCode.MESSAGE_LESS_TYPE_NOT_FOUND, lessonElm.getLessonType()));
          log.error(message);

          throw new AriseException(MessageCode.MESSAGE_LESS_TYPE_NOT_FOUND, message);
        }
        lesson.setLessonType(type.get());
      }
      courseEntity.getLessons().add(lesson);
      lessonList.add(lesson);
    });

    var lessons = lessonToDTOMapper.toListDto(lessonRepository.saveAllAndFlush(lessonList));
    courses.forEach(course -> updateClassDay(requestId, course));

    return lessons;
  }

  @Override
  @Transactional(readOnly = true)
  public List<LessonDTO> getLessonByCourse(String requestId, String courseCode) {

    List<Lesson> lessons = lessonRepository.findLessonsByCourseCodeAndIsDeleteFalse(courseCode);
    if (ObjectUtils.isEmpty(lessons)) {
      throw new AriseException(requestId, messageUtil.getMessage(MessageCode.MESSAGE_NOT_FOUND));
    }

    return lessonToDTOMapper.toListDto(lessons);
  }

  @Override
  @Transactional
  public LessonDTO editLesson(String requestId, LessonRequest request, int lessonId) {
    Lesson lesson = lessonRepository.findByIdAndIsDeleteFalse(lessonId);
    if (ObjectUtils.isEmpty(lesson)) {
      throw new AriseException(requestId, messageUtil.getMessage(MessageCode.MESSAGE_NOT_FOUND));
    }
    if (request.getDescription() != null) {
      lesson.setDescription(request.getDescription());
    }
    if (request.getLessonType() == null) {
      lesson.setLessonType(null);
    }
    if (request.getLessonType() == TypeOfTest.MIDTERM
        || request.getLessonType() == TypeOfTest.FINAL) {
      var type = testTypeRepository.findByType(request.getLessonType());

      if (!type.isPresent()) {
        var message = LogUtil.buildFormatLog(requestId, messageUtil
            .getMessage(MessageCode.MESSAGE_LESS_TYPE_NOT_FOUND, request.getLessonType()));
        log.error(message);

        throw new AriseException(MessageCode.MESSAGE_LESS_TYPE_NOT_FOUND, message);
      }
      lesson.setLessonType(type.get());
    }

    return lessonToDTOMapper.toDto(lessonRepository.save(lesson));
  }

  @Override
  @Transactional
  public LessonDTO deleteLesson(String requestId, int lessonId) {
    Optional<Lesson> lesson = lessonRepository.findById(lessonId);
    if (lesson.isEmpty()) {
      throw new AriseException(requestId, messageUtil.getMessage(MessageCode.MESSAGE_NOT_FOUND));
    }
    LessonDTO lessonDTO = lessonToDTOMapper.toDto(lesson.get());
    classDayRepository.deleteByLessonId(lessonId);
    lessonRepository.deleteById(lesson.get().getId());
    return lessonDTO;
  }

  private void updateClassDay(String requestId, Course course) {
    var classes = classAriseRepository.findAllByCourseAndIsDeleteFalse(course);

    for (int i = 0; i < classes.size(); i++) {
      classes.get(i).setCourse(course);
      classDayService.generateClassDay(requestId, classes.get(i), true);
    }
  }
}
