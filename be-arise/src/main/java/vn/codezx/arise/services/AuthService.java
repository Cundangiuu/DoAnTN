package vn.codezx.arise.services;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import vn.codezx.arise.dtos.staff.StaffDTO;
import vn.codezx.arise.dtos.staff.request.AddTokenToUserDTO;
import vn.codezx.arise.dtos.staff.request.GetRefreshTokenDTO;

public interface AuthService {

  void generateKeyPair(String requestId);

  GoogleIdToken verifyIdToken(String requestId, String token);

  StaffDTO addUser(String requestId, AddTokenToUserDTO addTokenToUserDTO);

  StaffDTO getRefreshToken(String requestId, GetRefreshTokenDTO getRefreshTokenDTO);
}
