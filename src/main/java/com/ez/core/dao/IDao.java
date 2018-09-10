package com.ez.core.dao;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

/**
 * Created by Ez on 2017/12/6.
 */
public interface IDao {

    Serializable save(String entity, Map<String, Object> record);

    void update(String entity, Map<String, Object> record);

    void saveOrUpdate(String entity, Map<String, Object> record);

    void delete(String entity, Map<String, Object> record);

    Map<String, Object> findById(String entity, Serializable oid);

    List<Map<String, Object>> findAll(String entity, List<Object> cnd);

    List<Map<String, Object>> findAll(String entity, String field, Object value);

    Integer singleCount(String schemaId, List<Object> cnd);

    List<Map<String, Object>> singleFindByPage(String schemaId, List<Object> cnd, Integer pageSize, Integer pageNum);

    List<Map<String, Object>> findByCnd(String entity, List<Object> cnd);

    List<Map<String, Object>> queryBySql(String sql, Map<String, Object> params);

    List<Map<String, Object>> queryByHql(String sql, Map<String, Object> params);

    Object saveSingle(String schemaId, Map<String, Object> body);

    Object removeSingle(String schemaId, List<Map<String, Object>> body, Boolean dr);
    Map<String, Object> loadSingleBySchemaAndPkey(String schema, Serializable oid);

    Object updateSingle(String schemaId, Map<String, Object> body);

    int updateByHql(String hql, Map<String, Object> params);
}
