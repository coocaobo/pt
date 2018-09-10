package com.ez.core.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Ez on 2017/12/6.
 */
public class BaseUserRoleService extends BaseService{

    private final String TABLE_NAME = "BASE_USERROLE";

    public String getTableName() {
        return TABLE_NAME;
    }

    public List<Map<String, Object>> getUserRole(String logonId) {
        return getDao().findAll(TABLE_NAME, "LOGONID", logonId);
    }

}
