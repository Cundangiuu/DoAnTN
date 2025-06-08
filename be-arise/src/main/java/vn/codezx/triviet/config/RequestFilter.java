package vn.codezx.triviet.config;

import static vn.codezx.triviet.utils.CommonUtil.match;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import vn.codezx.triviet.component.AuthComponent;
import vn.codezx.triviet.constants.CommonConstants.HeaderInfo;

@Component
@Slf4j
public class RequestFilter extends OncePerRequestFilter {

  private AuthComponent authComponent;

  RequestFilter(AuthComponent authComponent) {
    this.authComponent = authComponent;
  }

  private static final List<String> publicLevel =
      Arrays.asList("/actuator", "/swagger-ui", "/v3/api-docs", "/api/public");

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
      FilterChain filterChain) throws ServletException, IOException {
    Authentication authentication;
    String uri = request.getRequestURI().substring(request.getContextPath().length());
    authentication = getAuthentication(uri, request);
    if (authentication == null) {
      response.setStatus(HttpServletResponse.SC_FORBIDDEN);
      response.getWriter().write("Access Denied");
      log.warn("Do not have permission to call the Api {}", uri);
      return;
    }

    SecurityContextHolder.getContext().setAuthentication(authentication);
    filterChain.doFilter(request, response);
  }

  private Authentication getAuthentication(String uri, HttpServletRequest request) {
    Authentication authentication;
    if (match(uri, publicLevel, String::startsWith)) {
      authentication = new UsernamePasswordAuthenticationToken(HeaderInfo.SYSTEM_AUTH, null,
          Collections.emptyList());
    } else {
      authentication = authComponent.buildAuthentication(uri, request);
    }
    return authentication;
  }
}
