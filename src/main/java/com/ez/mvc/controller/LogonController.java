package com.ez.mvc.controller;

import com.ez.core.exception.*;
import com.ez.core.response.EzResponse;
import com.ez.core.server.EzThreadLocal;
import com.ez.core.service.ILogOn;
import com.ez.core.service.resource.boot.BootService;
import com.ez.mvc.controller.support.Constains;
import com.ez.util.EzStrUtil;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/12/22.
 */
@Controller
public class LogonController {
    Logger log = Logger.getLogger(LogonController.class);

    @Autowired
    private ILogOn logonService;
    /**
     * 登录操作，正确时候，返回该用户的所有的角色，错误时返回相应的错误提示
     *
     * @param request
     * @param response
     * @return
     */
    @RequestMapping(value = "logon.logon")
    @ResponseBody
    public EzResponse logon(HttpServletRequest request, HttpServletResponse response) {
        EzResponse ezRes = EzResponse.newRight();
        try {
            String uid = (String) request.getParameter(Constains.LOGON_UID);
            String pwd = (String) request.getParameter(Constains.LOGON_PWD);
            if(EzStrUtil.isEmpty(uid) || EzStrUtil.isEmpty(pwd) ) {
                ezRes.setCode(EzCode.ERROR_LOGON_PARAMS);
                ezRes.setMsg("用户名或密码不能为空");
                return ezRes;
            }
            Map<String, Object> userInfo =logonService.doLogon(uid, pwd);

            ezRes.setBody(userInfo.get(Constains.SESSION_USERINFO_ROLELIST));
            Map<String, Object> sessionInfo = new HashMap<String, Object>();
            sessionInfo.put(Constains.SESSION_LOGONINFO, userInfo);
            EzThreadLocal.setSessionInfo(Constains.SESSION_USERINFO, sessionInfo);
        } catch (BaseException e) {
            log.error(e);
            e.printStackTrace();
            ezRes.setCode(e.getErrCode());
            ezRes.setMsg(e.getMessage());
        } catch (Exception e) {
            log.error(e);
            e.printStackTrace();
            ezRes.setCode(EzCode.ERROR_SERVER_UNCATCH);
            ezRes.setMsg(e.getMessage());
        }
        return ezRes;
    }

    @RequestMapping(value = "logoff.logon")
    @ResponseBody
    public EzResponse logoff(HttpServletRequest request, HttpServletResponse response) {
        EzResponse ezRes = EzResponse.newRight();
        HttpSession ss = EzThreadLocal.getSession();
        Enumeration names = ss.getAttributeNames();
        while (names.hasMoreElements()) {
            ss.removeAttribute((String) names.nextElement());
        }
        return ezRes;
    }

    /**
     * 根据角色内容获取角色对应的应用信息
     * 包括有，系统的全局信息，
     * 用户信息，
     * 菜单信息
     *
     * @param request
     * @param response
     * @return
     */
    @RequestMapping(value = "app.logon")
    @ResponseBody
    public EzResponse loadApp(HttpServletRequest request, HttpServletResponse response) {
        EzResponse ezRes = EzResponse.newRight();
        try {
            String roleId = (String) request.getParameter(Constains.LOGON_ROLEID);
            Map<String, Object> userInfo = (Map<String, Object>)EzThreadLocal.getSessionInfo(Constains.SESSION_USERINFO);
            if(userInfo == null) {
                throw new BusiException(EzCode.ERROR_LOGON_NOTLOGON, "用户未登录，无法获取信息");
            }
            Map<String, Object> logonInfo = (Map<String, Object>)userInfo.get(Constains.SESSION_LOGONINFO);
            if(logonInfo == null) {
                throw new BusiException(EzCode.ERROR_LOGON_NOTLOGON, "用户未登录，无法获取信息");
            }

            if(!EzStrUtil.isEmpty(roleId)) {
//                TODO  完善校验信息，判断请求的角色信息是否是该用户拥有的角色
//                userInfo.get(Constains.SESSION_USERINFO_ROLELIST);
                logonInfo.put(Constains.LOGON_ROLEID, roleId);
            }

            Map<String, Object> fullUserInfo = logonService.getUserLogonInfo();
            Map<String, Object> body = new HashMap<String, Object>();
            body.putAll(fullUserInfo);
            body.put(Constains.SYSTEM_INFO, BootService.instance().defaultBoot().getProperty());
            body.put(Constains.SYSTEM_DATA, System.currentTimeMillis());
            ezRes.setBody(body);
        } catch (BusiException e) {
            log.error(e);
            ezRes.setCode(e.getErrCode());
            ezRes.setMsg(e.getMessage());
            e.printStackTrace();
        } catch (ServiceException e) {
            log.error(e);
            ezRes.setCode(e.getErrCode());
            ezRes.setMsg(e.getMessage());
            e.printStackTrace();
        } catch (ServerException e) {
            log.error(e);
            ezRes.setCode(e.getErrCode());
            ezRes.setMsg(e.getMessage());
            e.printStackTrace();
        } catch(Exception e) {
            log.error(e);
            ezRes.setCode(EzCode.ERROR_SERVER_UNCATCH);
            ezRes.setMsg(e.getMessage());
            e.printStackTrace();
        }
        return ezRes;
    }


    public ILogOn getLogonService() {
        return logonService;
    }

    public void setLogonService(ILogOn logonService) {
        this.logonService = logonService;
    }
}
