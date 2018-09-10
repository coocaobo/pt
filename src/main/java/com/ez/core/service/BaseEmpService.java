package com.ez.core.service;

import com.ez.core.server.CacheStore;
import com.ez.core.server.ICacheServer;
import org.apache.log4j.Logger;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Ez on 2017/12/6.
 */
public class BaseEmpService extends BaseService implements ICacheServer {

    private final static Logger logger = Logger.getLogger(BaseEmpService.class);

    private final String TABLE_NAME = "BASE_EMPLOYEE";

    public String getTableName() {
        return TABLE_NAME;
    }

    public Map<String, Object> loadDb(String empId) {
        Map<String, Object> params = new HashMap<String, Object>(1);
        params.put("EMPID", Long.parseLong(empId));
        List<Map<String, Object>> list = getDao().queryByHql("from " + TABLE_NAME + " a where a.EMPID =:EMPID and a.DR = '0'", params);
        if(list == null || list.size() != 1) {
            logger.error("获取用户信息错误：" + empId);
            return null;
        }
        return list.get(0);
    }

    public Map<String, Object> loadCache(String id) {
        return CacheStore.load(this, id);
    }
}
