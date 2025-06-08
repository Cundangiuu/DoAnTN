package vn.codezx.triviet.exceptions;

import lombok.Getter;
import vn.codezx.triviet.constants.MessageCode;

@Getter
public class TveException extends RuntimeException {
    private final String code;
    private final String requestId;


    public TveException(String code, String message) {
        super(message);
        this.code = code;
        this.requestId = null;
    }

    public TveException(MessageCode key, String message) {
        super(message);
        this.code = key.getCode();
        this.requestId = null;
    }

    public TveException(String code, String message, String requestId) {
        super(message);
        this.code = code;
        this.requestId = requestId;
    }

    public TveException(MessageCode key, String message, String requestId) {
        super(message);
        this.code = key.getCode();
        this.requestId = requestId;
    }
}
