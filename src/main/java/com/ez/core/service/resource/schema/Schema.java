package com.ez.core.service.resource.schema;

import com.ez.core.exp.ExpressionProcessor;
import com.ez.core.service.resource.AbstractConfigurable;
import com.ez.core.service.resource.dictionary.DicService;
import com.ez.util.EzStrUtil;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;


/**
 * schema 文件中通过type来定义grid和form的类型，默认为string
 * 分别为：
 * string 默认为string
 * stringBig: 对应 textareafield内容
 * int
 * long     -- 保存时需要转换为Long                  需要转换 i2l
 * number  -- 保存时需要转换为BigDecimail            需要转换 o2bd
 * date    -- 保存时需要转换为 Date                  需要转换 s2d
 * <p>
 * <p>
 * <p>
 * display: 0 都不显示， 1,只显示list， 2.只显示form， 3.list和form全部显示，默认为3
 * <p>
 * updable: 1: 可以被修改，0 不能被修改，默认为1
 * <p>
 * allowBlank: 1： 可以为空，0，不能为空，默认为1
 * <p>
 * renderer： 在列表中制定可以自定义被显示
 * <p>
 * maxLength： 在表单中的最大长度
 * <p>
 * defaultValue: 默认值, 如果是‘%_’开始的那么就是需要由数据库自动生成的默认值，“%_s_0” 表示有系统生成为String的字符“0"
 * <p>
 * disable: 1: 不能被修改，0: 可以被修改
 * <p>
 * format: 显示格式
 * <p>
 * dicId: 字典Id
 * <p>
 * flex: 数字
 * <p>
 * vtype: 表单的输入格式化
 * createSysVal: 仅仅是在创建的收需要系统创建的字段
 * rendererFormat: 列表格式化的参数
 * minValue: 数字最小值
 * minValue 数字最大值
 * seach： 1： 可以进行过滤查找，默认为0
 * groupText: 有的时候需要按照该内容进行grid的二级分组，需要多个item有相同的值
 */
public class Schema extends AbstractConfigurable {
    private final Map<String, String> sqlCollect = new ConcurrentHashMap<String, String>();

    private static final Map<String, String> PARSE_TYPES = new HashMap<String, String>();

    static {
        PARSE_TYPES.put("long", "i2l");
        PARSE_TYPES.put("number", "o2bd");
        PARSE_TYPES.put("date", "s2d");
    }

    private String mainTableName;
    private String pkey;
    private String order = "";
    private Set<String> needUpdateField = new HashSet<String>();
    private Map<String, String> needGeneralBySys = new HashMap<String, String>();
    private Map<String, String> dicConver = new HashMap<String, String>();
    private Map<String, String> createSysValField = new HashMap<String, String>();

    private Map<String, String> needParseField = new HashMap<String, String>();

    public Schema(String id, Map<String, Object> props) {
        super(id, props);
        init();
    }


    private void init() {
        Map<String, Object> entry = (Map<String, Object>) properties.get("entry");
        List<Map<String, Object>> items = (List<Map<String, Object>>) entry.get("item");

        String entityName = (String) entry.get("@entityName");
        this.mainTableName = entityName;

        String order = (String) entry.get("@order");
        if (!EzStrUtil.isEmpty(order)) {
            this.order = " order by " + order;
        }

        for (Map<String, Object> item : items) {
            String id = (String) item.get("@id");

            String isPkey = (String) item.get("@pkey");
            if (pkey == null && "true".equals(isPkey)) {
                pkey = id;
            }
            //需要转换的字段
            String type = (String) item.get("@type");
            if (!EzStrUtil.isEmpty(type) && PARSE_TYPES.containsKey(type)) {
                needParseField.put(id, PARSE_TYPES.get(type));
            }

            // 需要更新的字段
            String displayType = (String) item.get("@display");
            if (!id.equals(pkey)) {
                if (EzStrUtil.isEmpty(displayType) || "0".equals(displayType) || "2".equals(displayType) || "3".equals(displayType)) {
                    needUpdateField.add(id);
                }
            }

            // 需要由系统生成的字段
            String defaultValue = (String) item.get("@defaultValue");
            if (!EzStrUtil.isEmpty(defaultValue) && defaultValue.startsWith("%_")) {
                needGeneralBySys.put(id, defaultValue.substring(2));
            }

            // 需要进行字典转换
            String isDic = (String) item.get("@dicId");
            if (!EzStrUtil.isEmpty(isDic)) {
                dicConver.put(id, isDic);
            }

            String createSysVal = (String) item.get("@createSysVal");
            if (!EzStrUtil.isEmpty(createSysVal)) {
                createSysValField.put(id, createSysVal);
            }

        }
    }

    public String getPkey() {
        return pkey;
    }

    private void setSql(String type, String sql) {
        sqlCollect.put(type, sql);
    }

    private String getSql(String type) {
        return sqlCollect.get(type);
    }

    public String getMainTable() {
        return mainTableName;
    }

    private Map<String, String> getNeedparseField() {
        return needParseField;
    }

    public String generalSingleCountHql(List<Object> cnd) {
        String hql = getSql("SingleCountHql");
        String where = "";
        if (cnd != null && cnd.size() > 0) {
            where = " where " + ExpressionProcessor.instance().toString(cnd);
        }
        if (hql != null) {
            return hql + where;
        }

        Map<String, Object> entry = (Map<String, Object>) properties.get("entry");

        String entityName = getMainTable();

        hql = "select count(1) from " + entityName;

        setSql("SingleCountHql", hql);

        return hql + where;
    }


    public String generalSingleHql(List<Object> cnd) {
        String where = "";
        if (cnd != null && cnd.size() > 0) {
            where = " where " + ExpressionProcessor.instance().toString(cnd);
        }

        String hql = getSql("SingleHql");
        if (hql != null) {
            StringBuffer sb = new StringBuffer(hql);
            if (!EzStrUtil.isEmpty(where)) {
                sb.append(where);
            }
            if (!EzStrUtil.isEmpty(order)) {
                sb.append(order);
            }
            return sb.toString();
        }

        Map<String, Object> entry = (Map<String, Object>) properties.get("entry");

        String entityName = getMainTable();

        hql = "select * from " + entityName;

        setSql("SingleHql", hql);


        StringBuffer sb = new StringBuffer(hql);
        if (!EzStrUtil.isEmpty(where)) {
            sb.append(where);
        }
        if (!EzStrUtil.isEmpty(order)) {
            sb.append(order);
        }
        return sb.toString();
    }

    public void parseRecord(Map<String, Object> rec) {
        this.parseRecord(rec, false);
    }
    public void parseRecord(Map<String, Object> rec, boolean isCreate) {
        if (rec == null || rec.size() == 0) {
            return;
        }
        Map<String, String> parseFields = getNeedparseField();

        if (parseFields == null || parseFields.size() == 0) {
            return;
        }

        for (String key : parseFields.keySet()) {
            Object v = rec.get(key);
            if (v == null) {
                continue;
            }
            String type = (String) parseFields.get(key);
            if (type == null) {
                continue;
            }

            Object parVal = DataTypes.toTypeValue(type, v);
            rec.put(key, parVal);
        }

        // 增加在创建时需要系统创建的默认值
        if(isCreate && createSysValField.size() > 0) {

            for (String key : createSysValField.keySet()) {
             Object val = SysValTypes.getValue(createSysValField.get(key), rec);
                rec.put(key, val);
            }
        }


    }

    public String generalRemvoeByDrHql() {
        String hql = getSql("RemvoeByDrHql");
        if (hql != null) {
            return hql;
        }
        StringBuffer sb = new StringBuffer();

        hql = sb.append("update ").append(getMainTable()).append(" set ").append(" DR=:DR ").append(" where ").append(this.pkey).append("=:").append(this.pkey).toString();
        setSql("RemvoeByDrHql", hql);
        return hql;

    }

    public String generalSingleUpdateHql() {

        String hql = getSql("SingleUpdateHql");
        if (hql != null) {
            return hql;
        }
        StringBuffer sb = new StringBuffer();

        sb.append("update ").append(getMainTable()).append(" set ");

        for (String field : needUpdateField) {
            sb.append(field).append("=:").append(field).append(",");
        }
        ;
        sb.deleteCharAt(sb.lastIndexOf(","));
        sb.append(" where ").append(this.pkey).append("=:").append(this.pkey);
        hql = sb.toString();
        setSql("SingleUpdateHql", hql);
        return hql;
    }

    public void formatDic(List<Map<String, Object>> ret) {
        if (dicConver.size() == 0) {
            return;
        }
        for (Map<String, Object> rec : ret) {
            for (String itemId : dicConver.keySet()) {
                Object val = rec.get(itemId);
                if (val == null) {
                    continue;
                }
                String dicId = dicConver.get(itemId);
                String text = DicService.instance().get(dicId).getTextById(val.toString());
                rec.put(itemId + "_text", text);
            }
        }

    }
}
