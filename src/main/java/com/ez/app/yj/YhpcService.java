package com.ez.app.yj;

import com.ez.core.dao.BaseDao;
import com.ez.core.service.EzService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2018/1/19.
 */
public class YhpcService implements EzService {

    /**
     *
     * @param reqData 包含有 type 和 pkey
     * @param resData
     */
    public void updateFileNum(Map<String, Object> reqData, Map<String, Object> resData) {
        String type = (String)reqData.get("type");
        String pkey = (String)reqData.get("pkey");

        Map<String, Object> params = new HashMap<String, Object>(3);
        params.put("APPTYPE", type);
        params.put("APPPKEY", pkey);
        params.put("YHPCID", Long.parseLong(pkey));
        String hql = "update YJ_YHPC set FILENUM = (SELECT COUNT(1) FROM BASE_FILE_APP WHERE APPTYPE=:APPTYPE AND APPPKEY=:APPPKEY ) WHERE  YHPCID=:YHPCID";
        BaseDao.getInstance().updateByHql(hql, params);
    }

    public void report1(Map<String, Object> reqData, Map<String, Object> resData) {
        String sql = "select count(1) num, PCSJ sj, ZGJG jg from YJ_YHPC where PCSJ >= :dateBegin and PCSJ <= :dateEnd group by PCSJ, ZGJG";
        Map params = (Map)reqData.get("body");
        List ret = BaseDao.getInstance().queryBySql(sql, params);
        resData.put("counts", ret);
    }
}
