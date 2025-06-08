package vn.codezx.triviet.services;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.when;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import vn.codezx.triviet.constants.MessageCode;
import vn.codezx.triviet.dtos.course.CourseDTO;
import vn.codezx.triviet.dtos.course.CourseRequest;
import vn.codezx.triviet.entities.course.Course;
import vn.codezx.triviet.exceptions.TveException;
import vn.codezx.triviet.mappers.course.CourseToDTOMapper;
import vn.codezx.triviet.repositories.ClassTvmsRepository;
import vn.codezx.triviet.repositories.CourseRepository;
import vn.codezx.triviet.services.impl.CourseServiceImpl;
import vn.codezx.triviet.utils.MessageUtil;

@ExtendWith(MockitoExtension.class)
class CourseServiceImplTest {

  @InjectMocks
  private CourseServiceImpl courseService;

  @Mock
  private CourseToDTOMapper courseToDTOMapper;

  @Mock
  private CourseRepository courseRepository;

  @Mock
  private ClassTvmsRepository classTvmsRepository;

  @Mock
  private MessageUtil messageUtil;

  private CourseRequest courseRequest;

  private Course courseEntity;
  private String requestId;

  @BeforeEach
  void setUp() {
    requestId = "test-request-id";
    courseRequest = CourseRequest.builder().name("Test Course").tuitionRate(1000).numberHour(40)
        .description("Test Description").build();

    courseEntity = Course.builder().code("COU12012401").name("Test Course").tuitionRate(1000)
        .numberHour(40).description("Test Description").build();

  }

  @Test
  void testGetCourseByCode() {
    when(courseRepository.findByCodeAndIsDeleteFalse("COU12012401")).thenReturn(courseEntity);
    doAnswer(invocation -> {
      Course course = invocation.getArgument(0);
      return CourseDTO.builder().id(course.getId()).code(course.getCode()).name(course.getName())
          .tuitionRate(course.getTuitionRate()).numberHour(course.getNumberHour())
          .description(course.getDescription()).build();
    }).when(courseToDTOMapper).toDto(any(Course.class));
    CourseDTO result = courseService.getCourseByCode(requestId, "COU12012401");
    Assertions.assertNotNull(result);
    Assertions.assertEquals("COU12012401", result.getCode());
    Assertions.assertEquals("Test Course", result.getName());
  }

  @Test
  void testGetCourseByCode_NotFound() {
    when(courseRepository.findByCodeAndIsDeleteFalse("COU2024120101")).thenReturn(null);
    when(messageUtil.getMessage(MessageCode.MESSAGE_NOT_FOUND)).thenReturn("Course not found");

    TveException exception = assertThrows(TveException.class, () ->
        courseService.getCourseByCode("test-request-id", "COU2024120101"));

    Assertions.assertEquals("Course not found", exception.getMessage());
  }

  @Test
  void testDeleteCourse() {
    when(courseRepository.findByCodeAndIsDeleteFalse("COU12012401")).thenReturn(courseEntity);
    when(classTvmsRepository.existsByCourseId(courseEntity.getId())).thenReturn(false);
    doAnswer(invocation -> {
      Course course = invocation.getArgument(0);
      return CourseDTO.builder().id(course.getId()).code(course.getCode()).name(course.getName())
          .tuitionRate(course.getTuitionRate()).numberHour(course.getNumberHour())
          .description(course.getDescription()).build();
    }).when(courseToDTOMapper).toDto(any(Course.class));

    CourseDTO courseDTO = courseService.deleteCourseByCode(requestId, "COU12012401");

    Assertions.assertNotNull(courseDTO);
    Assertions.assertEquals("COU12012401", courseDTO.getCode());

  }

  @Test
  void testDeleteCourseByCode_CourseNotFound() {
    when(courseRepository.findByCodeAndIsDeleteFalse("COU12012401")).thenReturn(null);

    when(messageUtil.getMessage(MessageCode.MESSAGE_NOT_FOUND)).thenReturn("Course not found");

    TveException exception = assertThrows(
        TveException.class,
        () -> courseService.deleteCourseByCode(requestId, "COU12012401")
    );

    Assertions.assertEquals("Course not found", exception.getMessage());
  }

  @Test
  void testDeleteCourseByCode_HasAssociatedClasses() {

    when(courseRepository.findByCodeAndIsDeleteFalse("COU12012401")).thenReturn(courseEntity);

    when(classTvmsRepository.existsByCourseId(courseEntity.getId())).thenReturn(true);

    when(messageUtil.getMessage(MessageCode.MESSAGE_DUPLICATE))
        .thenReturn("Course has associated classes !!!");

    TveException exception = assertThrows(
        TveException.class,
        () -> courseService.deleteCourseByCode(requestId, "COU12012401")
    );

    Assertions.assertEquals("Course has associated classes !!!", exception.getMessage());
  }

  @Test
  void testEditCourse() {
    when(courseRepository.findByCodeAndIsDeleteFalse("COU12012401")).thenReturn(courseEntity);
    doAnswer(invocation -> {
      Course savedCourse = invocation.getArgument(0);
      courseEntity.setName(savedCourse.getName());
      courseEntity.setTuitionRate(savedCourse.getTuitionRate());
      courseEntity.setNumberHour(savedCourse.getNumberHour());
      courseEntity.setDescription(savedCourse.getDescription());
      return courseEntity;
    }).when(courseRepository).save(any(Course.class));

    doAnswer(invocation -> {
      Course course = invocation.getArgument(0);
      return CourseDTO.builder().id(course.getId()).code(course.getCode()).name(course.getName())
          .tuitionRate(course.getTuitionRate()).numberHour(course.getNumberHour())
          .description(course.getDescription()).build();
    }).when(courseToDTOMapper).toDto(any(Course.class));
    courseRequest.setName("Updated Course");
    courseRequest.setTuitionRate(100);
    CourseDTO result = courseService.editCourse("test-request-id", courseRequest, "COU12012401");

    Assertions.assertNotNull(result);
    Assertions.assertEquals("Updated Course", result.getName());
    Assertions.assertEquals(100, result.getTuitionRate());
  }
}
