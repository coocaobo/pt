package com.ez.core.dao;

import com.ez.core.exception.EzCode;
import com.ez.core.exception.ServerException;
import com.ez.core.service.resource.schema.Schema;
import com.ez.core.service.resource.schema.SchemaLoader;
import com.ez.core.service.resource.schema.SchemaService;
import com.ez.mvc.controller.support.Constains;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.transform.ResultTransformer;
import org.hibernate.transform.Transformers;

import javax.xml.transform.Result;
import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

/**
 * Created by Ez on 2017/12/7.
 */
public class BaseDao implements IDao {

    private SessionFactory sessionFactory;

    private static BaseDao ourInstance;

    public static BaseDao getInstance() {
        return ourInstance;
    }

    public BaseDao() {
        if (ourInstance != null) {
            throw new ServerException(EzCode.ERROR_SERVER_BOOT, this.getClass().getName() + " only can be instance once");
        }
        ourInstance = this;
    }

    public Serializable save(String entity, Map<String, Object> record) {
        return getSession().save(entity, record);
    }

    public void update(String entity, Map<String, Object> record) {
        getSession().update(entity, record);
    }

    public void saveOrUpdate(String entity, Map<String, Object> record) {
        getSession().saveOrUpdate(entity, record);
    }

    public void delete(String entity, Map<String, Object> record) {
        getSession().delete(entity, record);
    }

    public Map<String, Object> findById(String entity, Serializable oid) {
        return (Map<String, Object>) getSession().get(entity, oid);
    }



    public List<Map<String, Object>> findAll(String entity, List<Object> cnd) {

        return null;
    }

    public List<Map<String, Object>> findAll(String entity, String field, Object value) {
        StringBuffer hql = new StringBuffer();
        hql.append("from ").append(entity).append(" where ").append(field).append("=:").append(field);
        Query q = getSession().createQuery(hql.toString());
        q.setParameter(field, value);
        List<Map<String, Object>> rec = q.list();
        return rec;
    }

    public Integer singleCount(String schemaId, List<Object> cnd) {
        Schema sc = SchemaService.instance().get(schemaId);
        if(sc == null) {
            return 0;
        }

        String hql = sc.generalSingleCountHql(cnd);
        Query q = getSession().createSQLQuery(hql);
        List rec = q.list();
        Integer num = Integer.parseInt(rec.get(0).toString());
        return num;
    }

    public List<Map<String, Object>> singleFindByPage(String schemaId, List<Object> cnd, Integer pageSize, Integer start) {
        Schema sc = SchemaService.instance().get(schemaId);
        if(sc == null) {
            return null;
        }
        String hql = sc.generalSingleHql(cnd);
        Query q = getSession().createSQLQuery(hql);
        q.setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP);
        if(pageSize !=null && start!= null && pageSize > 0) {
            q.setFirstResult(start);
            q.setMaxResults(pageSize);
        }
        List ret = q.list();

        sc.formatDic(ret);

        return ret;
    }

    public List<Map<String, Object>> findByCnd(String entity, List<Object> cnd) {
        return null;
    }

    public List<Map<String, Object>> queryBySql(String sql, Map<String, Object> params) {
        Query q = getSession().createSQLQuery(sql);
        q.setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP);
        q.setProperties(params);
        List rec = q.list();
        return rec;
    }

    public List<Map<String, Object>> queryByHql(String hql, Map<String, Object> params) {
        Query q = getSession().createQuery(hql);
//        q.setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP);
        q.setProperties(params);
        List rec = q.list();
        return rec;
    }

    public Object saveSingle(String schemaId, Map<String, Object> body) {
        Schema sc = SchemaService.instance().get(schemaId);
        if(sc == null) {
            return null;
        }
        sc.parseRecord(body, true);
        String table = sc.getMainTable();
        return save(table, body);
    }

    /**
     * 删除一个标的数据，是否进行逻辑删除需要根据dr进行判断，dr为true则是逻辑删除 使用 Constains.DELETE_REMARK_REMOVE
     * @param schemaId
     * @param body
     * @param dr
     * @return
     */
    public Object removeSingle(String schemaId, List<Map<String, Object>> body, Boolean dr) {
        if(dr) {
            return updateRemoveSingle(schemaId, body);
        }

        return delRemoveSingle(schemaId, body);
    }

    public Object updateRemoveSingle(String schemaId, List<Map<String, Object>> body) {
        Schema sc  = SchemaService.instance().get(schemaId);
        String entity = sc.getMainTable();
        String drHql = sc.generalRemvoeByDrHql();
        int size = body.size();
        for (Map<String, Object> rec: body) {
            rec.put(Constains.DELETE_REMARK_FIELD, Constains.DELETE_REMARK_REMOVE);
            sc.parseRecord(rec);
            Query q = getSession().createQuery(drHql);
            q.setProperties(rec);
            q.executeUpdate();
        }
        return size;
    }

    public Object delRemoveSingle(String schemaId, List<Map<String, Object>> body) {
        Schema schema  = SchemaService.instance().get(schemaId);
        String entity = schema.getMainTable();
        int size = body.size();
        for (Map<String, Object> rec: body) {
            schema.parseRecord(rec);
            delete(entity, rec);
        }
        return size;
    }

    public Map<String, Object> loadSingleBySchemaAndPkey(String schemaId, Serializable oid) {
        Schema sc  = SchemaService.instance().get(schemaId);
        String entity = sc.getMainTable();
        String pkey = sc.getPkey();
        Map<String, Object> rec = new HashMap<String, Object>(1);
        rec.put(pkey, oid);

        sc.parseRecord(rec);

        return this.findById(entity, (Serializable)rec.get(pkey));
    }

    public Object updateSingle(String schemaId, Map<String, Object> rec) {
        Schema sc  = SchemaService.instance().get(schemaId);
        String entity = sc.getMainTable();
        String drHql = sc.generalSingleUpdateHql();
        Query q = getSession().createQuery(drHql);

        sc.parseRecord(rec);
        q.setProperties(rec);
        int num = q.executeUpdate();
        return num;
    }

    public int updateByHql(String hql, Map<String, Object> params) {

        Query q = getSession().createQuery(hql);
        q.setProperties(params);
        return q.executeUpdate();
    }

    public Session getSession() {
        return sessionFactory.getCurrentSession();
    }

    ;

    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }
}
