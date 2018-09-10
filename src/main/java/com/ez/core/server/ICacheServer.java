package com.ez.core.server;

import java.util.Map;

/**
 * Created by Administrator on 2017/12/26.
 */
public interface ICacheServer {

    public Map<String, Object> loadDb(String id);
    public Map<String, Object> loadCache(String id);
}
