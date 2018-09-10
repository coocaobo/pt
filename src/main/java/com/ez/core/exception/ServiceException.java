package com.ez.core.exception;

/**
 * Created by Ez on 2017/12/7.
 */
public class ServiceException extends BaseException{

    public ServiceException(String errCode) {
        super(errCode);
    }

    public ServiceException(String errCode, String message) {
        super(errCode, message);
    }

    public ServiceException(String errCode, String message, Throwable cause) {
        super(errCode, message, cause);
    }

    public ServiceException(String errCode, Throwable cause) {
        super(errCode, cause);
    }
}
