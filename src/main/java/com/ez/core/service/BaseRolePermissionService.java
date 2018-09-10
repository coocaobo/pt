package com.ez.core.service;

import com.ez.core.server.CacheStore;
import com.ez.core.server.ICacheServer;
import com.ez.mvc.controller.support.Constains;
import lombok.Setter;
import org.apache.log4j.Logger;

import java.util.*;

/**
 * Created by Ez on 2017/12/6.
 */
public class BaseRolePermissionService extends BaseService implements ICacheServer {

    private final static Logger logger = Logger.getLogger(BaseEmpService.class);

    private final String TABLE_NAME = "BASE_ROLEPERMISSION";

    @Setter
    private BaseAppService baseAppService;
    @Setter
    private BaseAppCatalogService baseAppCatalogService;
    @Setter
    private BaseAppCatalogMenuService baseAppCatalogMenuService;
    @Setter
    private BaseAppCatalogMenuActionService baseAppCatalogMenuActionService;

    public String getTableName() {
        return TABLE_NAME;
    }

    public Map<String, Object> loadDb(String roldId) {
        List<Map<String, Object>> list = getDao().findAll(TABLE_NAME, "ROLEID", Long.parseLong(roldId));
        list = formatPermissionDetail(list);
        Map<String, Object> ret = new HashMap<String, Object>(1);
        ret.put(roldId, list);
        return ret;
    }

    /**
     * 01： APP
     * 02: CATALOG
     * 03: MENU
     * 04: ACTION
     *
     * @param list
     */
    private List<Map<String, Object>> formatPermissionDetail(List<Map<String, Object>> list) {
        if (list == null) {
            return null;
        }
        Map<String, Map<String, Object>> appTmp = new HashMap<String, Map<String, Object>>();
        Map<String, Map<String, Object>> catlogTmp = new HashMap<String, Map<String, Object>>();
        Map<String, Map<String, Object>> menuTmp = new HashMap<String, Map<String, Object>>();
        Map<String, Map<String, Object>> actionTmp = new HashMap<String, Map<String, Object>>();

        List<Map<String, Object>> ret = new ArrayList<Map<String, Object>>();
        for (Map<String, Object> per : list) {
            String type = (String) per.get(Constains.PERMISSION_TYPE);
            Long lAppId = (Long) per.get(Constains.PERMISSION_APPID);
            String appId = "" + lAppId;

            if (type.equals("01")) {
                Map<String, Object> app = baseAppService.loadCache(appId);
                per.put(Constains.PERMISSION_APPDETAIL, app);
                appTmp.put(""+appId, app);
                ret.add(per);
                continue;
            }
            if (type.equals("02")) {
                Map<String, Object> app = baseAppCatalogService.loadCache(appId);
                per.put(Constains.PERMISSION_APPDETAIL, app);
                catlogTmp.put(appId, app);
                continue;
            }
            if (type.equals("03")) {
                Map<String, Object> app = baseAppCatalogMenuService.loadCache(appId);
                per.put(Constains.PERMISSION_APPDETAIL, app);
                menuTmp.put(appId, app);
                continue;
            }
            if (type.equals("04")) {
                Map<String, Object> app = baseAppCatalogMenuActionService.loadCache(appId);
                per.put(Constains.PERMISSION_APPDETAIL, app);
                actionTmp.put(appId, app);
                continue;
            }

        }
        generalTreeArch(actionTmp, menuTmp, "MENUID");
        generalTreeArch(menuTmp, catlogTmp, "CATID");
        generalTreeArch(catlogTmp, appTmp, "APPID");
        return ret;
    }

    private void generalTreeArch(Map<String, Map<String, Object>> childrenMap, Map<String, Map<String, Object>> parentMap, String parentField) {
        for (String key : childrenMap.keySet()) {
            String parentId = "" + childrenMap.get(key).get(parentField);
            if (!parentMap.containsKey(parentId)) {
                continue;
            }
            Map<String, Object> parent = parentMap.get(parentId);
            Set<Map<String, Object>> children = (Set<Map<String, Object>>) parent.get("children");
            if (children == null) {
                children = new HashSet<Map<String, Object>>();
                parent.put("children", children);
            }
            children.add(childrenMap.get(key));
        }
    }

    public Map<String, Object> loadCache(String roldId) {
        return CacheStore.load(this, roldId);
    }
}
