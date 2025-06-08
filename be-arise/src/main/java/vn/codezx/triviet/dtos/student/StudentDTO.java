package vn.codezx.triviet.dtos.student;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import vn.codezx.triviet.dtos.base.BaseInfoDTO;
import vn.codezx.triviet.entities.setting.Discount;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class StudentDTO extends BaseInfoDTO {
  private int id;
  private String code;
  private String name;
  private String nickname;
  private Date dateOfBirth;
  private String emailAddress;
  private String phoneNumber;
  private String address;
  private String note;
  private String avatarUrl;
  private Discount discount;
}
