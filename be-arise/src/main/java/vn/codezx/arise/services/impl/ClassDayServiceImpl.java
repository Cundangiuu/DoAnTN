package vn.codezx.arise.services.impl;

import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import vn.codezx.arise.constants.MessageCode;
import vn.codezx.arise.constants.TypeOfTest;
import vn.codezx.arise.dtos.classDay.ClassDayDTO;
import vn.codezx.arise.dtos.classDay.ClassDayRequest;
import vn.codezx.arise.dtos.classDay.UpdateClassDayDTO;
import vn.codezx.arise.dtos.fileexport.DownloadDTO;
import vn.codezx.arise.entities.course.ClassDay;
import vn.codezx.arise.entities.course.ClassArise;
import vn.codezx.arise.entities.setting.HolidaySchedule;
import vn.codezx.arise.entities.setting.Location;
import vn.codezx.arise.entities.setting.Schedule;
import vn.codezx.arise.entities.staff.Staff;
import vn.codezx.arise.exceptions.AriseException;
import vn.codezx.arise.mappers.ClassDay.ClassDayToDTOMapper;
import vn.codezx.arise.mappers.reports.ClassDayToTestDayReportDTO;
import vn.codezx.arise.repositories.ClassDayRepository;
import vn.codezx.arise.repositories.HolidayScheduleRepository;
import vn.codezx.arise.repositories.LocationRepository;
import vn.codezx.arise.repositories.ScheduleRepository;
import vn.codezx.arise.repositories.StaffRepository;
import vn.codezx.arise.services.ClassDayService;
import vn.codezx.arise.services.FileExportService;
import vn.codezx.arise.utils.LogUtil;
import vn.codezx.arise.utils.MessageUtil;

@Builder
@Getter
@Setter
class GeneratedClassDay {
  Date classDate;
  Schedule schedule;
}


@Service
@Slf4j
@RequiredArgsConstructor
public class ClassDayServiceImpl implements ClassDayService {

  private final ClassDayRepository classDayRepository;
  private final ClassDayToDTOMapper classDayToDTOMapper;
  private final MessageUtil messageUtil;
  private final HolidayScheduleRepository holidayScheduleRepository;
  private final StaffRepository staffRepository;
  private final LocationRepository locationRepository;
  private final ScheduleRepository scheduleRepository;
  private final FileExportService fileExportService;
  private final ClassDayToTestDayReportDTO classDayToTestDayReportDTO;

  @Override
  public ClassDayDTO getClassDayById(String requestId, Integer classDayId) {
    Optional<ClassDay> classDay = classDayRepository.findById(classDayId);
    if (classDay.isEmpty()) {
      throw new AriseException(requestId,
          messageUtil.getMessage(MessageCode.MESSAGE_CLASS_DAY_NOT_FOUND));
    }
    return classDayToDTOMapper.toDto(classDay.get());
  }

  @Override
  @Transactional
  public ClassDayDTO updateClassDayById(String requestId, Integer classDayId,
      ClassDayRequest classDayRequest) {
    Optional<ClassDay> classDay = classDayRepository.findById(classDayId);
    if (classDay.isEmpty()) {
      throw new AriseException(requestId,
          messageUtil.getMessage(MessageCode.MESSAGE_CLASS_DAY_NOT_FOUND));
    }
    ClassDay entity = classDay.get();
    if (classDayRequest.getComment() != null) {
      entity.setComment(classDayRequest.getComment());
    }
    if (classDayRequest.getHomework() != null) {
      entity.setHomeWork(classDayRequest.getHomework());
    }
    if (classDayRequest.getRating() != null) {
      entity.setRating(classDayRequest.getRating());
    }

    classDayRepository.save(entity);

    return classDayToDTOMapper.toDto(entity);
  }

  @Override
  @Transactional
  public List<ClassDayDTO> generateClassDay(String requestId, ClassArise classArise,
      boolean withOutRecent) {
    var holidays = holidayScheduleRepository.findByOverLappingDays(classArise.getStartDate());

    var classDays = generateDates(classArise.getStartDate(), classArise.getSchedules(),
        classArise.getCourse().getLessons().size(), holidays);

    var days = classArise.getClassDays();
    var lessons = classArise.getCourse().getLessons();

    for (int i = 0; i < lessons.size(); i++) {
      ClassDay classDay = new ClassDay();
      if (i < days.size()) {
        classDay = days.get(i);
      }
      if (i >= days.size()) {
        days.add(classDay);
      }

      classDay.setLesson(lessons.get(i));
      var day = classDays.get(i).getClassDate();

      classDay.setSchedule(classDays.get(i).getSchedule());
      classDay.setClassArise(classArise);

      if ((!withOutRecent && day.getTime() <= new Date().getTime())
          || day.getTime() >= new Date().getTime()) {
        classDay.setClassDate(day);
      }
    }

    return classDayToDTOMapper.toListDto(classDayRepository.saveAll(days));
  }

  public List<GeneratedClassDay> generateDates(Date startDate, List<Schedule> schedules, int amount,
      List<HolidaySchedule> holidays) {
    var result = new ArrayList<GeneratedClassDay>();
    Calendar calendar = Calendar.getInstance();
    calendar.setTime(startDate);
    schedules = new ArrayList<>(schedules); // Ensure mutability
    schedules.sort(Comparator.comparing(s -> (s).getDayOfWeek().getValue()));

    while (result.size() < amount) {
      DayOfWeek currentDayOfWeek = getDOW(calendar);
      var matchedSchedule =
          schedules.stream().filter(s -> s.getDayOfWeek().equals(currentDayOfWeek)).findFirst();
      if (matchedSchedule.isEmpty()
          || holidays.stream().anyMatch(h -> h.isWithinHoliday(calendar.getTime()))) {
        calendar.add(Calendar.DATE, 1);
        continue;
      }

      result.add(GeneratedClassDay.builder().classDate(calendar.getTime())
          .schedule(matchedSchedule.get()).build());
      calendar.add(Calendar.DATE, 1);
    }

    return result;
  }

  private DayOfWeek getDOW(Calendar calendar) {
    int currentDayValue = calendar.get(Calendar.DAY_OF_WEEK);
    return DayOfWeek.of((currentDayValue == 1) ? 7 : currentDayValue - 1);
  }

  private int getDOW(Date date) {
    Calendar cal = Calendar.getInstance();
    cal.setTime(date);
    var dowRaw = cal.get(Calendar.DAY_OF_WEEK) - 1;
    if (dowRaw == 0) {
      dowRaw = 7;
    }
    return dowRaw;
  }

  @Override
  @Transactional
  public ClassDayDTO updateClassDay(String requestId, UpdateClassDayDTO updateClassDayDTO) {
    Staff teacher = null;
    Location location = null;
    Schedule schedule = null;

    if (!Objects.isNull(updateClassDayDTO.getLocationId())) {
      var optional =
          locationRepository.findByIdAndIsDeleteIsFalse(updateClassDayDTO.getLocationId());

      if (!optional.isPresent()) {
        var message = LogUtil.buildFormatLog(requestId, messageUtil
            .getMessage(MessageCode.MESSAGE_LOC_NOT_FOUND, updateClassDayDTO.getLocationId()));
        log.error(message);
        throw new AriseException(MessageCode.MESSAGE_LOC_NOT_FOUND.getCode(), message);
      }
      location = optional.get();
    }

    if (!Objects.isNull(updateClassDayDTO.getTeacherId())) {
      var optional = staffRepository.findByIdAndIsDeleteFalse(updateClassDayDTO.getTeacherId());

      if (!optional.isPresent()) {
        var message = LogUtil.buildFormatLog(requestId, messageUtil
            .getMessage(MessageCode.MESSAGE_STAFF_NOT_FOUND, updateClassDayDTO.getTeacherId()));
        log.error(message);
        throw new AriseException(MessageCode.MESSAGE_STAFF_NOT_FOUND.getCode(), message);
      }
      teacher = optional.get();
    }

    if (!Objects.isNull(updateClassDayDTO.getScheduleId())) {
      var optional =
          scheduleRepository.findByIdAndIsDeleteIsFalse(updateClassDayDTO.getScheduleId());

      if (!optional.isPresent()) {
        var message = LogUtil.buildFormatLog(requestId, messageUtil
            .getMessage(MessageCode.MESSAGE_SCHE_NOT_FOUND, updateClassDayDTO.getScheduleId()));
        log.error(message);
        throw new AriseException(MessageCode.MESSAGE_SCHE_NOT_FOUND.getCode(), message);
      }
      schedule = optional.get();
    }

    var optional = classDayRepository.findByIdAndIsDeleteIsFalse(updateClassDayDTO.getId());

    if (!optional.isPresent()) {
      var message = LogUtil.buildFormatLog(requestId, messageUtil
          .getMessage(MessageCode.MESSAGE_CLASS_DAY_NOT_FOUND, updateClassDayDTO.getLocationId()));
      log.error(message);
      throw new AriseException(MessageCode.MESSAGE_CLASS_DAY_NOT_FOUND.getCode(), message);
    }
    var classDay = optional.get();

    if (!Objects.isNull(location)) {
      classDay.setLocation(location);
    }

    if (!Objects.isNull(teacher)) {
      classDay.setTeacher(teacher);
    }

    if (!Objects.isNull(schedule)) {
      if (Objects.isNull(updateClassDayDTO.getClassDate())) {
        var message = LogUtil.buildFormatLog(requestId, messageUtil
            .getMessage(MessageCode.MESSAGE_ERROR_INPUT_ERROR, updateClassDayDTO.getLocationId()));
        log.error(message);
        throw new AriseException(MessageCode.MESSAGE_ERROR_INPUT_ERROR.getCode(), message);
      }

      var dow = getDOW(updateClassDayDTO.getClassDate());

      if (dow != schedule.getDayOfWeek().getValue()) {
        var message = LogUtil.buildFormatLog(requestId, messageUtil
            .getMessage(MessageCode.MESSAGE_ERROR_INPUT_ERROR, updateClassDayDTO.getLocationId()));
        log.error(message);
        throw new AriseException(MessageCode.MESSAGE_ERROR_INPUT_ERROR.getCode(), message);
      }

      classDay.setSchedule(schedule);
    }

    classDay.setClassDate(updateClassDayDTO.getClassDate());
    classDayRepository.save(classDay);

    return classDayToDTOMapper.toDto(classDayRepository.save(classDay));
  }

  @Override
  @Transactional(readOnly = true)
  public DownloadDTO testDayReport(String requestId, Date from, Date to) {
    var days = classDayRepository.findTestDaysInRange(from, to,
        Arrays.asList(TypeOfTest.MIDTERM, TypeOfTest.FINAL));

    return fileExportService.exportXLSX(requestId, classDayToTestDayReportDTO.toListDto(days),
        "test_days");
  }
}
