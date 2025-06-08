package vn.codezx.triviet.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import lombok.extern.slf4j.Slf4j;
import vn.codezx.triviet.constants.MessageCode;
import vn.codezx.triviet.dtos.ErrorMessageResponseDTO;
import vn.codezx.triviet.utils.MessageUtil;

@ControllerAdvice(basePackages = "vn.codezx.triviet")
@Slf4j
public class TveExceptionHandler {
    private final MessageUtil messageUtil;

    public TveExceptionHandler(MessageUtil messageUtil) {
        this.messageUtil = messageUtil;
    }

    HttpStatus errorCodeToHttpStatus(MessageCode errorCode) {
        return switch (errorCode) {
            case MESSAGE_NOT_FOUND -> HttpStatus.NOT_FOUND;
            case MESSAGE_ERROR_INPUT_ERROR -> HttpStatus.BAD_REQUEST;
            case MESSAGE_UNAUTHORIZED_ERROR -> HttpStatus.UNAUTHORIZED;
            case MESSAGE_CONFLICT_ERROR, MESSAGE_DUPLICATE -> HttpStatus.CONFLICT;
            case MESSAGE_FORBIDDEN_ERROR -> HttpStatus.FORBIDDEN;
            case null, default -> HttpStatus.INTERNAL_SERVER_ERROR;
        };
    }

    @ExceptionHandler({TveException.class})
    public ResponseEntity<ErrorMessageResponseDTO> tveExceptionHandle(TveException ex) {
        if (!ObjectUtils.isEmpty(ex.getCode())) {
            HttpStatus httpStatus = errorCodeToHttpStatus(MessageCode.fromCode(ex.getCode()));
            String errorMessage = ex.getMessage() == null ? httpStatus.toString() : ex.getMessage();
            ErrorMessageResponseDTO messageError =
                    new ErrorMessageResponseDTO(ex.getCode(), errorMessage, ex.getRequestId());
            return new ResponseEntity<>(messageError, httpStatus);
        } else {
            return new ResponseEntity<>(
                    new ErrorMessageResponseDTO(MessageCode.MESSAGE_ERROR_SYSTEM_ERROR.getCode(),
                            messageUtil.getMessage(MessageCode.MESSAGE_ERROR_SYSTEM_ERROR),
                            ex.getRequestId()),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
