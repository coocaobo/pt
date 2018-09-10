package com.ez.core.service.resource.boot;

import com.ez.core.exception.ServerException;
import com.ez.core.service.resource.AbstractConfigurableLoader;
import com.ez.core.service.resource.schema.Schema;
import com.ez.util.XmlUtil;
import org.dom4j.Document;
import org.dom4j.DocumentException;

import java.util.Map;

/**
 * Created by Administrator on 2017/12/20.
 */
public class BootLoader extends AbstractConfigurableLoader<Boot> {
    private final String postFix = ".ez";
    public BootLoader(){
        setPostfix(postFix);
    }
    public Boot createInstanceFormDoc(String id, Document doc, long lastModi) throws ServerException, DocumentException {
        String xmlStr = doc.asXML();
        Map<String, Object> attrs = XmlUtil.xml2mapWithAttr(xmlStr, true);
        Boot boot = new Boot(id, attrs);
        boot.setLastModify(lastModi);
        return boot;
    }
}
