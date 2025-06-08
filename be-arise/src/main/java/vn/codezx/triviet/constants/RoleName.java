package vn.codezx.triviet.constants;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum RoleName {
  ADMIN("ADMIN"), ACCOUNTANT("ACCOUNTANT"), ACADEMIC_STAFF("ACADEMIC STAFF"), TEACHER("TEACHER");

  private final String role;

  public static RoleName fromName(String role) {
    for (RoleName roleName : RoleName.values()) {
      if (roleName.getRole().equals(role)) {
        return roleName;
      }
    }

    return null;
  }
}
