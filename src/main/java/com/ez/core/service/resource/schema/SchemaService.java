package com.ez.core.service.resource.schema;

import com.ez.core.exception.EzCode;
import com.ez.core.exception.ServerException;
import com.ez.core.service.resource.AbstractResourceService;
import org.apache.log4j.Logger;

/**
 * Created by Administrator on 2017/12/20.
 */
public class SchemaService extends AbstractResourceService<Schema>  {
    private static final Logger logger = Logger.getLogger(SchemaService.class);
    private static SchemaService instance;
    private static final String TYPE = "schema";

    private String schemaPath = "source.schemas.";

    public String getBasePath() {
        return schemaPath;
    }

    public SchemaService() {
        super(TYPE);
        instance = this;
    }

    public static SchemaService instance() {
        if(instance == null){
            throw new ServerException(EzCode.ERROR_SERVER_NOBEAN, SchemaService.class + "has no instance");
        }
        return instance;
    }
}
