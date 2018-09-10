package com.ez.core.server.upload;

import com.ez.core.dao.BaseDao;
import com.ez.core.service.EzService;

import javax.transaction.Transactional;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Administrator on 2018/1/19.
 */
public class FileAppServer implements EzService{

    @Transactional
    public void SaveFileAddApp(Map<String, Object> reqData, Map<String, Object> resData) {
        Map<String, Object> fileBody = (Map<String, Object>) reqData.get("fileBody");
        Map<String, Object> appBody = (Map<String, Object>) reqData.get("appBody");

        String fileSchemaId = (String)reqData.get("fileSchema");
        String appSchemaId = (String) reqData.get("appSchema");

        Object fileId = BaseDao.getInstance().saveSingle(fileSchemaId, fileBody);

        Map<String, Object> fileAppRec = new HashMap<String, Object>();

        appBody.put("FILEID", fileId);

        String appFileId = BaseDao.getInstance().saveSingle(appSchemaId, appBody).toString();

        resData.put("appFileId", appFileId);
    }
}
