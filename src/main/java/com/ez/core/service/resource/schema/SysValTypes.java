package com.ez.core.service.resource.schema;

import com.ez.core.server.EzThreadLocal;
import com.ez.mvc.controller.support.Constains;
import com.ez.util.EzStrUtil;
import com.ez.util.PyConverter;

import javax.servlet.http.HttpSession;
import java.util.Date;
import java.util.Map;


public class SysValTypes {

    private static String DateNow = "d_now";
    private static String PY = "s_py_";
    private static String CurrentUserId = "s_uid_now";
    private static String CurrentRequestIp = "s_uip";


    public static Object getValue(String type, Map<String, Object> rec) {
        if (EzStrUtil.isEmpty(type)) {
            return null;
        }
        if(type.startsWith(PY)) {
            String fromFieldName = type.substring(5);
            String fromValue = (String)rec.get(fromFieldName);
            if(fromValue == null) {
                return null;
            }
            return PyConverter.getFirstLetter(fromValue);

        }

        if (type.equals(DateNow)) {

            return new Date();
        }

        if(type.equals(CurrentUserId)) {
            return EzThreadLocal.getUid();
        }

        if(type.equals(CurrentRequestIp)) {
            return EzThreadLocal.getLocalInfo(Constains.USER_REQUEST_IP);
        }
        return null;
    }

}
