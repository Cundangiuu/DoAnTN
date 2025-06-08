package vn.codezx.arise.utils.converters;

import java.time.DayOfWeek;
import java.util.stream.Stream;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import vn.codezx.arise.constants.MessageCode;
import vn.codezx.arise.exceptions.AriseException;

@Converter(autoApply = true)
public class DayOfWeekConverter implements AttributeConverter<DayOfWeek, String> {
  @Override
  public String convertToDatabaseColumn(DayOfWeek dayOfWeek) {
    if (dayOfWeek == null) {
      return null;
    }

    return dayOfWeek.name();
  }

  @Override
  public DayOfWeek convertToEntityAttribute(String dbData) {
    if (dbData == null) {
      return null;
    }

    return Stream.of(DayOfWeek.values()).filter(d -> d.name().equals(dbData)).findFirst()
        .orElseThrow(() -> {
          return new AriseException(MessageCode.MESSAGE_ERROR_SYSTEM_ERROR, "Illegal Argument");
        });
  }

}
