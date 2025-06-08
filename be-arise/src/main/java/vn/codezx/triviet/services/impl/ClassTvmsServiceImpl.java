package vn.codezx.triviet.services.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.codezx.triviet.constants.ClassStatus;
import vn.codezx.triviet.constants.InvoiceStatus;
import vn.codezx.triviet.constants.MessageCode;
import vn.codezx.triviet.dtos.classTvms.ClassDTO;
import vn.codezx.triviet.dtos.classTvms.CreateClassDTO;
import vn.codezx.triviet.dtos.classTvms.UpdateClassDTO;
import vn.codezx.triviet.entities.course.ClassTvms;
import vn.codezx.triviet.entities.reporting.Enrollment;
import vn.codezx.triviet.entities.reporting.Invoice;
import vn.codezx.triviet.entities.student.Student;
import vn.codezx.triviet.exceptions.TveException;
import vn.codezx.triviet.mappers.classTvms.ClassTvmsToDTOMapper;
import vn.codezx.triviet.repositories.AbsenceRepository;
import vn.codezx.triviet.repositories.ClassDayRepository;
import vn.codezx.triviet.repositories.ClassTvmsRepository;
import vn.codezx.triviet.repositories.CourseRepository;
import vn.codezx.triviet.repositories.CriteriaRepository;
import vn.codezx.triviet.repositories.EnrollmentRepository;
import vn.codezx.triviet.repositories.GradeRepository;
import vn.codezx.triviet.repositories.InvoiceRepository;
import vn.codezx.triviet.repositories.ScheduleRepository;
import vn.codezx.triviet.repositories.SkillRepository;
import vn.codezx.triviet.repositories.StaffRepository;
import vn.codezx.triviet.repositories.StudentRepository;
import vn.codezx.triviet.services.ClassDayService;
import vn.codezx.triviet.services.ClassTvmsService;
import vn.codezx.triviet.utils.DateTimeUtil;
import vn.codezx.triviet.utils.LogUtil;
import vn.codezx.triviet.utils.MessageUtil;
import vn.codezx.triviet.utils.StringUtil;

@Service
@Slf4j
@RequiredArgsConstructor
public class ClassTvmsServiceImpl implements ClassTvmsService {

  private final ClassTvmsToDTOMapper classTvmsToDTOMapper;
  private final CourseRepository courseRepository;
  private final ScheduleRepository scheduleRepository;
  private final ClassTvmsRepository classTvmsRepository;
  private final MessageUtil messageUtil;
  private final EnrollmentRepository enrollmentRepository;
  private final AbsenceRepository absenceRepository;
  private final StudentRepository studentRepository;
  private final ClassDayService classDayService;
  private final SkillRepository skillRepository;
  private final StaffRepository staffRepository;
  private final InvoiceRepository invoiceRepository;
  private final GradeRepository gradeRepository;
  private final ClassDayRepository classDayRepository;
  private final CriteriaRepository criteriaRepository;

  @Override
  @Transactional
  public ClassDTO createClass(String requestId, CreateClassDTO classRequest) {
    var schedules =
        scheduleRepository.findAllByIdInAndIsDeleteIsFalse(classRequest.getScheduleIds());

    if (schedules.size() != classRequest.getScheduleIds().size()) {
      var message = LogUtil.buildFormatLog(requestId, messageUtil
          .getMessage(MessageCode.MESSAGE_SCHE_NOT_FOUND, classRequest.getScheduleIds()));
      log.error(message);
      throw new TveException(MessageCode.MESSAGE_SCHE_NOT_FOUND.getCode(), message);
    }

    var courseOptional = courseRepository.findById(classRequest.getCourseId());

    if (!courseOptional.isPresent()) {
      var message = LogUtil.buildFormatLog(requestId,
          messageUtil.getMessage(MessageCode.MESSAGE_NOT_FOUND, classRequest.getCourseId()));
      log.error(message);
      throw new TveException(MessageCode.MESSAGE_NOT_FOUND.getCode(), message);
    }

    var staffOptional = staffRepository.findByIdAndIsDeleteFalse(classRequest.getStaffId());

    if (!staffOptional.isPresent()) {
      var message = LogUtil.buildFormatLog(requestId,
          messageUtil.getMessage(MessageCode.MESSAGE_STAFF_NOT_FOUND, classRequest.getStaffId()));
      log.error(message);
      throw new TveException(MessageCode.MESSAGE_STAFF_NOT_FOUND.getCode(), message);
    }

    var classOptional = classTvmsRepository.findByNameAndIsDeleteFalse(classRequest.getClassName());

    if (classOptional.isPresent()) {
      var message = LogUtil.buildFormatLog(requestId, messageUtil
          .getMessage(MessageCode.MESSAGE_CLA_NAME_DULICATED, classRequest.getCourseId()));
      log.error(message);
      throw new TveException(MessageCode.MESSAGE_CLA_NAME_DULICATED.getCode(), message);
    }
    var course = courseOptional.get();

    var students = studentRepository.findAllByIdInAndIsDeleteIsFalse(classRequest.getStudentIds());
    if (students.size() != classRequest.getStudentIds().size()) {
      var message = LogUtil.buildFormatLog(requestId,
          messageUtil.getMessage(MessageCode.MESSAGE_STU_NOT_FOUND, classRequest.getStudentIds()));
      log.error(message);
      throw new TveException(MessageCode.MESSAGE_STU_NOT_FOUND.getCode(), message);
    }
    var classTvms = classTvmsRepository.saveAndFlush(ClassTvms.builder().staff(staffOptional.get())
        .name(classRequest.getClassName()).code(generateClassCode()).course(course)
        .schedules(schedules).students(students).startDate(classRequest.getStartDate()).build());

    List<Integer> studentIds = students.stream().map(Student::getId).collect(Collectors.toList());
    List<Enrollment> enrollments =
        enrollmentRepository.findEnrollmentByCourseId(classRequest.getCourseId(), studentIds);
    List<Invoice> invoices = new ArrayList<>();
    if (ObjectUtils.isEmpty(enrollments)) {
      List<Enrollment> newEnrollment = new ArrayList<>();
      students.forEach(student -> {
        Enrollment enrollment = Enrollment.builder().classTvms(classTvms).course(course)
            .student(student).enrollmentDate(new Date()).build();
        newEnrollment.add(enrollment);
        Invoice invoice =
            Invoice.builder().enrollment(enrollment)
                .tuitionOwed(ObjectUtils.isEmpty(student.getDiscount())
                    ? enrollment.getCourse().getTuitionRate()
                    : enrollment.getCourse().getTuitionRate() - (student.getDiscount().getAmount()
                        * enrollment.getCourse().getTuitionRate()) / 100)
                .invoiceStatus(!ObjectUtils.isEmpty(student.getDiscount())
                    && student.getDiscount().getAmount() == 100 ? InvoiceStatus.FULLY_PAID
                    : InvoiceStatus.NOT_PAID)
                .build();
        invoices.add(invoice);
      });
      enrollmentRepository.saveAll(newEnrollment);
    } else {
      enrollments.forEach(enrollment -> {
        enrollment.setClassTvms(classTvms);
        Invoice invoice = Invoice.builder().enrollment(enrollment)
            .tuitionOwed(ObjectUtils.isEmpty(enrollment.getStudent().getDiscount())
                ? enrollment.getCourse().getTuitionRate()
                : enrollment.getCourse().getTuitionRate()
                    - (enrollment.getStudent().getDiscount().getAmount()
                    * enrollment.getCourse().getTuitionRate()) / 100)
            .invoiceStatus(!ObjectUtils.isEmpty(enrollment.getStudent().getDiscount())
                && enrollment.getStudent().getDiscount().getAmount() == 100
                ? InvoiceStatus.FULLY_PAID
                : InvoiceStatus.NOT_PAID)
            .build();
        invoices.add(invoice);
      });
      enrollmentRepository.saveAll(enrollments);
    }

    invoiceRepository.saveAll(invoices);
    classDayService.generateClassDay(requestId, classTvms, false);
    return classTvmsToDTOMapper.toDto(classTvms);
  }

  @Override
  @Transactional(readOnly = true)
  public ClassDTO getClass(String requestId, int classId) {
    var classOptional = classTvmsRepository.findByIdAndIsDeleteFalse(classId);

    if (!classOptional.isPresent()) {
      var message = LogUtil.buildFormatLog(requestId,
          messageUtil.getMessage(MessageCode.MESSAGE_CLA_NOTFOUND, classId));
      log.error(message);
      throw new TveException(MessageCode.MESSAGE_CLA_NOTFOUND.getCode(), message);
    }

    return classTvmsToDTOMapper.toDto(classOptional.get());
  }

  private Page<ClassTvms> getClassRaw(String searchString, ClassStatus status, Pageable pageable) {
    if (Objects.isNull(status)) {
      return classTvmsRepository.searchClass(searchString, pageable);
    }

    if (status == ClassStatus.NEW) {
      return classTvmsRepository.searchNewClass(searchString, pageable);
    }
    if (status == ClassStatus.ON_GOING) {
      return classTvmsRepository.searchOnGoingClass(searchString, pageable);
    }

    return classTvmsRepository.searchEndedClass(searchString, pageable);
  }

  private Page<ClassTvms> getClassRaw(String searchString, ClassStatus status, int staffId,
      Pageable pageable) {
    if (Objects.isNull(status)) {
      return classTvmsRepository.searchClassByStaff(searchString, staffId, pageable);
    }

    if (status == ClassStatus.NEW) {
      return classTvmsRepository.searchNewClassByStaff(searchString, staffId, pageable);
    }
    if (status == ClassStatus.ON_GOING) {
      return classTvmsRepository.searchOnGoingClassByStaff(searchString, staffId, pageable);
    }

    return classTvmsRepository.searchEndedClassByStaff(searchString, staffId, pageable);
  }

  @Override
  @Transactional(readOnly = true)
  public Page<ClassDTO> getClass(String requestId, String searchString, ClassStatus status,
      Integer staffId, Pageable pageable) {
    if (Objects.isNull(staffId)) {
      var classes = getClassRaw(searchString, status, pageable);
      return classes.map(classTvmsToDTOMapper::toDto);
    }
    return getClassRaw(searchString, status, staffId, pageable).map(classTvmsToDTOMapper::toDto);
  }

  @Override
  @Transactional
  public ClassDTO updateClass(String requestId, int classId, UpdateClassDTO updateClassDTO) {
    var classOptional = classTvmsRepository.findByIdAndIsDeleteFalse(classId);

    if (!classOptional.isPresent()) {
      var message = LogUtil.buildFormatLog(requestId,
          messageUtil.getMessage(MessageCode.MESSAGE_CLA_NOTFOUND, classId));
      log.error(message);
      throw new TveException(MessageCode.MESSAGE_CLA_NOTFOUND.getCode(), message);
    }

    var classEntity = classOptional.get();

    var staffOptional = staffRepository.findByIdAndIsDeleteFalse(updateClassDTO.getStaffId());

    if (!staffOptional.isPresent()) {
      var message = LogUtil.buildFormatLog(requestId,
          messageUtil.getMessage(MessageCode.MESSAGE_STAFF_NOT_FOUND, updateClassDTO.getStaffId()));
      log.error(message);
      throw new TveException(MessageCode.MESSAGE_STAFF_NOT_FOUND.getCode(), message);
    }

    classEntity.setStaff(staffOptional.get());

    var students =
        studentRepository.findNotIncludedStudents(updateClassDTO.getStudentIds(), classId);

    classEntity.getStudents().addAll(students);
    classTvmsRepository.save(classEntity);
    classEntity.setStartDate(updateClassDTO.getStartDate());
    classEntity.setName(updateClassDTO.getClassName());

    var schedules =
        scheduleRepository.findAllByIdInAndIsDeleteIsFalse(updateClassDTO.getScheduleIds());

    if (schedules.size() != updateClassDTO.getScheduleIds().size()) {
      var message = LogUtil.buildFormatLog(requestId, messageUtil
          .getMessage(MessageCode.MESSAGE_SCHE_NOT_FOUND, updateClassDTO.getScheduleIds()));
      log.error(message);
      throw new TveException(MessageCode.MESSAGE_SCHE_NOT_FOUND.getCode(), message);
    }

    classEntity.setSchedules(schedules);
    classDayService.generateClassDay(requestId, classEntity, false);
    List<Enrollment> enrollments = new ArrayList<>();
    List<Invoice> invoices = new ArrayList<>();
    students.forEach(student -> {
      Enrollment enrollment = Enrollment.builder().classTvms(classEntity)
          .course(classEntity.getCourse()).student(student).enrollmentDate(new Date()).build();
      Invoice invoice =
          Invoice.builder().enrollment(enrollment)
              .tuitionOwed(ObjectUtils.isEmpty(student.getDiscount())
                  ? enrollment.getCourse().getTuitionRate()
                  : enrollment.getCourse().getTuitionRate() - (student.getDiscount().getAmount()
                      * enrollment.getCourse().getTuitionRate()) / 100)
              .invoiceStatus(!ObjectUtils.isEmpty(student.getDiscount())
                  && student.getDiscount().getAmount() == 100 ? InvoiceStatus.FULLY_PAID
                  : InvoiceStatus.NOT_PAID)
              .build();
      invoices.add(invoice);
      enrollments.add(enrollment);
    });
    List<Integer> studentRemove = classEntity.getStudents().stream().map(Student::getId)
        .filter(id -> !updateClassDTO.getStudentIds().contains(id)).toList();
    if (!studentRemove.isEmpty()) {
      studentRepository.deleteStudentMappingClassByListId(studentRemove, classId);
      invoiceRepository.softDeleteInvoiceMappingByListStudent(studentRemove, classId);
      enrollmentRepository.softDeleteEnrollmentMappingByListStudent(studentRemove, classId);
      skillRepository.softDeleteSkillMappingByListStudent(studentRemove, classId);
      criteriaRepository.softDeleteCriteriaMappingByListStudent(studentRemove, classId);
      gradeRepository.softDeleteGradeMappingByListStudent(studentRemove, classId);
      absenceRepository.softDeleteAbsenceMappingByListStudent(studentRemove, classId);
    }

    enrollmentRepository.saveAll(enrollments);
    invoiceRepository.saveAll(invoices);
    classTvmsRepository.save(classEntity);

    return classTvmsToDTOMapper.toDto(classEntity);
  }

  /**
   * - xóa tất cả enrollment - xóa tất cả attendance - xóa tất cả grades - xóa tất cả schedules -
   * xóa tất cả invoice
   */
  @Override
  @Transactional
  public void deleteClass(String requestId, int classId) {
    var classOptional = classTvmsRepository.findByIdAndIsDeleteFalse(classId);

    if (!classOptional.isPresent()) {
      var message = LogUtil.buildFormatLog(requestId,
          messageUtil.getMessage(MessageCode.MESSAGE_CLA_NOTFOUND, classId));
      log.error(message);
      throw new TveException(MessageCode.MESSAGE_CLA_NOTFOUND.getCode(), message);
    }

    var classEntity = classOptional.get();

    classEntity.getSchedules().clear();
    classEntity.getClassDays().clear();
    classEntity.setIsDelete(true);
    classDayRepository.deleteAll(classEntity.getClassDays());

    classTvmsRepository.save(classEntity);

    invoiceRepository.deleteInvoiceMappingByClass(classId);
    enrollmentRepository.deleteEnrollmentMappingByClass(classId);
    gradeRepository.deleteGradeMappingByClass(classId);
    absenceRepository.deleteAbsenceMappingByClass(classId);
  }

  private String generateClassCode() {
    Optional<ClassTvms> latestStudentInDay =
        classTvmsRepository.findTop1ByCreatedAtBetweenOrderByCodeDesc(DateTimeUtil.startOfDay(),
            DateTimeUtil.endOfDay());

    if (latestStudentInDay.isPresent()) {
      String latestStudentCode = latestStudentInDay.get().getCode();
      Integer number =
          Integer.parseInt(latestStudentCode.substring(latestStudentCode.length() - 3));
      return StringUtil.generateCode("CLA", number + 1);
    } else {
      return StringUtil.generateCode("CLA", 1);
    }
  }

  @Override
  @Transactional(readOnly = true)
  public ClassDTO getClass(String requestId, String classCode) {
    var classOptional = classTvmsRepository.findByCodeAndIsDeleteFalse(classCode);

    if (!classOptional.isPresent()) {
      var message = LogUtil.buildFormatLog(requestId,
          messageUtil.getMessage(MessageCode.MESSAGE_CLA_NOTFOUND, classCode));
      log.error(message);
      throw new TveException(MessageCode.MESSAGE_CLA_NOTFOUND.getCode(), message);
    }

    return classTvmsToDTOMapper.toDto(classOptional.get());
  }

  @Override
  @Transactional(readOnly = true)
  public Integer getTotalClass(String requestId) {
    return classTvmsRepository.getTotalNumberOfClass();
  }
}
