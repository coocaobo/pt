package com.ez.core.server.common;

import com.ez.core.dao.BaseDao;
import com.ez.core.dao.IDao;
import com.ez.core.service.EzService;
import com.ez.core.service.resource.dictionary.Dictionary;
import com.ez.mvc.controller.support.Constains;
import com.ez.util.EzStrUtil;
import com.ez.util.PyConverter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2018/1/11.
 */
public class PinyinServer implements EzService {



    public void getPinyin(Map<String, Object> reqData, Map<String, Object> resData) {
        String body = (String) reqData.get(Constains.REQ_BODY);
        if(EzStrUtil.isEmpty(body)) {
            return;
        }

        String pinyin = PyConverter.getPinYin(body);

        resData.put("pinyin", pinyin);
    }

}
