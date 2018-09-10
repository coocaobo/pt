package com.ez.core.exception;

import lombok.Getter;

/**
 * Created by Ez on 2017/12/7.
 */
public class BaseException extends RuntimeException {
    protected String errCode;

    public BaseException(String errCode) {
        super();
        this.errCode = errCode;
    }

    public BaseException(String errCode, String message) {
        super(message);
        this.errCode = errCode;
    }

    public BaseException(String errCode, String message, Throwable cause) {
        super(message, cause);
        this.errCode = errCode;
    }

    public BaseException(String errCode, Throwable cause) {
        super(cause);
        this.errCode = errCode;
    }

    public String getErrCode() {
        return errCode;
    }
}
