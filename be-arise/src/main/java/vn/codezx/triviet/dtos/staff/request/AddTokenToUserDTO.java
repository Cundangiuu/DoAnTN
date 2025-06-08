package vn.codezx.triviet.dtos.staff.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddTokenToUserDTO {
  private String code;
  private String refreshToken;
  private String email;
  private String firstName;
  private String lastName;
  private String phoneNumber;
  private String avatarUrl;
}
