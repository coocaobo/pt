package com.ez.core.service;

import com.ez.core.server.CacheStore;
import com.ez.core.server.ICacheServer;
import org.apache.log4j.Logger;

import java.util.Map;

/**
 * Created by Ez on 2017/12/6.
 */
public class BaseRoleService extends BaseService implements ICacheServer {
    private static Logger logger = Logger.getLogger(BaseRoleService.class);

    private final String TABLE_NAME = "BASE_ROLE";

    public String getTableName() {
        return TABLE_NAME;
    }

    public Map<String, Object> loadDb(String id) {
        return this.loadOne(Long.parseLong(id));
    }

    public Map<String, Object> loadCache(String id) {
        return CacheStore.load(this, id);
    }

}
