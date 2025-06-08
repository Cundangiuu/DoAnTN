package vn.codezx.triviet.controllers.assets;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import lombok.extern.slf4j.Slf4j;
import vn.codezx.triviet.constants.MessageCode;
import vn.codezx.triviet.exceptions.TveException;
import vn.codezx.triviet.utils.LogUtil;
import vn.codezx.triviet.utils.MessageUtil;

@RestController
@RequestMapping("/api/assets")
@Slf4j
public class FileController {
    private final MessageUtil messageUtil;

    FileController(MessageUtil messageUtil) {
        this.messageUtil = messageUtil;
    }

    @GetMapping("/{request-id}")
    public ResponseEntity<Resource> serveFile(@PathVariable("request-id") String requestId,
            @RequestParam String filePath) {
        Path filePathToServe = Paths.get(filePath);

        if (!Files.exists(filePathToServe) || !Files.isRegularFile(filePathToServe)) {
            log.error(LogUtil.buildFormatLog(requestId, messageUtil
                    .getMessage(MessageCode.MESSAGE_FILE_NOT_FOUND, filePath)));
            throw new TveException(MessageCode.MESSAGE_FILE_NOT_FOUND,
                    messageUtil.getMessage(MessageCode.MESSAGE_FILE_NOT_FOUND, filePath),
                    requestId);
        }

        try {
            String contentType = Files.probeContentType(filePathToServe);

            Resource resource = new FileSystemResource(filePathToServe);
            return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
        } catch (Exception ex) {
            log.error(LogUtil.buildFormatLog(requestId, messageUtil
                    .getMessage(MessageCode.MESSAGE_FILE_SERVE_ERROR, filePath)));
            throw new TveException(MessageCode.MESSAGE_FILE_SERVE_ERROR,
                    messageUtil.getMessage(MessageCode.MESSAGE_FILE_SERVE_ERROR, filePath),
                    requestId);
        }
    }
}
