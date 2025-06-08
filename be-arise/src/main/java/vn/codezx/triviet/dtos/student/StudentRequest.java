package vn.codezx.triviet.dtos.student;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class StudentRequest {
  private String name;
  private String nickname;
  private Date dateOfBirth;
  private String emailAddress;
  private String phoneNumber;
  private String address;
  private String note;
  private Integer discountId;
}
