package com.ez.app.crm;

import com.ez.core.dao.BaseDao;
import com.ez.core.service.EzService;
import org.apache.log4j.Logger;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2018/9/12.
 */
public class SyncService implements EzService{

private static Logger logger = Logger.getLogger(SyncService.class);

    /**
     *
     * @param reqData 包含有 type 和 pkey
     * @param resData
     */
    public void syncData(Map<String, Object> reqData, Map<String, Object> resData) {
        logger.info(reqData);
        Map body = (Map) reqData.get("body");
        Map custome = (Map) body.get("$custome");
        List<Map<String, Object>> list = (List) custome.get("intentionCus");
        for (Map record: list) {
            String version  = (String)record.get("VERSION");
            if(version == null || version.isEmpty()) {
                version = "0";
            }
            int v = Integer.parseInt(version);
            if(v > 1000) {
                v = 0;
            }
            v = v + 1;
            String name = (String)record.get("CUSNAME");
            record.put("VERSION", v+"");
            if(name !=null) {
                int index = name.indexOf("$");
                if(index != -1) {
                    name = name.substring(index+1);
                }
            }
            record.put("CUSNAME", v + "$" +name );
        }

        List<Map<String, Object>> delCustom = (List) custome.get("delCustom");
        delCustom.clear();

        resData.put("syncData", reqData.get("body"));
    }

}
