package vn.codezx.arise.services.impl;

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
import vn.codezx.arise.constants.ClassStatus;
import vn.codezx.arise.constants.InvoiceStatus;
import vn.codezx.arise.constants.MessageCode;
import vn.codezx.arise.dtos.classArise.ClassDTO;
import vn.codezx.arise.dtos.classArise.CreateClassDTO;
import vn.codezx.arise.dtos.classArise.UpdateClassDTO;
import vn.codezx.arise.entities.course.ClassArise;
import vn.codezx.arise.entities.reporting.Enrollment;
import vn.codezx.arise.entities.reporting.Invoice;
import vn.codezx.arise.entities.student.Student;
import vn.codezx.arise.exceptions.AriseException;
import vn.codezx.arise.mappers.classArise.ClassAriseToDTOMapper;
import vn.codezx.arise.repositories.AbsenceRepository;
import vn.codezx.arise.repositories.ClassDayRepository;
import vn.codezx.arise.repositories.ClassAriseRepository;
import vn.codezx.arise.repositories.CourseRepository;
import vn.codezx.arise.repositories.CriteriaRepository;
import vn.codezx.arise.repositories.EnrollmentRepository;
import vn.codezx.arise.repositories.GradeRepository;
import vn.codezx.arise.repositories.InvoiceRepository;
import vn.codezx.arise.repositories.ScheduleRepository;
import vn.codezx.arise.repositories.SkillRepository;
import vn.codezx.arise.repositories.StaffRepository;
import vn.codezx.arise.repositories.StudentRepository;
import vn.codezx.arise.services.ClassDayService;
import vn.codezx.arise.services.ClassAriseService;
import vn.codezx.arise.utils.DateTimeUtil;
import vn.codezx.arise.utils.LogUtil;
import vn.codezx.arise.utils.MessageUtil;
import vn.codezx.arise.utils.StringUtil;

@Service
@Slf4j
@RequiredArgsConstructor
public class ClassAriseServiceImpl implements ClassAriseService {

  private final ClassAriseToDTOMapper classAriseToDTOMapper;
  private final CourseRepository courseRepository;
  private final ScheduleRepository scheduleRepository;
  private final ClassAriseRepository classAriseRepository;
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
      throw new AriseException(MessageCode.MESSAGE_SCHE_NOT_FOUND.getCode(), message);
    }

    var courseOptional = courseRepository.findById(classRequest.getCourseId());

    if (!courseOptional.isPresent()) {
      var message = LogUtil.buildFormatLog(requestId,
          messageUtil.getMessage(MessageCode.MESSAGE_NOT_FOUND, classRequest.getCourseId()));
      log.error(message);
      throw new AriseException(MessageCode.MESSAGE_NOT_FOUND.getCode(), message);
    }

    var staffOptional = staffRepository.findByIdAndIsDeleteFalse(classRequest.getStaffId());

    if (!staffOptional.isPresent()) {
      var message = LogUtil.buildFormatLog(requestId,
          messageUtil.getMessage(MessageCode.MESSAGE_STAFF_NOT_FOUND, classRequest.getStaffId()));
      log.error(message);
      throw new AriseException(MessageCode.MESSAGE_STAFF_NOT_FOUND.getCode(), message);
    }

    var classOptional = classAriseRepository.findByNameAndIsDeleteFalse(classRequest.getClassName());

    if (classOptional.isPresent()) {
      var message = LogUtil.buildFormatLog(requestId, messageUtil
          .getMessage(MessageCode.MESSAGE_CLA_NAME_DULICATED, classRequest.getCourseId()));
      log.error(message);
      throw new AriseException(MessageCode.MESSAGE_CLA_NAME_DULICATED.getCode(), message);
    }
    var course = courseOptional.get();

    var students = studentRepository.findAllByIdInAndIsDeleteIsFalse(classRequest.getStudentIds());
    if (students.size() != classRequest.getStudentIds().size()) {
      var message = LogUtil.buildFormatLog(requestId,
          messageUtil.getMessage(MessageCode.MESSAGE_STU_NOT_FOUND, classRequest.getStudentIds()));
      log.error(message);
      throw new AriseException(MessageCode.MESSAGE_STU_NOT_FOUND.getCode(), message);
    }
    var classArise = classAriseRepository.saveAndFlush(ClassArise.builder().staff(staffOptional.get())
        .name(classRequest.getClassName()).code(generateClassCode()).course(course)
        .schedules(schedules).students(students).startDate(classRequest.getStartDate()).build());

    List<Integer> studentIds = students.stream().map(Student::getId).collect(Collectors.toList());
    List<Enrollment> enrollments =
        enrollmentRepository.findEnrollmentByCourseId(classRequest.getCourseId(), studentIds);
    List<Invoice> invoices = new ArrayList<>();
    if (ObjectUtils.isEmpty(enrollments)) {
      List<Enrollment> newEnrollment = new ArrayList<>();
      students.forEach(student -> {
        Enrollment enrollment = Enrollment.builder().classArise(classArise).course(course)
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
        enrollment.setClassArise(classArise);
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
    classDayService.generateClassDay(requestId, classArise, false);
    return classAriseToDTOMapper.toDto(classArise);
  }

  @Override
  @Transactional(readOnly = true)
  public ClassDTO getClass(String requestId, int classId) {
    var classOptional = classAriseRepository.findByIdAndIsDeleteFalse(classId);

    if (!classOptional.isPresent()) {
      var message = LogUtil.buildFormatLog(requestId,
          messageUtil.getMessage(MessageCode.MESSAGE_CLA_NOTFOUND, classId));
      log.error(message);
      throw new AriseException(MessageCode.MESSAGE_CLA_NOTFOUND.getCode(), message);
    }

    return classAriseToDTOMapper.toDto(classOptional.get());
  }

  private Page<ClassArise> getClassRaw(String searchString, ClassStatus status, Pageable pageable) {
    if (Objects.isNull(status)) {
      return classAriseRepository.searchClass(searchString, pageable);
    }

    if (status == ClassStatus.NEW) {
      return classAriseRepository.searchNewClass(searchString, pageable);
    }
    if (status == ClassStatus.ON_GOING) {
      return classAriseRepository.searchOnGoingClass(searchString, pageable);
    }

    return classAriseRepository.searchEndedClass(searchString, pageable);
  }

  private Page<ClassArise> getClassRaw(String searchString, ClassStatus status, int staffId,
      Pageable pageable) {
    if (Objects.isNull(status)) {
      return classAriseRepository.searchClassByStaff(searchString, staffId, pageable);
    }

    if (status == ClassStatus.NEW) {
      return classAriseRepository.searchNewClassByStaff(searchString, staffId, pageable);
    }
    if (status == ClassStatus.ON_GOING) {
      return classAriseRepository.searchOnGoingClassByStaff(searchString, staffId, pageable);
    }

    return classAriseRepository.searchEndedClassByStaff(searchString, staffId, pageable);
  }

  @Override
  @Transactional(readOnly = true)
  public Page<ClassDTO> getClass(String requestId, String searchString, ClassStatus status,
      Integer staffId, Pageable pageable) {
    if (Objects.isNull(staffId)) {
      var classes = getClassRaw(searchString, status, pageable);
      return classes.map(classAriseToDTOMapper::toDto);
    }
    return getClassRaw(searchString, status, staffId, pageable).map(classAriseToDTOMapper::toDto);
  }

  @Override
  @Transactional
  public ClassDTO updateClass(String requestId, int classId, UpdateClassDTO updateClassDTO) {
    var classOptional = classAriseRepository.findByIdAndIsDeleteFalse(classId);

    if (!classOptional.isPresent()) {
      var message = LogUtil.buildFormatLog(requestId,
          messageUtil.getMessage(MessageCode.MESSAGE_CLA_NOTFOUND, classId));
      log.error(message);
      throw new AriseException(MessageCode.MESSAGE_CLA_NOTFOUND.getCode(), message);
    }

    var classEntity = classOptional.get();

    var staffOptional = staffRepository.findByIdAndIsDeleteFalse(updateClassDTO.getStaffId());

    if (!staffOptional.isPresent()) {
      var message = LogUtil.buildFormatLog(requestId,
          messageUtil.getMessage(MessageCode.MESSAGE_STAFF_NOT_FOUND, updateClassDTO.getStaffId()));
      log.error(message);
      throw new AriseException(MessageCode.MESSAGE_STAFF_NOT_FOUND.getCode(), message);
    }

    classEntity.setStaff(staffOptional.get());

    var students =
        studentRepository.findNotIncludedStudents(updateClassDTO.getStudentIds(), classId);

    classEntity.getStudents().addAll(students);
    classAriseRepository.save(classEntity);
    classEntity.setStartDate(updateClassDTO.getStartDate());
    classEntity.setName(updateClassDTO.getClassName());

    var schedules =
        scheduleRepository.findAllByIdInAndIsDeleteIsFalse(updateClassDTO.getScheduleIds());

    if (schedules.size() != updateClassDTO.getScheduleIds().size()) {
      var message = LogUtil.buildFormatLog(requestId, messageUtil
          .getMessage(MessageCode.MESSAGE_SCHE_NOT_FOUND, updateClassDTO.getScheduleIds()));
      log.error(message);
      throw new AriseException(MessageCode.MESSAGE_SCHE_NOT_FOUND.getCode(), message);
    }

    classEntity.setSchedules(schedules);
    classDayService.generateClassDay(requestId, classEntity, false);
    List<Enrollment> enrollments = new ArrayList<>();
    List<Invoice> invoices = new ArrayList<>();
    students.forEach(student -> {
      Enrollment enrollment = Enrollment.builder().classArise(classEntity)
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
    classAriseRepository.save(classEntity);

    return classAriseToDTOMapper.toDto(classEntity);
  }

  /**
   * - xóa tất cả enrollment - xóa tất cả attendance - xóa tất cả grades - xóa tất cả schedules -
   * xóa tất cả invoice
   */
  @Override
  @Transactional
  public void deleteClass(String requestId, int classId) {
    var classOptional = classAriseRepository.findByIdAndIsDeleteFalse(classId);

    if (!classOptional.isPresent()) {
      var message = LogUtil.buildFormatLog(requestId,
          messageUtil.getMessage(MessageCode.MESSAGE_CLA_NOTFOUND, classId));
      log.error(message);
      throw new AriseException(MessageCode.MESSAGE_CLA_NOTFOUND.getCode(), message);
    }

    var classEntity = classOptional.get();

    classEntity.getSchedules().clear();
    classEntity.getClassDays().clear();
    classEntity.setIsDelete(true);
    classDayRepository.deleteAll(classEntity.getClassDays());

    classAriseRepository.save(classEntity);

    invoiceRepository.deleteInvoiceMappingByClass(classId);
    enrollmentRepository.deleteEnrollmentMappingByClass(classId);
    gradeRepository.deleteGradeMappingByClass(classId);
    absenceRepository.deleteAbsenceMappingByClass(classId);
  }

  private String generateClassCode() {
    Optional<ClassArise> latestStudentInDay =
        classAriseRepository.findTop1ByCreatedAtBetweenOrderByCodeDesc(DateTimeUtil.startOfDay(),
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
    var classOptional = classAriseRepository.findByCodeAndIsDeleteFalse(classCode);

    if (!classOptional.isPresent()) {
      var message = LogUtil.buildFormatLog(requestId,
          messageUtil.getMessage(MessageCode.MESSAGE_CLA_NOTFOUND, classCode));
      log.error(message);
      throw new AriseException(MessageCode.MESSAGE_CLA_NOTFOUND.getCode(), message);
    }

    return classAriseToDTOMapper.toDto(classOptional.get());
  }

  @Override
  @Transactional(readOnly = true)
  public Integer getTotalClass(String requestId) {
    return classAriseRepository.getTotalNumberOfClass();
  }
}
