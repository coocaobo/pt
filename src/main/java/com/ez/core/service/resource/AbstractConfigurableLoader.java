package com.ez.core.service.resource;

import com.ez.core.exception.EzCode;
import com.ez.core.exception.ServerException;
import com.ez.util.XMLHelper;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.springframework.core.io.Resource;
import org.springframework.util.ResourceUtils;

import java.io.FileNotFoundException;
import java.io.IOException;

/**
 * Created by Administrator on 2017/12/20.
 */
public abstract  class AbstractConfigurableLoader<T extends IConfigurable> implements IConfigurableLoader<T>{
    protected String postfix;
    private final String fileType = ".xml";

    public void setPostfix(String postfix){
        this.postfix = postfix;
    }

    public String getPostfix(){
        return postfix;
    }

    public T load(String id) throws ServerException {
        String path = id.replaceAll("\\.", "/") + postfix + fileType;
        try {
            Resource r = ResourceCenter.load(ResourceUtils.CLASSPATH_URL_PREFIX, path, false);
            Document doc = XMLHelper.getDocument(r.getInputStream());
            return createInstanceFormDoc(id, doc, r.lastModified());
        }
        catch (FileNotFoundException e) {
            throw new ServerException(EzCode.ERROR_CONFIG_NOTFOUND,"file[" + path + "] not found.", e);
        }
        catch (IOException e) {
            throw new ServerException(EzCode.ERROR_CONFIG_FILELOAD,"load file[" + path + "] io error.", e);
        }
        catch(DocumentException e){
            throw new ServerException(EzCode.ERROR_CONFIG_FILELOAD,"load file[" + path + "] parse document error." , e);
        }
        catch (Exception e) {
            throw new ServerException(EzCode.ERROR_CONFIG_FILELOAD, "load file[" + path + "] unknow error.", e);
        }
    }

    public abstract T createInstanceFormDoc(String id,Document doc,long lastModi) throws ServerException, DocumentException;

}
