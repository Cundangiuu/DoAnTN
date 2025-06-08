package vn.codezx.triviet.component.impl;

import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.Key;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Random;
import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import vn.codezx.triviet.component.KeyGen;
import vn.codezx.triviet.constants.MessageCode;
import vn.codezx.triviet.entities.staff.id.KeyPairId;
import vn.codezx.triviet.exceptions.TveException;
import vn.codezx.triviet.utils.LogUtil;
import vn.codezx.triviet.utils.MessageUtil;

@Component
@Slf4j
public class KeyGenImpl implements KeyGen {

  final MessageUtil messageUtil;
  final Random random = new Random();
  static final String TRANSFORMATION_FLAVOR = "RSA/ECB/OAEPWITHSHA-256ANDMGF1PADDING";

  KeyGenImpl(MessageUtil messageUtil) {
    this.messageUtil = messageUtil;
  }

  @Override
  public KeyPair generateKeyPair(String requestId) {
    try {
      KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
      generator.initialize(2048);
      return generator.genKeyPair();
    } catch (NoSuchAlgorithmException e) {
      log.error(LogUtil.buildFormatLog(requestId, "Failed to generate key pair with error:"),
          e.fillInStackTrace());
      throw new TveException(MessageCode.MESSAGE_ERROR_SYSTEM_ERROR.getCode(),
          messageUtil.getMessage(MessageCode.MESSAGE_ERROR_SYSTEM_ERROR, requestId));
    }
  }

  @Override
  public Key toX509Key(String requestId, String value) {
    try {
      byte[] decodedKey = Base64.getDecoder().decode(value);
      return KeyFactory.getInstance("RSA").generatePublic(new X509EncodedKeySpec(decodedKey));

    } catch (InvalidKeySpecException | NoSuchAlgorithmException e) {
      log.error(LogUtil.buildFormatLog(requestId, "Failed to encrypt value with error:"),
          e.fillInStackTrace());
      throw new TveException(MessageCode.MESSAGE_ERROR_SYSTEM_ERROR.getCode(),
          messageUtil.getMessage(MessageCode.MESSAGE_ERROR_SYSTEM_ERROR, requestId));
    }

  }

  @Override
  public String toString(Key key) {
    return Base64.getEncoder().encodeToString(key.getEncoded());
  }


  @Override
  public String rsaEncrypt(String requestId, KeyPairId keys, String original) {
    try {
      Cipher encryptCipher = Cipher.getInstance(TRANSFORMATION_FLAVOR);
      encryptCipher.init(Cipher.ENCRYPT_MODE, toX509Key(requestId, keys.getPublicKey()));
      byte[] secretMessageBytes = original.getBytes(StandardCharsets.UTF_8);
      byte[] encryptedMessageBytes = encryptCipher.doFinal(secretMessageBytes);
      return Base64.getEncoder().encodeToString(encryptedMessageBytes);
    } catch (NoSuchAlgorithmException | NoSuchPaddingException | InvalidKeyException
             | IllegalBlockSizeException | BadPaddingException e) {
      log.error(LogUtil.buildFormatLog(requestId, "Failed to restore key:"),
          e.fillInStackTrace());
      throw new TveException(MessageCode.MESSAGE_ERROR_SYSTEM_ERROR.getCode(),
          messageUtil.getMessage(MessageCode.MESSAGE_ERROR_SYSTEM_ERROR, requestId));
    }
  }

  @Override
  public String rsaDecrypt(String requestId, KeyPairId keys, String encrypted) {
    try {
      Cipher decryptCipher = Cipher.getInstance(TRANSFORMATION_FLAVOR);
      decryptCipher.init(Cipher.DECRYPT_MODE, toPKCS8Key(requestId, keys.getPrivateKey()));
      byte[] encryptedMessageBytes = Base64.getDecoder().decode(encrypted);
      byte[] secretMessageBytes = decryptCipher.doFinal(encryptedMessageBytes);
      return new String(secretMessageBytes, StandardCharsets.UTF_8);

    } catch (NoSuchAlgorithmException | NoSuchPaddingException | InvalidKeyException
             | IllegalBlockSizeException | BadPaddingException e) {
      log.error(LogUtil.buildFormatLog(requestId, "Failed to decrypt value with error:"),
          e.fillInStackTrace());
      throw new TveException(MessageCode.MESSAGE_ERROR_SYSTEM_ERROR.getCode(),
          messageUtil.getMessage(MessageCode.MESSAGE_ERROR_SYSTEM_ERROR, requestId));
    }
  }

  @Override
  public String randomCode(String requestId, int length) {
    int leftLimit = 48; // numeral '0'
    int rightLimit = 122; // letter 'z'

    return random.ints(leftLimit, rightLimit + 1)
        .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97)).limit(length)
        .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
        .toString();
  }

  @Override
  public Key toPKCS8Key(String requestId, String value) {
    try {
      byte[] decodedKey = Base64.getDecoder().decode(value);
      return KeyFactory.getInstance("RSA")
          .generatePrivate(new PKCS8EncodedKeySpec(decodedKey));

    } catch (InvalidKeySpecException | NoSuchAlgorithmException e) {
      log.error(LogUtil.buildFormatLog(requestId, "Failed to encrypt value with error:"),
          e.fillInStackTrace());
      throw new TveException(MessageCode.MESSAGE_ERROR_SYSTEM_ERROR.getCode(),
          messageUtil.getMessage(MessageCode.MESSAGE_ERROR_SYSTEM_ERROR, requestId));
    }

  }

}
