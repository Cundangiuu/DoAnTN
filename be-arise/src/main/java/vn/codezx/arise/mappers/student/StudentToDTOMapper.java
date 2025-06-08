package vn.codezx.arise.mappers.student;

import org.springframework.stereotype.Component;
import vn.codezx.arise.dtos.student.StudentDTO;
import vn.codezx.arise.entities.student.Student;
import vn.codezx.arise.mappers.DtoMapper;

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
