package com.ez.core.exception;

/**
 * Created by Ez on 2017/12/7.
 */
public class ServerException extends BaseException{

    public ServerException(String errCode) {
        super(errCode);
    }

    public ServerException(String errCode, String message) {
        super(errCode, message);
    }

    public ServerException(String errCode, String message, Throwable cause) {
        super(errCode, message, cause);
    }

    public ServerException(String errCode, Throwable cause) {
        super(errCode, cause);
    }
}
