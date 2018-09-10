package com.ez.core.service.resource.dictionary;

import com.ez.core.exception.ServerException;
import com.ez.core.service.resource.AbstractConfigurableLoader;
import com.ez.util.XmlUtil;
import org.dom4j.Document;
import org.dom4j.DocumentException;

import java.util.Map;

/**
 * Created by Administrator on 2017/12/20.
 */
public class DicLoader extends AbstractConfigurableLoader<Dictionary> {
    private final String postFix = ".dic";
    public DicLoader(){
        setPostfix(postFix);
    }

    public Dictionary createInstanceFormDoc(String id, Document doc, long lastModi) throws ServerException, DocumentException {
        String xmlStr = doc.asXML();
        Map<String, Object> attrs = XmlUtil.xml2mapWithAttr(xmlStr, true);
        Dictionary dictionary = new Dictionary(id, attrs);
        dictionary.setLastModify(lastModi);
        return dictionary;
    }
}
