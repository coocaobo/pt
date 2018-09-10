package com.ez.core.service.resource.dictionary;

import com.ez.core.exception.EzCode;
import com.ez.core.exception.ServerException;
import com.ez.core.service.resource.AbstractResourceService;
import org.apache.log4j.Logger;

/**
 * Created by Administrator on 2017/12/20.
 */
public class DicService extends AbstractResourceService<Dictionary>  {
    private static final Logger logger = Logger.getLogger(DicService.class);
    private static DicService instance;
    private static final String TYPE = "dictionaryConfig";

    private String dicPath = "source.dictionary.";

    public String getBasePath() {
        return dicPath;
    }

    public DicService() {
        super(TYPE);
        instance = this;
    }

    public static DicService instance() {
        if(instance == null){
            throw new ServerException(EzCode.ERROR_SERVER_NOBEAN, DicService.class + "has no instance");
        }
        return instance;
    }
}
