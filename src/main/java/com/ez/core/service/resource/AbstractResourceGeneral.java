package com.ez.core.service.resource;

import com.ez.core.exception.BusiException;
import com.ez.core.exception.EzCode;
import com.ez.util.EzStrUtil;

import java.util.Map;

/**
 * Created by Administrator on 2017/12/21.
 */
public class AbstractResourceGeneral<T extends IConfigurable> implements IResourceGeneral {

    private AbstractResourceService<T> resourceService;

    public void doGeneral(Map<String, Object> req, Map<String, Object> res) {
        String id = (String) req.get("id");
        if (EzStrUtil.isEmpty(id)) {
            throw new BusiException(EzCode.ERROR_BUSI_PARAMS, "params id can not be null");
        }
        T t = resourceService.get(id);
        res.put("config", t);
    }

    public void setResourceService(AbstractResourceService<T> resourceService) {
        this.resourceService = resourceService;
    }
}
