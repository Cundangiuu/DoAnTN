package vn.codezx.arise.services.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import lombok.extern.slf4j.Slf4j;
import vn.codezx.arise.constants.MessageCode;
import vn.codezx.arise.dtos.enrollment.EnrollmentDTO;
import vn.codezx.arise.dtos.enrollment.EnrollmentRequest;
import vn.codezx.arise.entities.course.ClassArise;
import vn.codezx.arise.entities.course.Course;
import vn.codezx.arise.entities.reporting.Enrollment;
import vn.codezx.arise.entities.student.Student;
import vn.codezx.arise.exceptions.AriseException;
import vn.codezx.arise.mappers.enrollment.EnrollmentToDTOMapper;
import vn.codezx.arise.repositories.ClassAriseRepository;
import vn.codezx.arise.repositories.CourseRepository;
import vn.codezx.arise.repositories.EnrollmentRepository;
import vn.codezx.arise.repositories.StudentRepository;
import vn.codezx.arise.services.EnrollmentService;
import vn.codezx.arise.utils.MessageUtil;

@Service
@Slf4j
public class EnrollmentServiceImpl implements EnrollmentService {

  private final StudentRepository studentRepository;
  private final CourseRepository courseRepository;
  private final EnrollmentRepository enrollmentRepository;
  private final EnrollmentToDTOMapper enrollmentToDTOMapper;

  private final ClassAriseRepository classAriseRepository;
  private final MessageUtil messageUtil;

  @Autowired
  public EnrollmentServiceImpl(StudentRepository studentRepository,
      CourseRepository courseRepository, EnrollmentRepository enrollmentRepository,
      EnrollmentToDTOMapper enrollmentToDTOMapper, MessageUtil messageUtil,
      ClassAriseRepository classAriseRepository) {
    this.classAriseRepository = classAriseRepository;
    this.enrollmentToDTOMapper = enrollmentToDTOMapper;
    this.messageUtil = messageUtil;
    this.courseRepository = courseRepository;
    this.studentRepository = studentRepository;
    this.enrollmentRepository = enrollmentRepository;
  }

  @Override
  @Transactional
  public List<EnrollmentDTO> addEnrollment(String requestId, List<EnrollmentRequest> request) {
    List<Enrollment> enrollments = new ArrayList<>();

    request.forEach((enrollmentRequest) -> {
      Student student = studentRepository.findById(enrollmentRequest.getStudentId()).orElseThrow(
          () -> new AriseException(requestId,
              messageUtil.getMessage(MessageCode.MESSAGE_STU_NOT_FOUND)));

      Course course = courseRepository.findById(enrollmentRequest.getCourseId()).orElseThrow(
          () -> new AriseException(requestId, messageUtil.getMessage(MessageCode.MESSAGE_NOT_FOUND)));

      Optional<ClassArise> classArise = classAriseRepository.findByCodeAndIsDeleteFalse(
          enrollmentRequest.getClassCode());

      Enrollment enrollment = Enrollment.builder().student(student).course(course)
          .enrollmentDate(ObjectUtils.isEmpty(enrollmentRequest.getEnrollmentDate()) ? new Date()
              : enrollmentRequest.getEnrollmentDate())
          .build();
      classArise.ifPresent(enrollment::setClassArise);
      enrollments.add(enrollment);
    });

    return enrollmentToDTOMapper.toListDto(enrollmentRepository.saveAll(enrollments));
  }

  @Override
  @Transactional
  public EnrollmentDTO deleteEnrollment(String requestId, int enrollmentId) {
    Optional<Enrollment> enrollmentObject = enrollmentRepository.findById(enrollmentId);
    if (enrollmentObject.isEmpty()) {
      throw new AriseException(requestId,
          messageUtil.getMessage(MessageCode.MESSAGE_ENROLLMENT_NOT_FOUND));
    }
    Enrollment enrollment = enrollmentObject.get();
    EnrollmentDTO enrollmentDTO = enrollmentToDTOMapper.toDto(enrollment);
    enrollmentRepository.delete(enrollment);
    return enrollmentDTO;
  }

  @Override
  @Transactional(readOnly = true)
  public List<EnrollmentDTO> getListEnrollment(String requestId, String courseCode,
      String classCode) {
    List<Enrollment> enrollments = ObjectUtils.isEmpty(classCode)
        ? enrollmentRepository.findEnrollmentsByCourseCodeAndIsDeleteFalse(courseCode)
        : enrollmentRepository.findEnrollmentsByCourseCodeAndClassCode(courseCode, classCode);

    if (ObjectUtils.isEmpty(enrollments)) {
      throw new AriseException(requestId,
          messageUtil.getMessage(MessageCode.MESSAGE_ENROLLMENT_NOT_FOUND));
    }

    return enrollmentToDTOMapper.toListDto(enrollments);
  }

  @Override
  @Transactional(readOnly = true)
  public List<EnrollmentDTO> getListEnrollmentByStudent(String requestId, String studentCode) {
    List<Enrollment> enrollmentList = enrollmentRepository.findEnrollmentByStudentCode(
        studentCode);

    return enrollmentToDTOMapper.toListDto(enrollmentList);
  }

  @Override
  @Transactional()
  public EnrollmentDTO updateEnrollment(String requestId, int enrollmentId,
      EnrollmentRequest request) {
    Enrollment enrollment = enrollmentRepository.findByIdAndIsDeleteFalse(enrollmentId);
    if (ObjectUtils.isEmpty(enrollment)) {
      throw new AriseException(requestId, messageUtil.getMessage(MessageCode.MESSAGE_NOT_FOUND));
    }
    Course course = courseRepository.findByIdAndIsDeleteFalse(request.getCourseId());
    if (!ObjectUtils.isEmpty(course)) {
      enrollment.setCourse(course);
    }
    Student student = studentRepository.findByIdAndIsDeleteFalse(request.getStudentId())
        .orElseThrow(() -> new AriseException(requestId,
            messageUtil.getMessage(MessageCode.MESSAGE_NOT_FOUND)));

    enrollment.setStudent(student);
    enrollment.setEnrollmentDate(ObjectUtils.isEmpty(request.getEnrollmentDate()) ? new Date()
        : request.getEnrollmentDate());
    return enrollmentToDTOMapper.toDto(enrollmentRepository.save(enrollment));
  }
}
