package com.ez.core.service;

import com.ez.core.server.CacheStore;
import com.ez.core.server.ICacheServer;
import lombok.Setter;
import org.apache.log4j.Logger;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Ez on 2017/12/6.
 */
public class BaseAppCatalogMenuService extends BaseService implements ICacheServer {

    @Setter
    private BaseMenuPropService baseMenuPropService;

    private final static Logger logger = Logger.getLogger(BaseAppCatalogMenuService.class);

    private final String TABLE_NAME = "BASE_MENU";

    public String getTableName() {
        return TABLE_NAME;
    }

    public Map<String, Object> loadDb(String menuId) {
        Map<String, Object> menu = loadOne(Long.parseLong(menuId));
        if(menu != null) {
            menu.put("prop", baseMenuPropService.loadCache(menuId));
        }
       return menu;
    }

    public Map<String, Object> loadCache(String id) {
        return CacheStore.load(this, id);
    }
}
