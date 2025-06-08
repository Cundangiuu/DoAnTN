package vn.codezx.arise.controllers.auth;

import java.util.Objects;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.codezx.arise.dtos.staff.StaffDTO;
import vn.codezx.arise.dtos.staff.request.GetRefreshTokenDTO;
import vn.codezx.arise.dtos.staff.request.VerifyTokenDTO;
import vn.codezx.arise.services.AuthService;

@RestController
@RequestMapping("api/public/user")
public class UserController {

  final AuthService authenticationService;

  UserController(AuthService authenticationService) {
    this.authenticationService = authenticationService;
  }

  @GetMapping("refresh-token/{request-id}")
  public ResponseEntity<StaffDTO> getRefreshToken(@PathVariable("request-id") String requestId,
      @ParameterObject GetRefreshTokenDTO getRefreshTokenDTO) {
    return ResponseEntity
        .ok(authenticationService.getRefreshToken(requestId, getRefreshTokenDTO));
  }

  @PostMapping("/verify/{request-id}")
  public ResponseEntity<Void> verifyToken(@PathVariable("request-id") String requestId,
      @RequestBody VerifyTokenDTO verifyTokenDTO) {
    var idToken =
        authenticationService.verifyIdToken(requestId, verifyTokenDTO.getToken());
    return Objects.isNull(idToken) ? ResponseEntity.badRequest().build()
        : ResponseEntity.ok().build();
  }
}
