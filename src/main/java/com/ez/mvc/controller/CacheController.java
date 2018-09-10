package com.ez.mvc.controller;

import com.ez.core.server.CacheStore;
import com.ez.core.server.EzThreadLocal;
import com.ez.core.service.resource.boot.BootService;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpSession;
import java.util.Enumeration;

/**
 * Created by Administrator on 2017/12/27.
 */

@Controller
public class CacheController {

    private Logger logger = Logger.getLogger(CacheController.class);

    @RequestMapping("cache.reset")
    @ResponseBody
    public String resetAll() {
        CacheStore.clearAll();
        logger.info("all cache clear");
        return "success";
    }

    @RequestMapping("ss.reset")
    @ResponseBody
    public String resetSession() {
        HttpSession ss = EzThreadLocal.getSession();

        Enumeration names = ss.getAttributeNames();
        while (names.hasMoreElements()) {
            ss.removeAttribute((String) names.nextElement());
        }
//        ss.invalidate();
        return "success";
    }
}
