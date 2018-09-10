package com.ez.core.service.app;

import com.ez.core.service.BaseService;
import com.ez.mvc.controller.support.Constains;
import com.ez.util.EzStrUtil;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by bocao on 2018/1/3.
 */
public class BaseDataService extends BaseService {

    public void querySingleList(Map<String, Object> req, Map<String, Object> res) {
        Integer start = (Integer)req.get("start");
        if(start == null) {
            start = 0;
        }
        if(start < 0) {
            start = 0;
        }
        Integer limit = (Integer)req.get("limit");
        if(limit == null) {
            limit = 25;
        }

        String schemaId = (String)req.get(Constains.SCHEMA_ID);
        List cnd = (List)req.get(Constains.QUERY_CND);

        int total = getDao().singleCount(schemaId, cnd);
        res.put("total", total);
        if(total != 0) {
            List list = getDao().singleFindByPage(schemaId, cnd, limit, start);
            res.put("list", list);
        }
    }

    @Transactional(readOnly = false)
    public void createSingle(Map<String, Object> req, Map<String, Object> res) {

        String schemaId = (String)req.get(Constains.SCHEMA_ID);
        Map<String, Object> body = (Map<String, Object>)req.get(Constains.REQ_BODY);
        Object ret = getDao().saveSingle(schemaId, body);
        res.put("pkey", ret);

    }
    @Transactional(readOnly = false)
    public void removeSingleRecord(Map<String, Object> req, Map<String, Object> res) {

        String schemaId = (String)req.get(Constains.SCHEMA_ID);
        Boolean dr = (Boolean)req.get(Constains.DELETE_REMARK);
        List<Map<String, Object>> body = (List<Map<String, Object>>)req.get(Constains.REQ_BODY);
        Object ret = getDao().removeSingle(schemaId, body, dr);
        res.put("num", ret);

    }

    @Transactional(readOnly = true)
    public void loadSingle(Map<String, Object> req, Map<String, Object> res) {
        String schemaId = (String)req.get(Constains.SCHEMA_ID);
        Object pkey = req.get(Constains.TABLE_PKEY);
        if(EzStrUtil.isEmpty(schemaId) || pkey == null) {
            return;
        }

        Object record = getDao().loadSingleBySchemaAndPkey(schemaId, (Serializable)pkey);
        res.put("record", record);
    }

    @Transactional(readOnly = false)
    public void updateSingle(Map<String, Object> req, Map<String, Object> res) {
        String schemaId = (String)req.get(Constains.SCHEMA_ID);
        Map<String, Object> body = (Map<String, Object>)req.get(Constains.REQ_BODY);
        Object ret = getDao().updateSingle(schemaId, body);
    }

}
