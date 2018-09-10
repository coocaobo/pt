package com.ez.core.service.resource;

import com.ez.core.exception.EzCode;
import com.ez.core.exception.ServiceException;
import com.ez.core.server.CacheStore;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import org.apache.log4j.Logger;

import java.util.concurrent.ExecutionException;

/**
 * Created by Administrator on 2017/12/20.
 * 这里在load的时候id是不带 公用 目录的。
 */
public abstract class AbstractResourceService <T extends IConfigurable> implements IResourceService<T>{
    private static final Logger logger = Logger.getLogger(AbstractResourceService.class);
    private final String type;

    public String getBasePath() {
        return "";
    }

    public void setBasePath() {

    }

    public AbstractResourceService(String type) {
        this.type = type;
        initStore();
    }
    protected IConfigurableLoader<T> loader;

    private void initStore() {
        LoadingCache store = getStore();
        if(store != null) {
            logger.warn("only one type store can be init: type=" + type);
            return;
        }

        store = createCacheLoader();
        CacheStore.addFileStore(type, store);
    }


    protected LoadingCache<String, T> createCacheLoader() {

        return CacheBuilder.newBuilder().build(new CacheLoader<String, T>() {
            public T load(String id) throws Exception {
                T t = loader.load(id);
                if (t == null) {
                    throw new ServiceException(EzCode.ERROR_CONFIG_NOTFOUND,
                            this.getClass().getSimpleName() + " can not find instance " + id);
                }
                return t;
            }
        });
    }

    private LoadingCache getStore() {
       return CacheStore.getFileStore(type);
    }


    public T get(String id) throws ServiceException {
        try {
            return (T) getStore().get(getBasePath() + id);
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
        return null;
    }

    public void add(T t) {
        getStore().put(t.getId(), t);
    }

    public void reload(String id) {
        getStore().invalidate(getBasePath() + id);
    }

    public boolean isLoaded(String id) {
        if (getStore().getIfPresent(getBasePath() + id) != null) {
            return true;
        }
        return false;
    }

    public void reloadAll() {
        getStore().invalidateAll();
    }

    public void setLoader(IConfigurableLoader<T> loader) {
        this.loader = loader;
    }

    public IConfigurableLoader<T> getLoader() {
        return loader;
    }
}
