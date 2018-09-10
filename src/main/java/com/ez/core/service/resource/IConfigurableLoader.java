package com.ez.core.service.resource;

import com.ez.core.exception.ServiceException;

/**
 * Created by Administrator on 2017/12/20.
 */
public interface IConfigurableLoader<T extends IConfigurable> {
    public T load(String id) throws ServiceException;
}
