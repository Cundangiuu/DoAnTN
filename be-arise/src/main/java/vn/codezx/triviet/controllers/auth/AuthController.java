package vn.codezx.triviet.controllers.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.codezx.triviet.dtos.staff.StaffDTO;
import vn.codezx.triviet.dtos.staff.request.AddTokenToUserDTO;
import vn.codezx.triviet.services.AuthService;

@RestController
@RequestMapping("api/auth")
public class AuthController {

  final AuthService authenticationService;

  @Autowired
  public AuthController(AuthService authenticationService) {
    this.authenticationService = authenticationService;
  }

  @PostMapping("refresh-token/{request-id}")
  public ResponseEntity<StaffDTO> addUser(@PathVariable("request-id") String requestId,
      @RequestBody AddTokenToUserDTO addTokenToUserDTO) {
    return ResponseEntity.ok(authenticationService.addUser(requestId, addTokenToUserDTO));
  }
}
