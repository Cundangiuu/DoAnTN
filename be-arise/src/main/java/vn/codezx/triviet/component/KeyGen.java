package vn.codezx.triviet.component;

import java.security.Key;
import java.security.KeyPair;
import vn.codezx.triviet.entities.staff.id.KeyPairId;

public interface KeyGen {
  KeyPair generateKeyPair(String requestId);

  String rsaEncrypt(String requestId, KeyPairId keys, String original);

  String rsaDecrypt(String requestId, KeyPairId keys, String encrypted);

  Key toX509Key(String requestId, String value);

  Key toPKCS8Key(String requestId, String value);

  String toString(Key key);

  String randomCode(String requestId, int length);
}
