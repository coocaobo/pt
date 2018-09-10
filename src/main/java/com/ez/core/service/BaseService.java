package com.ez.core.service;

import com.ez.core.dao.BaseDao;
import com.ez.core.dao.IDao;
import com.ez.core.exception.ServerException;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.util.Map;

/**
 * Created by Ez on 2017/12/11.
 */
public abstract class BaseService implements EzService{
    private IDao dao;
    private final String TABLE_NAME = "BASE_EMPLOYEE";

    public IDao getDao() {
        if(dao == null) {
            dao = BaseDao.getInstance();
        }
        return dao;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> loadOne(Serializable pk) {
        return getDao().findById(getTableName(), pk);
    }

    public  String getTableName(){
        throw new ServerException("", "方法必须被实现");
    };
}
