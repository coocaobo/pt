package com.ez.core.service.resource.boot;

import com.ez.core.exception.EzCode;
import com.ez.core.exception.ServerException;
import com.ez.core.service.resource.AbstractResourceService;
import org.apache.log4j.Logger;

import java.util.concurrent.ExecutionException;

/**
 * Created by Administrator on 2017/12/20.
 */
public class BootService extends AbstractResourceService<Boot>  {
    private static final Logger logger = Logger.getLogger(BootService.class);
    private static BootService instance;
    private static final String TYPE = "boot";

    private static final String DEFAULT_BOOT = "META-INF.boot";

    public BootService() {
        super(TYPE);
        instance = this;
    }

    public static BootService instance() {
        if(instance == null){
            throw new ServerException(EzCode.ERROR_SERVER_NOBEAN, BootService.class + "has no instance");
        }
        return instance;
    }

    public static Boot defaultBoot()  {
        return instance().get(DEFAULT_BOOT);
    }
}
