package com.ez.core.server;

import com.ez.core.server.EzContextHolder;
import com.ez.mvc.controller.support.Constains;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Ez on 2017/12/7.
 */
public final class EzThreadLocal {
    public static final String SESSION_ID = "$SESSION";
    public static final String REQUEST_TIME = "$REQUEST_TIME";
    public static final String REQUEST_URL = "$REQUEST_URL";
    private static ThreadLocal<Map<String, Object>> context = new ThreadLocal<Map<String, Object>>();
    private static ThreadLocal<Map<String, Object>> localInfo = new ThreadLocal<Map<String, Object>>();


    private static Object get(String key) {
        Map<String, Object> map = context.get();
        if(map == null) {
            return null;
        }
        return map.get(key);
    }

    private static void set(String key, Object obj) {
        Map<String, Object> params = context.get();
        if(params == null) {
            params = new HashMap<String, Object>();
            context.set(params);
        }
        params.put(key, obj);
    }

    public static void clear() {
        context.remove();
        localInfo.remove();
    }

    public static boolean setSessionInfo(String key, Object obj) {
        HttpSession ss = (HttpSession)get(SESSION_ID);
        if(ss == null) {
            return false;
        }
        ss.setAttribute(key, obj);
        return true;
    };

    public static Object getSessionInfo(String key) {
        HttpSession ss = (HttpSession)get(SESSION_ID);
        if(ss == null) {
            return null;
        }
        return ss.getAttribute(key);
    };

    public static boolean setSession(HttpSession newSS) {
        HttpSession oldSS = (HttpSession)get(SESSION_ID);
        if(oldSS != null) {
            return false;
        }
        set(SESSION_ID, newSS);
        return true;
    };
    public static HttpSession getSession() {
        HttpSession oldSS = (HttpSession)get(SESSION_ID);
        return oldSS;
    }

    public static Object getLocalInfo(String key) {
        Map<String, Object> params = localInfo.get();
        if(params == null) {
            return null;
        }
        return params.get(key);
    }

    public static void setLocalInfo(String key, Object obj) {
        Map<String, Object> params = localInfo.get();
        if(params == null) {
            params = new HashMap<String, Object>();
            localInfo.set(params);
        }
        params.put(key, obj);
    }

    public static String getUid() {
        Map<String, Object> userInfo = (Map<String, Object>)getSessionInfo(Constains.SESSION_USERINFO);
        if(userInfo == null) {
            return null;
        }

        Map<String, Object> empInfo = (Map<String, Object>) userInfo.get(Constains.SESSION_EMPINFO);
        if(empInfo == null) {
            return null;
        }
        Object empId = empInfo.get("EMPID");
        if(empId == null) {
            return null;
        }
        return empId.toString();

    }


}
