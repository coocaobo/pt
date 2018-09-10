package com.ez.core.server.role;

import com.ez.core.dao.BaseDao;
import com.ez.core.dao.IDao;
import com.ez.core.service.EzService;
import com.ez.core.service.resource.schema.Schema;
import com.ez.core.service.resource.schema.SchemaService;
import com.ez.mvc.controller.support.Constains;

import javax.transaction.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2018/1/11.
 */
public class RoleServer implements EzService {
    private static Map<String, String> AppTypeMap = new HashMap<String, String>(4);

    static {
        AppTypeMap.put("a_", "01");
        AppTypeMap.put("c_", "02");
        AppTypeMap.put("m_", "03");
        AppTypeMap.put("b_", "04");
    }

    @Transactional
    public void saveRolePermission(Map<String, Object> reqData, Map<String, Object> resData) {
        Map<String, Object> body = (Map<String, Object>) reqData.get(Constains.REQ_BODY);
        Integer roleId = (Integer) reqData.get("roleId");
        String schemaId = (String) reqData.get("schemaId");
        List<String> addList = (List<String>) body.get("add");
        List<String> removeList = (List<String>) body.get("remove");

        IDao dao = BaseDao.getInstance();

        for (String menuId : addList) {
            String type = menuId.substring(0, 2);
            Long appId = Long.parseLong(menuId.substring(2));
            if (!AppTypeMap.containsKey(type)) {
                continue;
            }
            type = AppTypeMap.get(type);

            Map<String, Object> rec = new HashMap<String, Object>();
            rec.put("ROLEID", roleId);
            rec.put("APPTYPE", type);
            rec.put("APPID", appId);
            dao.saveSingle(schemaId, rec);
        }

        Schema sc = SchemaService.instance().get(schemaId);
        String table = sc.getMainTable();
        String hql = "delete from " + table + " where ROLEID=:ROLEID and APPTYPE=:APPTYPE and APPID=:APPID";

        Long roleIdl = Long.parseLong("" +roleId);
        for (String menuId : removeList) {
            String type = menuId.substring(0, 2);
            Long appId = Long.parseLong(menuId.substring(2));
            if (!AppTypeMap.containsKey(type)) {
                continue;
            }

            type = AppTypeMap.get(type);

            Map<String, Object> rec = new HashMap<String, Object>();
            rec.put("ROLEID", roleIdl);
            rec.put("APPTYPE", type);
            rec.put("APPID", appId);
            dao.updateByHql(hql, rec);
        }


    }

}
