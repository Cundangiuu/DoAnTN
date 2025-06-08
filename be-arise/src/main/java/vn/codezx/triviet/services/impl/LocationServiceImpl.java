package vn.codezx.triviet.services.impl;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;
import vn.codezx.triviet.constants.MessageCode;
import vn.codezx.triviet.dtos.location.LocationDTO;
import vn.codezx.triviet.dtos.location.LocationRequest;
import vn.codezx.triviet.entities.setting.Location;
import vn.codezx.triviet.entities.setting.Schedule;
import vn.codezx.triviet.exceptions.TveException;
import vn.codezx.triviet.mappers.setting.LocationToDTOMapper;
import vn.codezx.triviet.repositories.LocationRepository;
import vn.codezx.triviet.repositories.ScheduleRepository;
import vn.codezx.triviet.services.LocationService;
import vn.codezx.triviet.utils.LogUtil;
import vn.codezx.triviet.utils.MessageUtil;

@Service
@Slf4j
public class LocationServiceImpl implements LocationService {
  private final LocationRepository locationRepository;
  private final MessageUtil messageUtil;
  private final LocationToDTOMapper locationToDTOMapper;
  private final ScheduleRepository scheduleRepository;

  @Autowired
  LocationServiceImpl(LocationRepository locationRepository, MessageUtil messageUtil,
      LocationToDTOMapper locationToDTOMapper, ScheduleRepository scheduleRepository) {
    this.locationRepository = locationRepository;
    this.messageUtil = messageUtil;
    this.locationToDTOMapper = locationToDTOMapper;
    this.scheduleRepository = scheduleRepository;
  }

  @Override
  @Transactional
  public LocationDTO createLocation(String requestId, LocationRequest locationRequest) {
    Location location;

    try {
      location = Location.builder()
          .code(generateLocationCode(locationRequest.getBranch(), locationRequest.getRoom()))
          .branch(locationRequest.getBranch()).room(locationRequest.getRoom()).build();

      location = locationRepository.saveAndFlush(location);

      List<Schedule> schedules = scheduleRepository.findAllById(locationRequest.getScheduleIds());

      location.getSchedules().addAll(schedules);

      locationRepository.saveAndFlush(location);

      log.info(LogUtil.buildFormatLog(requestId,
          messageUtil.getMessage(MessageCode.MESSAGE_LOC_CREATE_SUCCESS)));
    } catch (Exception e) {
      String errMessage = messageUtil.getMessage(MessageCode.MESSAGE_LOC_CREATE_ERROR);
      log.error(LogUtil.buildFormatLog(requestId, errMessage), e);
      throw new TveException(MessageCode.MESSAGE_ERROR_SYSTEM_ERROR, errMessage, requestId);
    }

    return locationToDTOMapper.toDto(location);
  }

  @Override
  @Transactional(readOnly = true)
  public Page<LocationDTO> getLocations(String requestId, Pageable pageable) {
    return locationRepository.findAllByIsDeleteIsFalse(pageable).map(locationToDTOMapper::toDto);
  }

  @Override
  @Transactional(readOnly = true)
  public LocationDTO getLocation(String requestId, Integer locationId) {
    Location location = findLocationById(locationId, requestId);

    log.info(LogUtil.buildFormatLog(requestId,
        messageUtil.getMessage(MessageCode.MESSAGE_LOC_GET_SUCCESS, locationId)));

    return locationToDTOMapper.toDto(location);
  }

  @Override
  @Transactional
  public LocationDTO updateLocation(String requestId, Integer locationId,
      LocationRequest locationRequest) {
    Location location = findLocationById(locationId, requestId);

    if (locationRequest.getBranch() != null)
      location.setBranch(locationRequest.getBranch());

    if (locationRequest.getRoom() != null)
      location.setRoom(locationRequest.getRoom());

    if (locationRequest.getScheduleIds() != null) {
      List<Schedule> schedules = scheduleRepository.findAllById(locationRequest.getScheduleIds());
      location.setSchedules(new ArrayList<>(schedules));
    }

    location.setCode(generateLocationCode(location.getBranch(), location.getRoom()));

    log.info(LogUtil.buildFormatLog(requestId,
        messageUtil.getMessage(MessageCode.MESSAGE_LOC_UPDATE_SUCCESS, locationId)));

    return locationToDTOMapper.toDto(location);
  }

  @Override
  @Transactional
  public LocationDTO deleteLocation(String requestId, Integer locationId) {
    Location location = findLocationById(locationId, requestId);

    location.setIsDelete(true);
    log.info(LogUtil.buildFormatLog(requestId,
        messageUtil.getMessage(MessageCode.MESSAGE_LOC_DELETE_SUCCESS, locationId)));

    return locationToDTOMapper.toDto(location);
  }

  private Location findLocationById(Integer locationId, String requestId) {
    return locationRepository.findByIdAndIsDeleteIsFalse(locationId).orElseThrow(() -> {
      log.error(LogUtil.buildFormatLog(requestId,
          messageUtil.getMessage(MessageCode.MESSAGE_LOC_NOT_FOUND, locationId)));
      return new TveException(MessageCode.MESSAGE_NOT_FOUND,
          messageUtil.getMessage(MessageCode.MESSAGE_LOC_NOT_FOUND, locationId));
    });
  }

  private String generateLocationCode(String branch, String room) {
    return branch + "-" + room;
  }
}
