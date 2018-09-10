package com.ez.core.service;

import com.ez.core.dao.BaseDao;
import com.ez.core.exception.BusiException;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Ez on 2017/12/6.
 */
public class BaseUserService extends BaseService{

    private final String TABLE_NAME = "BASE_USER";

    public String getTableName() {
        return TABLE_NAME;
    }
}
