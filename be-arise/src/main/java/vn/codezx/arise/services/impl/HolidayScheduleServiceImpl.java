package vn.codezx.arise.services.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.codezx.arise.constants.MessageCode;
import vn.codezx.arise.dtos.holiday_schedule.HolidayScheduleDTO;
import vn.codezx.arise.dtos.holiday_schedule.HolidayScheduleRequest;
import vn.codezx.arise.entities.setting.HolidaySchedule;
import vn.codezx.arise.exceptions.AriseException;
import vn.codezx.arise.mappers.setting.HolidayScheduleToDTOMapper;
import vn.codezx.arise.repositories.ClassAriseRepository;
import vn.codezx.arise.repositories.HolidayScheduleRepository;
import vn.codezx.arise.services.ClassDayService;
import vn.codezx.arise.services.HolidayScheduleService;
import vn.codezx.arise.utils.LogUtil;
import vn.codezx.arise.utils.MessageUtil;

@Service
@Slf4j
@RequiredArgsConstructor
public class HolidayScheduleServiceImpl implements HolidayScheduleService {

    private final HolidayScheduleRepository holidayScheduleRepository;
    private final HolidayScheduleToDTOMapper holidayScheduleMapper;
    private final MessageUtil messageUtil;
    private final ClassAriseRepository classAriseRepository;
    private final ClassDayService classDayService;

    @Override
    @Transactional
    public HolidayScheduleDTO createHolidaySchedule(String requestId,
            HolidayScheduleRequest holidayScheduleRequest) {
        HolidaySchedule holidaySchedule =
                HolidaySchedule.builder().holidayType(holidayScheduleRequest.getHolidayType())
                        .startDate(holidayScheduleRequest.getStartDate())
                        .endDate(holidayScheduleRequest.getEndDate())
                        .description(holidayScheduleRequest.getDescription()).build();
        holidaySchedule = holidayScheduleRepository.save(holidaySchedule);
        updateClassDay(requestId);
        return holidayScheduleMapper.toDto(holidaySchedule);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<HolidayScheduleDTO> getHolidaySchedules(String requestId, Pageable pageable) {
        return holidayScheduleRepository.findAllByIsDeleteIsFalse(pageable)
                .map(holidayScheduleMapper::toDto);
    }

    @Override
    public HolidayScheduleDTO getHolidaySchedule(String requestId, Integer holidayScheduleId) {
        return holidayScheduleMapper.toDto(findHolidayScheduleById(holidayScheduleId, requestId));
    }

    @Override
    @Transactional()
    public HolidayScheduleDTO updateHolidaySchedule(String requestId, Integer holidayScheduleId,
            HolidayScheduleRequest holidayScheduleRequest) {
        HolidaySchedule holidaySchedule = findHolidayScheduleById(holidayScheduleId, requestId);

        if (holidayScheduleRequest.getStartDate() != null) {
            holidaySchedule.setStartDate(holidayScheduleRequest.getStartDate());
        }

        if (holidayScheduleRequest.getEndDate() != null) {
            holidaySchedule.setEndDate(holidayScheduleRequest.getEndDate());
        }

        if (holidayScheduleRequest.getDescription() != null) {
            holidaySchedule.setDescription(holidayScheduleRequest.getDescription());
        }

        if (holidayScheduleRequest.getHolidayType() != null) {
            holidaySchedule.setHolidayType(holidayScheduleRequest.getHolidayType());
        }
        updateClassDay(requestId);
        return holidayScheduleMapper.toDto(holidaySchedule);
    }

    @Override
    @Transactional
    public HolidayScheduleDTO deleteHolidaySchedule(String requestId, Integer holidayScheduleId) {
        HolidaySchedule holidaySchedule = findHolidayScheduleById(holidayScheduleId, requestId);
        holidaySchedule.setIsDelete(true);
        updateClassDay(requestId);
        return holidayScheduleMapper.toDto(holidaySchedule);
    }

    private HolidaySchedule findHolidayScheduleById(Integer holidayScheduleId, String requestId) {
        return holidayScheduleRepository.findByIdAndIsDeleteIsFalse(holidayScheduleId)
                .orElseThrow(() -> {
                    log.error(LogUtil.buildFormatLog(requestId, messageUtil
                            .getMessage(MessageCode.MESSAGE_HOLI_NOT_FOUND, holidayScheduleId)));
                    return new AriseException(MessageCode.MESSAGE_HOLI_NOT_FOUND, messageUtil
                            .getMessage(MessageCode.MESSAGE_HOLI_NOT_FOUND, holidayScheduleId));
                });
    }

    private void updateClassDay(String requestId) {
        var classes = classAriseRepository.findAllByIsDeleteFalse();

        for (int i = 0; i < classes.size(); i++) {
            classDayService.generateClassDay(requestId, classes.get(i), true);
        }
    }
}
