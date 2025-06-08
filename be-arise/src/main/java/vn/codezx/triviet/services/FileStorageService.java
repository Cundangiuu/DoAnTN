package vn.codezx.triviet.services;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.Base64;
import java.util.Objects;
import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.luciad.imageio.webp.WebPWriteParam;
import lombok.extern.slf4j.Slf4j;
import vn.codezx.triviet.constants.MessageCode;
import vn.codezx.triviet.exceptions.TveException;
import vn.codezx.triviet.utils.LogUtil;
import vn.codezx.triviet.utils.MessageUtil;

@Service
@Slf4j
public class FileStorageService {

  private final MessageUtil messageUtil;

  public FileStorageService(MessageUtil messageUtil) {
    this.messageUtil = messageUtil;
  }

  private byte[] imageToWebp(String requestId, MultipartFile file) {
    try {
      var filename = file.getOriginalFilename();
      if (Objects.isNull(filename)) {
        log.error(LogUtil.buildFormatLog(requestId, "Image has no name"));
        throw new TveException(MessageCode.MESSAGE_ERROR_SYSTEM_ERROR.getCode(),
            "Image has no name", requestId);
      }
      var ext = filename.substring(filename.lastIndexOf(".") + 1);

      ByteArrayOutputStream byteOutStrm = new ByteArrayOutputStream();
      BufferedImage originalImage = ImageIO.read(file.getInputStream());
      ImageIO.write(originalImage, ext, byteOutStrm);
      byte[] orgImgByteArray = byteOutStrm.toByteArray();
      ByteArrayInputStream byteInputStrm = new ByteArrayInputStream(orgImgByteArray);
      ByteArrayOutputStream baos = new ByteArrayOutputStream();
      ImageOutputStream imgOutStrm = ImageIO.createImageOutputStream(baos);
      BufferedImage image = ImageIO.read(byteInputStrm);
      ImageWriter writer = ImageIO.getImageWritersByMIMEType("image/webp").next();
      writer.setOutput(imgOutStrm);
      WebPWriteParam writeParam = new WebPWriteParam(writer.getLocale());
      writeParam.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
      writeParam
          .setCompressionType(writeParam.getCompressionTypes()[WebPWriteParam.LOSSY_COMPRESSION]);
      writeParam.setCompressionQuality(1f);
      writer.write(null, new IIOImage(image, null, null), writeParam);
      imgOutStrm.close();
      return baos.toByteArray();
    } catch (IOException e) {
      log.error(LogUtil.buildFormatLog(requestId, "Failed to compress image"),
          e.fillInStackTrace());
      throw new TveException(MessageCode.MESSAGE_ERROR_SYSTEM_ERROR.getCode(),
          "Failed to compress image", requestId);
    }
  }

  public String storeFile(String requestId, MultipartFile file, String storagePath) {
    createDir(storagePath);
    String fileName = file.getOriginalFilename();
    String fileExtension = ".webp";
    if (fileName != null && fileName.contains(".")) {
      fileName = fileName.substring(0, fileName.lastIndexOf("."));
    }

    String newFileName = fileName + "_" + System.currentTimeMillis() + fileExtension;

    saveFile(Paths.get(storagePath), requestId, newFileName, file);
    return newFileName;
  }

  public String storeFile(String requestId, MultipartFile file, String storagePath,
      String customFileName) {
    createDir(storagePath);
    String fileName = customFileName;
    String fileExtension = ".webp";
    if (fileName != null && fileName.contains(".")) {
      fileName = fileName.substring(0, fileName.lastIndexOf("."));
    }

    String newFileName = fileName + "_" + System.currentTimeMillis() + fileExtension;

    saveFile(Paths.get(storagePath), requestId, newFileName, file);
    return newFileName;
  }

  private void saveFile(Path basePath, String requestId, String filename,
      MultipartFile fileBinary) {
    Path targetLocation = basePath.resolve(filename);
    byte[] fileData = imageToWebp(requestId, fileBinary);
    try {
      Files.write(targetLocation, fileData, StandardOpenOption.TRUNCATE_EXISTING,
          StandardOpenOption.CREATE);
    } catch (IOException e) {
      log.error(LogUtil.buildFormatLog(requestId, "Failed to write file"), e.fillInStackTrace());
      throw new TveException(MessageCode.MESSAGE_ERROR_SYSTEM_ERROR.getCode(),
          "Failed to write file", requestId);
    }
  }

  public Path loadFile(String fileName, String storagePath) {
    return Paths.get(storagePath).resolve(fileName).normalize();
  }

  public String loadFileAsBase64(String requestId, String fileName, String storagePath) {
    try {
      Path filePath = Paths.get(storagePath).resolve(fileName).normalize();
      byte[] fileContent = Files.readAllBytes(filePath);
      return Base64.getEncoder().encodeToString(fileContent);
    } catch (IOException ex) {
      log.error(LogUtil.buildFormatLog(requestId, "Could not load file: " + fileName));
      throw new TveException(MessageCode.MESSAGE_ERROR_SYSTEM_ERROR.getCode(),
          messageUtil.getMessage(MessageCode.MESSAGE_ERROR_SYSTEM_ERROR, requestId));
    }
  }

  private void createDir(String storagePath) {
    try {
      Files.createDirectories(Paths.get(storagePath));
    } catch (IOException ex) {
      throw new TveException(MessageCode.MESSAGE_ERROR_SYSTEM_ERROR.getCode(),
          messageUtil.getMessage(MessageCode.MESSAGE_ERROR_SYSTEM_ERROR));
    }
  }

  public void deleteFile(String filePath, String requestId) {
    File file = new File(filePath);
    if (file.exists() && file.isFile() && !file.delete()) {
      log.error(LogUtil.buildFormatLog(requestId, "Failed to delete file"));
      throw new TveException(MessageCode.MESSAGE_ERROR_SYSTEM_ERROR.getCode(),
          "Failed to delete file", requestId);
    }
  }
}
