package vn.codezx.arise.utils;

import java.util.Locale;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;
import vn.codezx.arise.constants.MessageCode;

@Component
public class MessageUtil {

  @Autowired
  private MessageSource messageSource;

  public String getMessage(MessageCode key, Object... params) {
    return messageSource.getMessage(key.getCode(), params, Locale.getDefault());
  }

  public String getMessage(String code, Object... params) {
    return messageSource.getMessage(code, params, Locale.getDefault());
  }
}