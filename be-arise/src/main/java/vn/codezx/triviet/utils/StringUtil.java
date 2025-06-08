package vn.codezx.triviet.utils;

import java.text.DecimalFormat;
import java.time.LocalDate;

public class StringUtil {

  private StringUtil() {}

  public static String generateCourseCode(String name, Integer number) {
    StringBuilder codeBuilder = new StringBuilder(name);
    LocalDate currentDate = LocalDate.now();
    DecimalFormat decimalFormat = new DecimalFormat("00");
    return codeBuilder.append(currentDate.format(DateTimeUtil.formatter))
        .append(decimalFormat.format(number)).toString();
  }

  public static String generateCode(String name, Integer number) {
    StringBuilder codeBuilder = new StringBuilder(name);
    LocalDate currentDate = LocalDate.now();
    DecimalFormat decimalFormat = new DecimalFormat("000");

    return codeBuilder.append("-").append(currentDate.format(DateTimeUtil.formatter))
        .append(decimalFormat.format(number)).toString();
  }
}
