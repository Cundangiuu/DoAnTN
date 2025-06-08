package vn.codezx.arise.services.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import vn.codezx.arise.constants.MessageCode;
import vn.codezx.arise.dtos.absence.AbsenceDTO;
import vn.codezx.arise.dtos.absence.AbsenceRequest;
import vn.codezx.arise.dtos.fileexport.DownloadDTO;
import vn.codezx.arise.entities.course.ClassDay;
import vn.codezx.arise.entities.course.ClassArise;
import vn.codezx.arise.entities.student.Absence;
import vn.codezx.arise.entities.student.Student;
import vn.codezx.arise.exceptions.AriseException;
import vn.codezx.arise.mappers.absence.AbsenceToDTOMapper;
import vn.codezx.arise.mappers.reports.AbsenceToAbsenceReportDTO;
import vn.codezx.arise.repositories.AbsenceRepository;
import vn.codezx.arise.repositories.ClassDayRepository;
import vn.codezx.arise.repositories.ClassAriseRepository;
import vn.codezx.arise.repositories.StudentRepository;
import vn.codezx.arise.services.AbsenceService;
import vn.codezx.arise.services.FileExportService;
import vn.codezx.arise.utils.MessageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

@Service
@Slf4j
public class AbsenceServiceImpl implements AbsenceService {

  private final AbsenceRepository absenceRepository;
  private final AbsenceToDTOMapper absenceToDTOMapper;

  private final StudentRepository studentRepository;


  private final ClassAriseRepository classAriseRepository;


  private final ClassDayRepository classDayRepository;

  private MessageUtil messageUtil;

  private final FileExportService fileExportService;
  private final AbsenceToAbsenceReportDTO absenceToAbsenceReportDTO;

  @Autowired
  public AbsenceServiceImpl(AbsenceToDTOMapper absenceToDTOMapper,
      FileExportService fileExportService,
      AbsenceToAbsenceReportDTO absenceToAbsenceReportDTO,
      AbsenceRepository absenceRepository, StudentRepository studentRepository,
      ClassAriseRepository classAriseRepository, ClassDayRepository classDayRepository,
      MessageUtil messageUtil) {
    this.absenceToAbsenceReportDTO = absenceToAbsenceReportDTO;
    this.fileExportService = fileExportService;
    this.messageUtil = messageUtil;
    this.absenceRepository = absenceRepository;
    this.absenceToDTOMapper = absenceToDTOMapper;
    this.studentRepository = studentRepository;
    this.classDayRepository = classDayRepository;
    this.classAriseRepository = classAriseRepository;
  }

  @Override
  @Transactional
  public AbsenceDTO markAbsence(String requestId, AbsenceRequest absenceRequest) {
    Optional<Student> student = studentRepository.findById(absenceRequest.getStudentId());
    if (student.isEmpty()) {
      throw new AriseException(requestId,
          messageUtil.getMessage(MessageCode.MESSAGE_STU_NOT_FOUND));
    }
    Optional<ClassArise> classArise = classAriseRepository.findByCodeAndIsDeleteFalse(
        absenceRequest.getClassCode());
    if (classArise.isEmpty()) {
      throw new AriseException(requestId,
          messageUtil.getMessage(MessageCode.MESSAGE_CLASS_DAY_NOT_FOUND));
    }

    Optional<ClassDay> classDay = classDayRepository.findById(absenceRequest.getClassDayId());
    if (classDay.isEmpty()) {
      throw new AriseException(requestId,
          messageUtil.getMessage(MessageCode.MESSAGE_CLASS_DAY_NOT_FOUND));
    }
    Optional<Absence> existingAbsence = absenceRepository.findByStudentAndClassAriseAndClassDayAndIsDeleteFalse(
        student.get(), classArise.get(), classDay.get());

    Absence absence;

    if (existingAbsence.isPresent()) {
      absence = existingAbsence.get();
      absence.setIsAbsent(absenceRequest.isCheckAbsent());
    } else {
      absence = Absence.builder()
          .student(student.get())
          .classArise(classArise.get())
          .classDay(classDay.get())
          .isAbsent(absenceRequest.isCheckAbsent())
          .build();
    }

    Absence savedAbsence = absenceRepository.save(absence);
    return absenceToDTOMapper.toDto(savedAbsence);
  }

  @Override
  @Transactional(readOnly = true)
  public List<AbsenceDTO> getAbsentGroup(String requestId) {
    return absenceToDTOMapper.toListDto(absenceRepository.findAll());
  }

  @Override
  @Transactional(readOnly = true)
  public List<AbsenceDTO> getAbsenceByClass(String requestId, String classCode) {
    Optional<List<Absence>> absenceList = absenceRepository.getListAbsenceByClassCode(classCode);
    if (absenceList.isEmpty()) {
      throw new AriseException(MessageCode.MESSAGE_ABS_NOTFOUND,
          messageUtil.getMessage(MessageCode.MESSAGE_ABS_NOTFOUND));
    }
    return absenceToDTOMapper.toListDto(absenceList.get());
  }

  @Override
  @Transactional(readOnly = true)
  public List<AbsenceDTO> getStudentAbsence(String requestId, String studentCode) {
    Student student = studentRepository.findByCodeAndIsDeleteFalse(studentCode);
    if (ObjectUtils.isEmpty(student)) {
      throw new AriseException(requestId, messageUtil.getMessage(MessageCode.MESSAGE_STU_NOT_FOUND));
    }

    List<Absence> absenceList = absenceRepository.findByStudentAndIsDeleteFalseOrderByCreatedAtDesc(student);

    return absenceToDTOMapper.toListDto(absenceList);
  }

  @Override
  @Transactional(readOnly = true)
  public DownloadDTO absenceDayReport(String requestId, Date from, Date to) {
    var absence = absenceRepository.findAbsentStudentInRange(from, to);
    if (absence == null || absence.isEmpty()) {
      absence = new ArrayList<>();
    }
    return fileExportService.exportXLSX(requestId, absenceToAbsenceReportDTO.toListDto(absence),
        "student_absence");
  }
}

