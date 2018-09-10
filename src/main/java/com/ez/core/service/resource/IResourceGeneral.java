package com.ez.core.service.resource;

import com.ez.core.service.EzService;

import java.util.Map;

/**
 * Created by Administrator on 2017/12/21.
 */
public interface IResourceGeneral extends EzService{
    public void doGeneral(Map<String, Object> req, Map<String, Object > res);
}
