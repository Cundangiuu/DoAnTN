package vn.codezx.triviet.constants;

public class CommonConstants {
  public static final String REGREX_EMAIL = "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@"
      + "[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$";

  private CommonConstants() {
  }

  public static class HeaderInfo {

    public static final String SYSTEM_AUTH = "CodeZX-System";

    private HeaderInfo() {
    }
  }
}
