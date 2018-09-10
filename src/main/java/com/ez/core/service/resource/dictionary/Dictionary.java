package com.ez.core.service.resource.dictionary;

import com.ez.core.dao.BaseDao;
import com.ez.core.exp.ExpressionProcessor;
import com.ez.core.service.resource.AbstractConfigurable;
import com.ez.mvc.controller.support.ServiceAdapter;
import com.ez.util.EzStrUtil;

import java.util.*;


public class Dictionary extends AbstractConfigurable {

    private final Map<String, Map<String, Object>> itemsInfo = new HashMap<String, Map<String, Object>>();
    private final Map<String, List<Map<String, Object>>> itemChildren = new HashMap<String, List<Map<String, Object>>>();
    private final List<Map<String, Object>> allItems = new ArrayList<Map<String, Object>>();

    public static final String rootId = "$root";
    public static final String dicIdProp = "id";
    public static final String textProp = "text";
    public static final String leafProp = "leaf";
    public static final String parentIdProp = "parentId";
    public static final String iconClsProp = "iconCls";
    private static final String otherPropPrefix = "@pro_";
    private static final String ropPrefix = "pro_";

    private final String DICTYPE_CUSTOM = "custom";
    private final String DICTYPE_XML = "xml";
    private final String TABLE_XML = "table";


    public Dictionary(String id, Map<String, Object> props) {
        super(id, props);
        init();
    }

    private void init() {

        Map<String, Object> dicConfig = (Map<String, Object>) properties.get("dic");
        String dicType = (String) dicConfig.get("@type");
        if (EzStrUtil.isEmpty(dicType)) {
            return;
        }

        if (DICTYPE_XML.equals(dicType)) {

            loadXmlDic(dicConfig, rootId);
        } else if (DICTYPE_CUSTOM.equals(dicType)) {
            String serviceId = (String) dicConfig.get("@serviceId");
            String actionId = (String) dicConfig.get("@actionId");
            if (EzStrUtil.isEmpty(serviceId) || EzStrUtil.isEmpty(actionId)) {
                return;
            }
            loadCustomDic(serviceId, actionId);
        } else if (TABLE_XML.equals(dicType)) {
            loadTableXml(dicConfig, rootId);
        }

        for (String key : itemsInfo.keySet()) {
            allItems.add(itemsInfo.get(key));
        }

    }

    private void loadTableXml(Map<String, Object> dicConfig, String rootId) {


        String idField = (String) dicConfig.get("@idField");
        String textField = (String) dicConfig.get("@textField");
        String entity = (String) dicConfig.get("@entity");
        String parentIdField = (String) dicConfig.get("@parentIdField");
        if (EzStrUtil.isEmpty(idField) || EzStrUtil.isEmpty(textField) || EzStrUtil.isEmpty(entity)) {
            return;
        }
        String cnd = (String) dicConfig.get("@cnd");
        String order = (String) dicConfig.get("@order");
        List<Map<String, Object>> propList = null;

        Map<String, Object> props = (Map<String, Object>) dicConfig.get("props");
        if (props != null) {
            Object propObj = props.get("prop");
            if (propObj instanceof List) {
                propList = (List<Map<String, Object>>) propObj;
            } else if (propObj instanceof Map) {
                propList = new ArrayList<Map<String, Object>>();
                propList.add((Map<String, Object>) propObj);
            }
        }


        // 通过set去重
        Set<String> fieldSet = new HashSet<String>();
        fieldSet.add(idField + " " + dicIdProp + " ");
        fieldSet.add(textField + " " + textProp + " ");

        boolean haveParentId = EzStrUtil.isEmpty(parentIdField);
        if (!haveParentId) {
            fieldSet.add(parentIdField + " " + parentIdProp + " ");
        }

        if (propList != null) {
            for (Map<String, Object> prop : propList) {
                String fieldName = (String) prop.get("@field");
                fieldSet.add(fieldName + " " + ropPrefix + fieldName + " ");
            }
        }


        StringBuffer sb = new StringBuffer("select ");

        Iterator it = fieldSet.iterator();
        while (it.hasNext()) {
            sb.append(it.next() + " ,");
        }

        sb.deleteCharAt(sb.lastIndexOf(","));

        sb.append(" from ");
        sb.append(entity);

        if (!EzStrUtil.isEmpty(cnd)) {
            String where = ExpressionProcessor.instance().toString(cnd);
            sb.append(" where " + where);
        }

        if (!EzStrUtil.isEmpty(order)) {
            sb.append(" order by " + order);
        }

        List<Map<String, Object>> list = BaseDao.getInstance().queryBySql(sb.toString(), null);

        parseTableListToDic(list, haveParentId);
    }

    private void parseTableListToDic(List<Map<String, Object>> list, boolean haveParentId) {
        if (list == null || list.size() == 0) {
            return;
        }
        for (Map<String, Object> item : list) {
            Object id = item.get(dicIdProp);
            if (id == null) {
                continue;
            }

            itemsInfo.put(id.toString(), item);
        }
        if (!haveParentId) {
            return;
        }
    }

    private void loadCustomDic(String serverId, String actionId) {
        Map<String, Object> resultMap = new HashMap<String, Object>();
        ServiceAdapter.invokeService(serverId, actionId, resultMap);

        Map<String, Map<String, Object>> info = (Map<String, Map<String, Object>>) resultMap.get("itemsInfo");
        Map<String, List<Map<String, Object>>> children = (Map<String, List<Map<String, Object>>>) resultMap.get("itemChildren");
        itemsInfo.putAll(info);
        itemChildren.putAll(children);
    }

    private void loadXmlDic(Map<String, Object> dicConfig, String parentId) {
        Object itemObj = dicConfig.get("item");
        if (itemObj == null) {
            return;
        }
        List<Map<String, Object>> configItems = null;
        if (itemObj instanceof List) {
            configItems = (List<Map<String, Object>>) dicConfig.get("item");
        } else if (itemObj instanceof Map) {
            configItems = new ArrayList<Map<String, Object>>();
            configItems.add((Map<String, Object>) itemObj);
        }

        if (configItems == null) {
            return;
        }
        List<Map<String, Object>> childrenItems = new ArrayList<Map<String, Object>>();

        for (Map<String, Object> configItem : configItems) {
            Map<String, Object> item = new HashMap<String, Object>();
            String id = (String) configItem.get("@id");
            item.put(dicIdProp, id);
            item.put(textProp, configItem.get("@text"));
            item.put(iconClsProp, configItem.get("@iconCls"));
            item.put(parentIdProp, parentId);
            configOtherProp(configItem, item);

            loadXmlDic(configItem, id);

            boolean isLeaf = itemChildren.get(id) == null;
            item.put(leafProp, isLeaf);
            itemsInfo.put(id, item);

            childrenItems.add(item);
        }

        itemChildren.put(parentId, childrenItems);
    }

    private void configOtherProp(Map<String, Object> config, Map<String, Object> item) {
        for (String key : config.keySet()) {
            if (key.startsWith(otherPropPrefix)) {
                item.put(key.substring(1), config.get(key));
            }

        }
    }

    public List<Map<String, Object>> getChildren(String parentId, Map<String, Object> filter) {
        return itemChildren.get(parentId);
    }

    public List<Map<String, Object>> getAllItem() {
        return allItems;
    }

    public String getTextById(String id) {
        Map<String, Object> item = itemsInfo.get(id);
        if (item == null) {
            return null;
        }
        return (String) item.get(textProp);
    }


}
