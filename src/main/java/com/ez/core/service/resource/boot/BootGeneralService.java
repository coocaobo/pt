package com.ez.core.service.resource.boot;

import com.ez.core.service.resource.AbstractResourceGeneral;
import com.ez.core.service.resource.schema.Schema;

/**
 * Created by Administrator on 2017/12/21.
 */
public class BootGeneralService extends AbstractResourceGeneral<Boot> {

    public BootGeneralService() {
        setResourceService(BootService.instance());
    }

}
