package com.ez.core.server;

import com.ez.core.service.resource.IConfigurable;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import org.apache.log4j.Logger;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

/**
 * Created by Administrator on 2017/12/20.
 */
public abstract class CacheStore {

    private static final Map<String, LoadingCache<String, IConfigurable>> fileStore = new HashMap<String, LoadingCache<String, IConfigurable>>();

    private static final Logger logger = Logger.getLogger(CacheStore.class);
    private static final Map<String, LoadingCache<String, Map<String, Object>>> baseStore = new HashMap<String, LoadingCache<String, Map<String, Object>>>();

    private static LoadingCache<String, Map<String, Object>> getStore(String type) {
        LoadingCache cache = baseStore.get(type);
        return cache;
    }

    private static void addStore(String type, LoadingCache<String, Map<String, Object>> store) {
        baseStore.put(type, store);
    }

    public static void clearAll() {
        for (String key : baseStore.keySet()) {
            baseStore.get(key).invalidateAll();
        }
        for (String key : fileStore.keySet()) {
            fileStore.get(key).invalidateAll();
        }
    }

    public static Map<String, Object> load(ICacheServer server, String id) {
        String type = server.getClass().getName();
        LoadingCache<String, Map<String, Object>> store = CacheStore.getStore(type);
        if (store == null) {
            store = createCacheLoader(server);
            addStore(type, store);
        }
        try {
            return store.get(id);
        } catch (ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }

    private static LoadingCache<String, Map<String, Object>> createCacheLoader(final ICacheServer server) {
        return CacheBuilder.newBuilder().build(new CacheLoader<String, Map<String, Object>>() {
            public Map<String, Object> load(String id) throws Exception {
                Map<String, Object> ret = server.loadDb(id);
                if (ret == null) {
//                    throw new ServiceException(EzCode.ERROR_CONFIG_NOTFOUND,
//                            server.getClass().getSimpleName() + " can not find instance " + id);
                    logger.warn(server.getClass().getSimpleName() + " can not find instance " + id);
                }
                return ret;
            }
        });
    }

    public static LoadingCache<String, IConfigurable> getFileStore(String type) {
        LoadingCache cache = fileStore.get(type);
        return cache;
    }

    public static void addFileStore(String type, LoadingCache<String, IConfigurable> store) {
        fileStore.put(type, store);
    }
}
