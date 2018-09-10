package com.ez.core.server.dic;

import com.ez.core.dao.BaseDao;
import com.ez.core.dao.IDao;
import com.ez.core.service.EzService;
import com.ez.core.service.resource.dictionary.Dictionary;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2018/1/11.
 */
public class MenuDicServer implements EzService {

    private final String appSchemaId = "base.App";
    private final String catalogSchemaId = "base.Catalog";
    private final String menuSchemaId = "base.Menu";
    private final String buttonSchemaId = "base.Action";

    private final String appCls = "ez-menu-tree-app-lev1";
    private final String catalogCls = "ez-menu-tree-app-lev2";
    private final String menuCls = "ez-menu-tree-app-lev3";
    private final String buttonCls = "ez-menu-tree-app-lev4";

    private final String profix_app = "a_";
    private final String profix_catalog = "c_";
    private final String profix_menu = "m_";
    private final String profix_button = "b_";


    public void allMenu(Map<String, Object> resultObj) {
        IDao dao = BaseDao.getInstance();

        List<Map<String, Object>> appList = dao.singleFindByPage(appSchemaId, null, null, null);
        List<Map<String, Object>> catalogList = dao.singleFindByPage(catalogSchemaId, null, null, null);
        List<Map<String, Object>> menuList = dao.singleFindByPage(menuSchemaId, null, null, null);
        List<Map<String, Object>> buttonList = dao.singleFindByPage(buttonSchemaId, null, null, null);

        final Map<String, Map<String, Object>> itemsInfo = new HashMap<String, Map<String, Object>>();
        final Map<String, List<Map<String, Object>>> itemChildren = new HashMap<String, List<Map<String, Object>>>();

        for (Map<String, Object> app : appList) {
            String id = profix_app + app.get("APPID").toString();
            String text = app.get("APPNAME").toString();

            Map<String, Object> item = new HashMap<String, Object>();
            item.put(Dictionary.dicIdProp, id);
            item.put(Dictionary.textProp, text);
            item.put(Dictionary.leafProp, true);
            item.put(Dictionary.parentIdProp, Dictionary.rootId);
            item.put(Dictionary.iconClsProp, appCls);

            itemsInfo.put(id, item);

            addChildren(itemChildren, Dictionary.rootId, item);
        }

        for (Map<String, Object> app : catalogList) {

            String id = profix_catalog + app.get("CATID").toString();
            String text = app.get("CATNAME").toString();
            String pId = profix_app + app.get("APPID").toString();

            Map<String, Object> item = new HashMap<String, Object>();
            item.put(Dictionary.dicIdProp, id);
            item.put(Dictionary.textProp, text);
            item.put(Dictionary.leafProp, true);
            item.put(Dictionary.parentIdProp, pId);
            item.put(Dictionary.iconClsProp, catalogCls);

            Map<String, Object> parentItem = itemsInfo.get(pId);
            if (parentItem != null) {
                parentItem.put(Dictionary.leafProp, false);
            }

            itemsInfo.put(id, item);

            addChildren(itemChildren, pId, item);

        }

        for (Map<String, Object> app : menuList) {

            String id = profix_menu + app.get("MENUID").toString();
            String text = app.get("MENUNAME").toString();
            String pId = profix_catalog + app.get("CATID").toString();

            Map<String, Object> item = new HashMap<String, Object>();
            item.put(Dictionary.dicIdProp, id);
            item.put(Dictionary.textProp, text);
            item.put(Dictionary.leafProp, true);
            item.put(Dictionary.parentIdProp, pId);

            item.put(Dictionary.iconClsProp, menuCls);

            Map<String, Object> parentItem = itemsInfo.get(pId);
            if (parentItem != null) {
                parentItem.put(Dictionary.leafProp, false);
            }

            itemsInfo.put(id, item);

            addChildren(itemChildren, pId, item);
        }


        for (Map<String, Object> button : buttonList) {

            String id = profix_button + button.get("ACTIONID").toString();
            String text = button.get("ACTIONNAME").toString();
            String pId = profix_menu + button.get("MENUID").toString();

            Map<String, Object> item = new HashMap<String, Object>();
            item.put(Dictionary.dicIdProp, id);
            item.put(Dictionary.textProp, text);
            item.put(Dictionary.leafProp, true);
            item.put(Dictionary.parentIdProp, pId);

            item.put(Dictionary.iconClsProp, buttonCls);

            Map<String, Object> parentItem = itemsInfo.get(pId);
            if (parentItem != null) {
                parentItem.put(Dictionary.leafProp, false);
            }
            itemsInfo.put(id, item);

            addChildren(itemChildren, pId, item);
        }


        resultObj.put("itemsInfo", itemsInfo);
        resultObj.put("itemChildren", itemChildren);
    }

    private void addChildren( Map<String, List<Map<String, Object>>> itemChildren, String pid, Map<String, Object> item) {
        List<Map<String, Object>> childrenList = itemChildren.get(pid);
        if(childrenList == null) {
            childrenList = new ArrayList<Map<String, Object>>();
            itemChildren.put(pid, childrenList);
        }
        childrenList.add(item);
    }
}
