package vn.codezx.arise.exceptions;

import lombok.Getter;
import vn.codezx.arise.constants.MessageCode;

@Getter
public class AriseException extends RuntimeException {
    private final String code;
    private final String requestId;


    public AriseException(String code, String message) {
        super(message);
        this.code = code;
        this.requestId = null;
    }

    public AriseException(MessageCode key, String message) {
        super(message);
        this.code = key.getCode();
        this.requestId = null;
    }

    public AriseException(String code, String message, String requestId) {
        super(message);
        this.code = code;
        this.requestId = requestId;
    }

    public AriseException(MessageCode key, String message, String requestId) {
        super(message);
        this.code = key.getCode();
        this.requestId = requestId;
    }
}
