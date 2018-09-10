package com.ez.core.servlet.listener;

import com.ez.core.server.EzThreadLocal;
import com.ez.mvc.controller.support.Constains;
import org.apache.log4j.Logger;

import javax.servlet.ServletRequest;
import javax.servlet.ServletRequestEvent;
import javax.servlet.ServletRequestListener;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * Created by Administrator on 2017/12/26.
 */
public class EzRequestListener implements ServletRequestListener {

    private final static Logger logger = Logger.getLogger(EzRequestListener.class);

    public void requestDestroyed(ServletRequestEvent event) {

        Long beginTime = (Long) EzThreadLocal.getLocalInfo(EzThreadLocal.REQUEST_TIME);
        StringBuffer url = (StringBuffer) EzThreadLocal.getLocalInfo(EzThreadLocal.REQUEST_URL);
        Long endTime = System.currentTimeMillis();
        logger.info("Cost time: [" + (endTime - beginTime) + "] ms ");
//        logger.info(EzThreadLocal.getSessionInfo(Constains.SESSION_USERINFO));
        EzThreadLocal.clear();
    }

    public void requestInitialized(ServletRequestEvent event) {
        ServletRequest request = event.getServletRequest();
        HttpSession session = ((HttpServletRequest) request).getSession(true);
        EzThreadLocal.setSession(session);
        EzThreadLocal.setLocalInfo(EzThreadLocal.REQUEST_TIME, System.currentTimeMillis());
        EzThreadLocal.setLocalInfo(Constains.USER_REQUEST_IP, request.getRemoteAddr());
//        EzThreadLocal.setLocalInfo(EzThreadLocal.REQUEST_URL, ((HttpServletRequest) request).getRequestURL());
    }
}
