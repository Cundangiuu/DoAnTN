package vn.codezx.triviet.config;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.security.GeneralSecurityException;
import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpRequestInitializer;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.GmailScopes;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.ServiceAccountCredentials;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import vn.codezx.triviet.constants.MessageCode;
import vn.codezx.triviet.exceptions.TveException;

@Configuration
@Slf4j
@Getter
public class GoogleClientConfig {
  private final String googleClientSecret;

  private final GsonFactory gsonFactory = new GsonFactory();
  private final GoogleClientSecrets clientSecrets;
  private final HttpTransport httpTransport;
  private final List<String> scopes = Arrays.asList(GmailScopes.MAIL_GOOGLE_COM);
  private GoogleCredentials googleCredentials = null;
  private Credential credential = null;

  GoogleClientConfig(@Value("${file.google.client-secret}") String googleClientSecret,
      @Value("${file.google.service-user-token}") String googleServiceToken,
      @Value("${server.google.user}") String email) {
    this.googleClientSecret = googleClientSecret;
    try {
      var file = new File(googleClientSecret);
      var inputStream = new FileInputStream(file);
      clientSecrets = GoogleClientSecrets.load(gsonFactory,
          new InputStreamReader(inputStream));

      httpTransport = GoogleNetHttpTransport.newTrustedTransport();

      googleCredentials = ServiceAccountCredentials
          .fromStream(new FileInputStream(
              new File(googleServiceToken)))
          .createScoped(scopes).createDelegated(email);
    } catch (IOException e) {
      log.error("Failed to get client credential from {}", googleClientSecret,
          e.fillInStackTrace());
      throw new TveException(
          MessageCode.MESSAGE_ERROR_SYSTEM_ERROR.getCode(),
          "Failed to create credential");
    } catch (GeneralSecurityException e) {
      log.error("Failed to init http transport", e.fillInStackTrace());
      throw new TveException(
          MessageCode.MESSAGE_ERROR_SYSTEM_ERROR.getCode(),
          "Failed to init http transport");
    }
  }

  @Bean
  Gmail getGmailService() {
    HttpRequestInitializer requestInitializer =
        new HttpCredentialsAdapter(googleCredentials);

    return new Gmail.Builder(httpTransport, gsonFactory, requestInitializer)
        .setApplicationName("tri-viet-445115").build();
  }
}