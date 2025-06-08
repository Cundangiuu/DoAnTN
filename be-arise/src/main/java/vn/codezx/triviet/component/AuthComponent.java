package vn.codezx.triviet.component;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;

public interface AuthComponent {
  Authentication buildAuthentication(String uri, HttpServletRequest request);

}
