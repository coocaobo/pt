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
public class BaseAppService extends BaseService implements ICacheServer {

    private final static Logger logger = Logger.getLogger(BaseAppService.class);

    private final String TABLE_NAME = "BASE_APP";

    public String getTableName() {
        return TABLE_NAME;
    }

    public Map<String, Object> loadDb(String appId) {
        return loadOne(Long.parseLong(appId));
    }

    public Map<String, Object> loadCache(String id) {
        return CacheStore.load(this, id);
    }
}
