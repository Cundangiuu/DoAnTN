package vn.codezx.triviet.mappers.student;

import org.springframework.stereotype.Component;
import vn.codezx.triviet.dtos.student.StudentDTO;
import vn.codezx.triviet.entities.student.Student;
import vn.codezx.triviet.mappers.DtoMapper;

@Component
public class StudentToDTOMapper extends DtoMapper<Student, StudentDTO> {

  @Override
  public StudentDTO toDto(Student entity) {
    return StudentDTO.builder().id(entity.getId()).code(entity.getCode()).name(entity.getName())
        .nickname(entity.getNickname()).dateOfBirth(entity.getDateOfBirth())
        .phoneNumber(entity.getPhoneNumber()).emailAddress(entity.getEmailAddress())
        .address(entity.getAddress()).note(entity.getNote()).discount(entity.getDiscount())
        .avatarUrl(entity.getAvatarUrl()).createdAt(entity.getCreatedAt())
        .createdBy(entity.getCreatedBy()).updatedAt(entity.getUpdatedAt())
        .updatedBy(entity.getUpdatedBy()).build();
  }
}
