package com.ez.core.service;

import com.ez.core.exception.BusiException;
import com.ez.core.exception.EzCode;
import com.ez.core.server.EzThreadLocal;
import com.ez.mvc.controller.support.Constains;
import lombok.Setter;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/12/22.
 */
public class LogonService implements ILogOn {

    @Setter
    private BaseDeptService baseDeptService;
    @Setter
    private BaseEmpService baseEmpService;
    @Setter
    private BaseRolePermissionService baseRolePermissionService;
    @Setter
    private BaseRoleService baseRoleService;
    @Setter
    private BaseUserRoleService baseUserRoleService;
    @Setter
    private BaseUserService baseUserService;


    public Map<String, Object> doLogon(String logonId, String pwd) {

        Map<String, Object> user = baseUserService.loadOne(logonId);
        if (user == null) {
            throw new BusiException(EzCode.ERROR_LOGON_NOTFOUND, "用户不存在");
        }

        if (!pwd.equals(user.get("PASSWORD"))) {
            throw new BusiException(EzCode.ERROR_LOGON_PWD, "密码不正确");
        }

        List<Map<String, Object>> roleList = baseUserRoleService.getUserRole(logonId);
        if (roleList == null || roleList.size() == 0) {
            throw new BusiException(EzCode.ERROR_LOGON_NOROLE, "用户没有权限");
        }

        user.put(Constains.SESSION_USERINFO_ROLELIST, formatRoleInfo(roleList));
        return user;
    }

    public Map<String, Object> getUserLogonInfo() {
        Map<String, Object> userInfo = (Map<String, Object>) EzThreadLocal.getSessionInfo(Constains.SESSION_USERINFO);
        if(userInfo == null) {
            throw new BusiException(EzCode.ERROR_LOGON_NOTLOGON, "用户未登录，无法获取信息");
        }
        Map<String, Object> logonInfo = (Map<String, Object>)userInfo.get(Constains.SESSION_LOGONINFO);
        if(logonInfo == null) {
            throw new BusiException(EzCode.ERROR_LOGON_NOTLOGON, "用户未登录，无法获取信息");
        }

        String roleID = (String)logonInfo.get(Constains.LOGON_ROLEID);
        if(roleID == null) {
            throw new BusiException(EzCode.ERROR_LOGON_NOTLOGON, "用户没有选择角色信息，无法获取信息");
        }
        Long empId = (Long)logonInfo.get(Constains.LOGON_EMPID);

        userInfo.put(Constains.SESSION_EMPINFO, baseEmpService.loadCache(empId.toString()));
        userInfo.put(Constains.SESSION_APPINFO, baseRolePermissionService.loadCache(roleID));
        return userInfo;
    }

    private List<Map<String, Object>> formatRoleInfo(List<Map<String, Object>> roleList) {
        List<Map<String, Object>> ret = new ArrayList<Map<String, Object>>(roleList.size());
        for (Map<String, Object> role : roleList) {
            Long roleId = (Long) role.get("ROLEID");

            Map<String, Object> baseRole = baseRoleService.loadCache(""+roleId);

            Map<String, Object> tmp = new HashMap<String, Object>(2);
            tmp.put("roleId", roleId);
            tmp.put("roleName", baseRole.get("ROLENAME"));
            ret.add(tmp);
        }
        return ret;
    }

}
