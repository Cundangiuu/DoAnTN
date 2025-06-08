package vn.codezx.arise.utils.converters;

import java.util.stream.Stream;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.codezx.arise.constants.MessageCode;
import vn.codezx.arise.constants.RoleName;
import vn.codezx.arise.exceptions.AriseException;

@Converter(autoApply = true)
public class RoleNameConverter implements AttributeConverter<RoleName, String> {
  @Override
  public String convertToDatabaseColumn(RoleName roleName) {
    if (roleName == null)
      return null;

    return roleName.getRole();
  }

  @Override
  public RoleName convertToEntityAttribute(String dbData) {
    if (dbData == null) {
      return null;
    }

    return Stream.of(RoleName.values()).filter(d -> d.getRole().equals(dbData)).findFirst()
        .orElseThrow(() -> {
          return new AriseException(MessageCode.MESSAGE_ERROR_SYSTEM_ERROR, "Illegal Argument");
        });
  }
}
