package com.ez.core.service.resource;

import com.ez.core.exception.ServiceException;

import java.util.concurrent.ExecutionException;

/**
 * Created by Administrator on 2017/12/20.
 */
public interface IResourceService<T extends IConfigurable> {
    public T get(String id) throws ServiceException, ExecutionException;
    public void add(T t);
    public void reload(String id);
    public boolean isLoaded(String id);
    public void reloadAll();
    public void setLoader(IConfigurableLoader<T> loader);
    public IConfigurableLoader<T> getLoader();
}
