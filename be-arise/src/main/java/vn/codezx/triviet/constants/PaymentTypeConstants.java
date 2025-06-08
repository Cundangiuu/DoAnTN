package vn.codezx.triviet.constants;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum PaymentTypeConstants {
  CASH("CASH"),
  BANK_TRANSFER("BANK_TRANSFER");

  private final String value;

  PaymentTypeConstants(String value) {
    this.value = value;
  }

  @JsonValue
  public String getValue() {
    return value;
  }

  @JsonCreator
  public static PaymentTypeConstants fromString(String value) {
    if (value == null || value.trim().isEmpty()) {
      return null; // Convert empty string to null
    }
    return PaymentTypeConstants.valueOf(value);
  }


}
