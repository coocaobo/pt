package com.ez.mvc.controller;

import com.ez.core.exception.BaseException;
import com.ez.core.exception.EzCode;
import com.ez.core.response.EzResponse;
import com.ez.core.service.resource.dictionary.DicService;
import com.ez.kafka.ProducerAsyn;
import com.ez.mvc.controller.support.Constains;
import com.ez.mvc.controller.support.ServiceAdapter;
import com.ez.util.JSONUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Ez on 2017/12/6.
 */
@Controller
public class JsonController {
    Logger log = Logger.getLogger(JsonController.class);

    @Autowired
    private ProducerAsyn producerAsyn;

    @RequestMapping(value = "json")
    @ResponseBody
    public EzResponse doRequest(HttpServletRequest request, HttpServletResponse response) {
        EzResponse ezRes = EzResponse.newRight();

        final Map<String, Object> resData = new HashMap<String, Object>();
        try {
            final Map<String, Object> reqData = JSONUtils.parse(request.getInputStream(), HashMap.class);
            String serverId = (String) reqData.get(Constains.SERVER_ID);
            String actionId = (String) reqData.get(Constains.ACTION_ID);
            ServiceAdapter.invokeService(serverId, actionId, reqData, resData);
            ezRes.setBody(resData);
            Object dicIds = reqData.get(Constains.DIC_RELOAD);
            if(dicIds != null) {
                reloadDics(dicIds);
            }
        } catch (BaseException e) {
            log.error(e);
            e.printStackTrace();
            ezRes.setMsg(e.getMessage());
            ezRes.setCode(e.getErrCode());
        } catch (IOException e) {
            log.error(e);
            e.printStackTrace();
            ezRes.setMsg(e.getMessage());
            ezRes.setCode(EzCode.ERROR_SERVER_IO);
        } catch (Exception e) {
            log.error(e);
            e.printStackTrace();
            ezRes.setMsg(e.getMessage());
            ezRes.setCode(EzCode.ERROR_SERVER_UNCATCH);
        }
        return ezRes;
    }

    private void reloadDics(Object dicIds) {
        if(dicIds instanceof String) {
            DicService.instance().reload((String)dicIds);

        }else if(dicIds instanceof List) {
            List<String>  dics = (List<String>) dicIds;
            for(String id : dics) {
                DicService.instance().reload(id);
            }

        }
    }



}
