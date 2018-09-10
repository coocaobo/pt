package com.ez.core.service.resource;

import java.util.Map;

/**
 * Created by Ez on 2017/12/18.
 */
public abstract class AbstractConfigurable implements IConfigurable {
    protected Long lastModi;
    protected final String id;
    protected String name;
    protected final Map<String,Object> properties;


    public AbstractConfigurable(String id, Map<String,Object> properties){
        this.id = id;
        this.properties = properties;
    }

    public String getId() {
        return this.id;
    }
    public String getName() {
        return this.name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public Map<String, Object> getProperty() {
        return properties;
    }

    public Long getlastModify() {
        return lastModi;
    }

    public void setLastModify(Long lastModi) {
        this.lastModi = lastModi;
    }

}
