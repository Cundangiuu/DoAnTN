package vn.codezx.triviet.component.impl;

import static vn.codezx.triviet.utils.CommonUtil.match;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import vn.codezx.triviet.component.AuthComponent;
import vn.codezx.triviet.constants.CommonConstants.HeaderInfo;
import vn.codezx.triviet.constants.RoleName;
import vn.codezx.triviet.entities.staff.Role;
import vn.codezx.triviet.entities.staff.Staff;
import vn.codezx.triviet.repositories.StaffRepository;
import vn.codezx.triviet.services.AuthService;
import vn.codezx.triviet.utils.CommonUtil;

@Component
@Slf4j
public class AuthComponentImpl implements AuthComponent {

  private static final List<String> authLevel = List.of("/api/auth");
  private static final List<String> adminLevel = List.of("/api/settings");
  private static final List<String> accountantLevel = List.of("/api/accounting");
  private static final List<String> gradeLevel = List.of("/api/grades");

  @Value("${header.security.key-token}")
  private String headerKeyToken;
  @Value("${header.security.token-default}")
  private String tokenDefault;
  @Value("${validate.email}")
  private String tailEmail;
  private final AuthService authService;

  private final StaffRepository staffRepository;

  @Autowired
  AuthComponentImpl(AuthService authService, StaffRepository staffRepository) {
    this.authService = authService;
    this.staffRepository = staffRepository;
  }


  @Override
  public Authentication buildAuthentication(String uri, HttpServletRequest request) {
    String token = request.getHeader(headerKeyToken);

    if (token == null || token.isEmpty()) {
      log.warn("Missing or empty token");
      return null;
    }

    if (tokenDefault.equals(token)) {
      return new UsernamePasswordAuthenticationToken(HeaderInfo.SYSTEM_AUTH, null,
          Collections.emptyList());
    }

    if (!StringUtils.hasText(token)) {
      log.warn("Invalid token");
      return null;
    }

    GoogleIdToken googleIdToken = authService.verifyIdToken(uri, token);
    if (ObjectUtils.isEmpty(googleIdToken)) {
      return null;
    }
    String email = googleIdToken.getPayload().getEmail();

    if (!CommonUtil.isValidEducationalEmail(email, tailEmail)) {
      log.warn("Access denied: Invalid email domain for {}", email);
      return null;
    }

    List<RoleName> roleNames = getRoles(email);
    boolean isMethodGet = request.getMethod().equalsIgnoreCase("GET");

    if (isMethodGet) {
      return new UsernamePasswordAuthenticationToken(email, null, toGrantedAuthorities(roleNames));
    }

    if (!hasRequiredRole(uri, roleNames, isMethodGet) || isTeacherCUD(uri, roleNames)) {
      log.warn("Access denied for user {} with roles {}", email, roleNames);
      return null;
    }

    return new UsernamePasswordAuthenticationToken(email, null, toGrantedAuthorities(roleNames));
  }

  private List<RoleName> getRoles(String email) {
    Staff staff = staffRepository.findByEmailAddressAndIsDeleteIsFalse(email);
    if (staff == null || staff.getRoles() == null) {
      return Collections.emptyList();
    }

    return staff.getRoles().stream().map(Role::getName).collect(Collectors.toList());
  }

  private boolean hasRequiredRole(String uri, List<RoleName> roleNames, boolean isMethodGet) {
    if (match(uri, adminLevel, String::startsWith)) {
      return roleNames.contains(RoleName.ADMIN);
    }
    if (match(uri, accountantLevel, String::startsWith)) {
      return roleNames.contains(RoleName.ADMIN) || roleNames.contains(RoleName.ACCOUNTANT);
    }
    return true;
  }

  private boolean isTeacherCUD(String uri, List<RoleName> roleNames) {
    if (match(uri, authLevel, String::startsWith)) {
      return false;
    }

    if (match(uri, gradeLevel, String::startsWith)) {
      return false;
    }
    return roleNames.size() == 1 && roleNames.get(0).equals(RoleName.TEACHER);
  }

  private List<GrantedAuthority> toGrantedAuthorities(List<RoleName> roleNames) {
    return roleNames.stream().map(roleName -> new SimpleGrantedAuthority(roleName.name()))
        .collect(Collectors.toList());
  }
}
