package vn.codezx.triviet.services.impl;

import java.text.SimpleDateFormat;
import java.time.DayOfWeek;
import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;
import vn.codezx.triviet.constants.MessageCode;
import vn.codezx.triviet.dtos.schedule.ScheduleDTO;
import vn.codezx.triviet.dtos.schedule.ScheduleRequest;
import vn.codezx.triviet.entities.setting.Schedule;
import vn.codezx.triviet.exceptions.TveException;
import vn.codezx.triviet.mappers.setting.ScheduleToDTOMapper;
import vn.codezx.triviet.repositories.ScheduleRepository;
import vn.codezx.triviet.services.ScheduleService;
import vn.codezx.triviet.utils.LogUtil;
import vn.codezx.triviet.utils.MessageUtil;

@Service
@Slf4j
public class ScheduleServiceImpl implements ScheduleService {

  private final ScheduleRepository scheduleRepository;
  private final ScheduleToDTOMapper scheduleToDTOMapper;
  private final MessageUtil messageUtil;

  @Autowired
  public ScheduleServiceImpl(ScheduleRepository scheduleRepository,
      ScheduleToDTOMapper classScheduleToDTOMapper, MessageUtil messageUtil) {
    this.scheduleRepository = scheduleRepository;
    this.scheduleToDTOMapper = classScheduleToDTOMapper;
    this.messageUtil = messageUtil;
  }

  @Override
  @Transactional
  public ScheduleDTO createSchedule(String requestId, ScheduleRequest scheduleRequest) {

    Schedule schedule =
        Schedule.builder().startTime(scheduleRequest.getStartTime())
            .endTime(scheduleRequest.getEndTime())
            .dayOfWeek(DayOfWeek.valueOf(scheduleRequest.getDayOfWeek()))
            .code(generateScheduleCode(scheduleRequest.getDayOfWeek(),
                scheduleRequest.getStartTime(), scheduleRequest.getEndTime()))
            .description(scheduleRequest.getDescription()).build();
    schedule = scheduleRepository.saveAndFlush(schedule);
    log.info(LogUtil.buildFormatLog(requestId,
        messageUtil.getMessage(MessageCode.MESSAGE_SCHE_CREATE_SUCCESS)));

    return scheduleToDTOMapper.toDto(schedule);
  }

  @Override
  @Transactional(readOnly = true)
  public Page<ScheduleDTO> getSchedules(String requestId, Pageable pageable) {
    return scheduleRepository.findAllByIsDeleteIsFalse(pageable).map(scheduleToDTOMapper::toDto);
  }

  @Override
  @Transactional(readOnly = true)
  public ScheduleDTO getSchedule(String requestId, Integer scheduleId) {
    Schedule schedule = findScheduleById(scheduleId, requestId);

    log.info(LogUtil.buildFormatLog(requestId,
        messageUtil.getMessage(MessageCode.MESSAGE_SCHE_GET_SUCCESS, scheduleId)));

    return scheduleToDTOMapper.toDto(schedule);
  }

  @Override
  @Transactional()
  public ScheduleDTO updateSchedule(String requestId, Integer scheduleId,
      ScheduleRequest scheduleRequest) {
    Schedule schedule = findScheduleById(scheduleId, requestId);

    if (scheduleRequest.getDescription() != null)
      schedule.setDescription(scheduleRequest.getDescription());

    if (scheduleRequest.getStartTime() != null)
      schedule.setStartTime(scheduleRequest.getStartTime());

    if (scheduleRequest.getEndTime() != null)
      schedule.setEndTime(scheduleRequest.getEndTime());

    if (scheduleRequest.getDayOfWeek() != null)
      schedule.setDayOfWeek(DayOfWeek.valueOf(scheduleRequest.getDayOfWeek()));

    schedule.setCode(generateScheduleCode(schedule.getDayOfWeek().name(), schedule.getStartTime(),
        schedule.getEndTime()));

    log.info(LogUtil.buildFormatLog(requestId,
        messageUtil.getMessage(MessageCode.MESSAGE_SCHE_UPDATE_SUCCESS, scheduleId)));

    return scheduleToDTOMapper.toDto(schedule);
  }

  @Override
  @Transactional
  public ScheduleDTO deleteSchedule(String requestId, Integer scheduleId) {
    Schedule schedule = findScheduleById(scheduleId, requestId);

    schedule.setIsDelete(true);
    log.info(LogUtil.buildFormatLog(requestId,
        messageUtil.getMessage(MessageCode.MESSAGE_DIS_DELETE_SUCCESS, scheduleId)));

    return scheduleToDTOMapper.toDto(schedule);
  }


  private String generateScheduleCode(String dayOfWeek, Date startTime, Date endTime) {
    String day = dayOfWeek.substring(0, 2);

    // Define a SimpleDateFormat for time formatting
    SimpleDateFormat timeFormatter = new SimpleDateFormat("HHmm"); // Adjust pattern if needed

    // Format the start and end times
    String startTimeFormat = timeFormatter.format(startTime);
    String endTimeFormat = timeFormatter.format(endTime);

    return day + "-" + startTimeFormat + "-" + endTimeFormat;
  }


  private Schedule findScheduleById(Integer scheduleId, String requestId) {
    return scheduleRepository.findByIdAndIsDeleteIsFalse(scheduleId).orElseThrow(() -> {
      log.error(LogUtil.buildFormatLog(requestId,
          messageUtil.getMessage(MessageCode.MESSAGE_SCHE_NOT_FOUND, scheduleId)));
      return new TveException(MessageCode.MESSAGE_NOT_FOUND,
          messageUtil.getMessage(MessageCode.MESSAGE_SCHE_NOT_FOUND, scheduleId));
    });
  }
}
