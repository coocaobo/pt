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
public class BaseAppCatalogMenuActionService extends BaseService implements ICacheServer {

    private final static Logger logger = Logger.getLogger(BaseAppCatalogMenuActionService.class);

    private final String TABLE_NAME = "BASE_ACTION";

    public String getTableName() {
        return TABLE_NAME;
    }

    public Map<String, Object> loadDb(String actionId) {
        return loadOne(Long.parseLong(actionId));
    }

    public Map<String, Object> loadCache(String id) {
        return CacheStore.load(this, id);
    }
}
