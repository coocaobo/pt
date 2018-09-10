package com.ez.core.response;

import com.ez.core.exception.EzCode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Created by Ez on 2017/12/6.
 */
public class EzResponse {

    private String code;
    private String msg;
    private Object body;

    public EzResponse(String code, String msg , Object body) {
        this.code = code;
        this.msg = msg;
        this.body = body;
    }

    public EzResponse(String code) {
        this.code = code;
    }

    public EzResponse() {

    }

    public static EzResponse newRight() {
        return new EzResponse(EzCode.RIGHT_BASE);
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public Object getBody() {
        return body;
    }

    public void setBody(Object body) {
        this.body = body;
    }
}
