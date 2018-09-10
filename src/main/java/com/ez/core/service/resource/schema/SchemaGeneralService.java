package com.ez.core.service.resource.schema;

import com.ez.core.service.resource.AbstractResourceGeneral;

/**
 * Created by Administrator on 2017/12/21.
 */
public class SchemaGeneralService extends AbstractResourceGeneral<Schema> {

    public SchemaGeneralService() {
        setResourceService(SchemaService.instance());
    }

}
