package vn.codezx.triviet.utils;

public final class LogUtil {

    private static final String FORMAT_LOG_TEXT = "[%s] %s";
  
    public static String buildFormatLog(String requestId, String errMessage) {
      return String.format(FORMAT_LOG_TEXT, requestId, errMessage);
    }
  }