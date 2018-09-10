package com.ez.core.service;

import com.ez.core.server.CacheStore;
import com.ez.core.server.ICacheServer;
import org.apache.log4j.Logger;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Ez on 2017/12/6.
 */
public class BaseMenuPropService extends BaseService implements ICacheServer {

    private final static Logger logger = Logger.getLogger(BaseMenuPropService.class);

    private final String TABLE_NAME = "BASE_MENUPROP";

    public String getTableName() {
        return TABLE_NAME;
    }

    public Map<String, Object> loadDb(String menuId) {

        List<Map<String, Object>> list = getDao().findAll(TABLE_NAME, "MENUID", Long.parseLong(menuId));
        Map<String, Object> ret = new HashMap<String, Object>(1);
        ret.put("props", list);
        return ret;
    }

    public Map<String, Object> loadCache(String menuId) {
        return CacheStore.load(this, menuId);
    }
}
