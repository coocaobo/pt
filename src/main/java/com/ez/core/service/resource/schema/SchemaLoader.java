package com.ez.core.service.resource.schema;

import com.ez.core.exception.ServerException;
import com.ez.core.service.resource.AbstractConfigurableLoader;
import com.ez.util.XmlUtil;
import org.dom4j.Document;
import org.dom4j.DocumentException;

import java.util.Map;

/**
 * Created by Administrator on 2017/12/20.
 */
public class SchemaLoader extends AbstractConfigurableLoader<Schema> {
    private final String postFix = ".sc";
    public SchemaLoader(){
        setPostfix(postFix);
    }
    public Schema createInstanceFormDoc(String id, Document doc, long lastModi) throws ServerException, DocumentException {
        String xmlStr = doc.asXML();
        Map<String, Object> attrs = XmlUtil.xml2mapWithAttr(xmlStr, true);
        Schema schema = new Schema(id, attrs);
        schema.setName("TODO");
        schema.setLastModify(lastModi);
        return schema;
    }
}
