package com.ez.core.service;

import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/12/22.
 */
public interface ILogOn {

    public Map<String, Object> doLogon(String uid, String pwd);

    Map<String,Object> getUserLogonInfo();
}
