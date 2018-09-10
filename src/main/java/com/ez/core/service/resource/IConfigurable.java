package com.ez.core.service.resource;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Ez on 2017/12/18.
 */
public interface IConfigurable extends Serializable{
    public String getId();
    public String getName();

    public Map<String, Object> getProperty();

    public Long getlastModify();
    public void setLastModify(Long lastModi);
}
