package vn.codezx.triviet.services.impl;

import java.io.File;
import java.util.List;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import lombok.extern.slf4j.Slf4j;
import vn.codezx.triviet.constants.MessageCode;
import vn.codezx.triviet.dtos.staff.StaffDTO;
import vn.codezx.triviet.dtos.staff.request.StaffRequest;
import vn.codezx.triviet.entities.course.Course;
import vn.codezx.triviet.entities.setting.Schedule;
import vn.codezx.triviet.entities.staff.Role;
import vn.codezx.triviet.entities.staff.Staff;
import vn.codezx.triviet.exceptions.TveException;
import vn.codezx.triviet.mappers.staff.StaffToDTOMapper;
import vn.codezx.triviet.repositories.CourseRepository;
import vn.codezx.triviet.repositories.RoleRepository;
import vn.codezx.triviet.repositories.ScheduleRepository;
import vn.codezx.triviet.repositories.StaffRepository;
import vn.codezx.triviet.services.FileStorageService;
import vn.codezx.triviet.services.StaffService;
import vn.codezx.triviet.utils.LogUtil;
import vn.codezx.triviet.utils.MessageUtil;

@Service
@Slf4j
public class StaffServiceImpl implements StaffService {
  private final StaffRepository staffRepository;
  private final StaffToDTOMapper staffToDTOMapper;
  private final MessageUtil messageUtil;
  private final FileStorageService fileStorageService;
  private final ScheduleRepository scheduleRepository;
  private final RoleRepository roleRepository;
  private final CourseRepository courseRepository;
  private final String avatarStoragePath;

  public StaffServiceImpl(StaffRepository staffRepository, StaffToDTOMapper staffToDTOMapper,
      MessageUtil messageUtil, FileStorageService fileStorageService,
      ScheduleRepository scheduleRepository, CourseRepository courseRepository,
      RoleRepository roleRepository,
      @Value("${file.storage.staff.avatar}") String avatarStoragePath) {
    this.staffRepository = staffRepository;
    this.staffToDTOMapper = staffToDTOMapper;
    this.messageUtil = messageUtil;
    this.fileStorageService = fileStorageService;
    this.avatarStoragePath = avatarStoragePath;
    this.courseRepository = courseRepository;
    this.roleRepository = roleRepository;
    this.scheduleRepository = scheduleRepository;
  }

  @Transactional
  @Override
  public StaffDTO createStaff(String requestId, StaffRequest staffRequest, MultipartFile avatar) {
    Staff staff;

    staff = Staff.builder().emailAddress(staffRequest.getEmailAddress())
        .firstName(staffRequest.getFirstName()).lastName(staffRequest.getLastName())
        .phoneNumber(staffRequest.getPhoneNumber()).weeklyHours(staffRequest.getWeeklyHours())
        .rates(staffRequest.getWeeklyHours()).build();

    if (staffRequest.getScheduleIds() != null) {
      List<Schedule> schedules = scheduleRepository.findAllById(staffRequest.getScheduleIds());
      staff.getSchedules().addAll(schedules);
    }

    if (staffRequest.getCourseIds() != null) {
      List<Course> courses = courseRepository.findAllById(staffRequest.getCourseIds());
      staff.getCourses().addAll(courses);
    }

    if (staffRequest.getRoleIds() != null) {
      List<Role> roles = roleRepository.findAllById(staffRequest.getRoleIds());
      staff.getRoles().addAll(roles);
    }

    staff = staffRepository.saveAndFlush(staff);

    if (avatar != null) {
      storeAvatar(requestId, staff, avatar);
    }

    return staffToDTOMapper.toDto(staff);
  }

  @Override
  @Transactional(readOnly = true)
  public Page<StaffDTO> getStaffs(String requestId, String query, Pageable pageable) {
    return staffRepository.findAllByIsDeleteIsFalse(pageable).map(staffToDTOMapper::toDto);
  }

  @Override
  @Transactional(readOnly = true)
  public StaffDTO getStaff(String requestId, Integer staffId) {
    Staff staff = findStaffById(staffId, requestId);

    return staffToDTOMapper.toDto(staff);
  }

  @Override
  @Transactional
  public StaffDTO updateStaff(String requestId, Integer staffId, StaffRequest staffRequest,
      MultipartFile avatar) {
    Staff staff = findStaffById(staffId, requestId);

    if (staffRequest.getEmailAddress() != null)
      staff.setEmailAddress(staffRequest.getEmailAddress());
    if (staffRequest.getFirstName() != null)
      staff.setFirstName(staffRequest.getFirstName());
    if (staffRequest.getLastName() != null)
      staff.setLastName(staffRequest.getLastName());
    if (staffRequest.getPhoneNumber() != null)
      staff.setPhoneNumber(staffRequest.getPhoneNumber());

    if (staffRequest.getWeeklyHours() != null)
      staff.setWeeklyHours(staffRequest.getWeeklyHours());

    if (staffRequest.getRates() != null)
      staff.setRates(staffRequest.getRates());

    if (staffRequest.getScheduleIds() != null) {
      List<Schedule> schedules = scheduleRepository.findAllById(staffRequest.getScheduleIds());
      staff.getSchedules().clear();
      staff.getSchedules().addAll(schedules);
    }

    if (staffRequest.getCourseIds() != null) {
      List<Course> courses = courseRepository.findAllById(staffRequest.getCourseIds());
      staff.getCourses().clear();
      staff.getCourses().addAll(courses);
    }

    if (staffRequest.getRoleIds() != null) {
      List<Role> roles = roleRepository.findAllById(staffRequest.getRoleIds());
      staff.getRoles().clear();
      staff.getRoles().addAll(roles);
    }

    staff = staffRepository.saveAndFlush(staff);

    if (avatar != null) {
      storeAvatar(requestId, staff, avatar);
    }

    return staffToDTOMapper.toDto(staff);
  }

  @Transactional
  @Override
  public StaffDTO deleteStaff(String requestId, Integer staffId) {
    Staff staff = findStaffById(staffId, requestId);

    staff.setIsDelete(true);
    staff = staffRepository.saveAndFlush(staff);

    return staffToDTOMapper.toDto(staff);
  }

  @Override
  public String storeAvatar(String requestId, Staff staff, MultipartFile file) {
    String fileName = fileStorageService.storeFile(requestId, file, avatarStoragePath,
        String.valueOf(staff.getId()));

    String oldAvatarUrl = staff.getAvatarUrl();
    if (oldAvatarUrl != null) {
      fileStorageService.deleteFile(requestId, oldAvatarUrl);
    }

    String imagePath = avatarStoragePath + File.separator + fileName;
    staff.setAvatarUrl(imagePath);
    return imagePath;
  }

  private Staff findStaffById(Integer staffId, String requestId) {
    return staffRepository.findByIdAndIsDeleteFalse(staffId).orElseThrow(() -> {
      log.error(LogUtil.buildFormatLog(requestId,
          messageUtil.getMessage(MessageCode.MESSAGE_STAFF_NOT_FOUND, staffId)));
      return new TveException(MessageCode.MESSAGE_NOT_FOUND,
          messageUtil.getMessage(MessageCode.MESSAGE_STAFF_NOT_FOUND, staffId), requestId);
    });
  }

  @Override
  @Transactional(readOnly = true)
  public Page<StaffDTO> getStaffs(String requestId, String query, List<Integer> scheduleIds,
      List<Integer> roleIds, Pageable pageable) {

    if (Objects.isNull(roleIds)) {
      roleIds = roleRepository.findAllByIsDeleteIsFalse().stream().map(Role::getId).toList();
    }

    if (Objects.isNull(scheduleIds)) {
      return staffRepository.searchStaffsByRole(query, roleIds, pageable)
          .map(staffToDTOMapper::toDto);
    }

    return staffRepository.searchStaffsByRoleAndSchedule(query, roleIds, scheduleIds, pageable)
        .map(staffToDTOMapper::toDto);
  }

}
