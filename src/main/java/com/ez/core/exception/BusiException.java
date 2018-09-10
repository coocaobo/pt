package com.ez.core.exception;

/**
 * Created by Ez on 2017/12/7.
 */
public class BusiException extends BaseException{
    public BusiException(String errCode) {
        super(errCode);
        this.errCode = errCode;
    }

    public BusiException(String errCode, String message) {
        super(errCode, message);
        this.errCode = errCode;
    }

    public BusiException(String errCode, String message, Throwable cause) {
        super(errCode, message, cause);
        this.errCode = errCode;
    }

    public BusiException(String errCode, Throwable cause) {
        super(errCode, cause);
        this.errCode = errCode;
    }
}
