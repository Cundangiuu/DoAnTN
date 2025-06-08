package vn.codezx.arise.utils;

import java.util.List;
import java.util.regex.Pattern;
import vn.codezx.arise.constants.CommonConstants;

public class CommonUtil {

  private CommonUtil() {
  }

  public static boolean validateEmail(String email) {
    return Pattern.compile(CommonConstants.REGREX_EMAIL).matcher(email).matches();
  }

  public static boolean match(String input, List<String> list,
      FunctionInterface.Function2<String, String, Boolean> predicate) {
    for (String item : list) {
      if (Boolean.TRUE.equals(predicate.apply(input, item))) {
        return true;
      }
    }
    return false;
  }

  public static boolean isValidEducationalEmail(String email, String tailEmail) {
    String domain = email
        .substring(email.indexOf("@") + 1);
    return domain.endsWith(tailEmail);
  }
}
