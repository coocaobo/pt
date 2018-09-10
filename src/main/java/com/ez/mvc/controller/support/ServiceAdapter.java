package com.ez.mvc.controller.support;

import com.ez.common.bytecode.Wrapper;
import com.ez.core.exception.EzCode;
import com.ez.core.exception.ServerException;
import com.ez.core.server.EzContextHolder;
import com.ez.core.service.EzService;
import com.ez.util.EzStrUtil;

import java.lang.reflect.InvocationTargetException;
import java.util.Map;

/**
 * Created by Ez on 2017/12/7.
 */
public class ServiceAdapter {

    private static final String EXECUTE_METHOD = "execute";

    public static void invokeService(String beanName, String methodName, Map<String, Object> reqData, Map<String, Object> resData) {
        if (EzStrUtil.isEmpty(beanName)) {
            throw new ServerException(EzCode.ERROR_SERVER_PARAM, "Error params, must have a " + Constains.SERVER_ID);
        }
        if (EzStrUtil.isEmpty(methodName)) {
            throw new ServerException(EzCode.ERROR_SERVER_PARAM, "Error params, must have a " + Constains.ACTION_ID);
        }
        Object bean = EzContextHolder.getBean(beanName);
        if (bean == null) {
            throw new ServerException(EzCode.ERROR_SERVER_NOBEAN, "Have no bean in server with name: " + beanName);
        }

        try {
            Wrapper wrapper = Wrapper.getWrapper(beanName);
            wrapper.invokeMethod(bean, methodName, new Class[]{Map.class, Map.class}, new Object[] {reqData, resData});
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
            throw new ServerException(EzCode.ERROR_SERVER_NOACTION, "Have no action in server: " + beanName + ", actionId: " + methodName);
        } catch (InvocationTargetException e) {
            e.printStackTrace();
            throw new ServerException(EzCode.ERROR_SERVER_NOACTION, "Business invoke error: " + e.getTargetException().getCause().getCause().getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            throw new ServerException(EzCode.ERROR_SERVER_NOACTION, "Unknow exception: " + e.getMessage());
        }
    }

    public static void invokeService(String beanName, String methodName, Map<String, Object> returnObj) {
        if (EzStrUtil.isEmpty(beanName)) {
            throw new ServerException(EzCode.ERROR_SERVER_PARAM, "Error params, must have a " + Constains.SERVER_ID);
        }
        if (EzStrUtil.isEmpty(methodName)) {
            throw new ServerException(EzCode.ERROR_SERVER_PARAM, "Error params, must have a " + Constains.ACTION_ID);
        }
        Object bean = EzContextHolder.getBean(beanName);
        if (bean == null) {
            throw new ServerException(EzCode.ERROR_SERVER_NOBEAN, "Have no bean in server with name: " + beanName);
        }

        try {
            Wrapper wrapper = Wrapper.getWrapper(beanName);
            wrapper.invokeMethod(bean, methodName, new Class[]{Map.class}, new Object[] {returnObj});
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
            throw new ServerException(EzCode.ERROR_SERVER_NOACTION, "Have no action in server: " + beanName + ", actionId: " + methodName);
        } catch (InvocationTargetException e) {
            e.printStackTrace();
            throw new ServerException(EzCode.ERROR_SERVER_NOACTION, "Business invoke error");
        } catch (Exception e) {
            e.printStackTrace();
            throw new ServerException(EzCode.ERROR_SERVER_NOACTION, "Unknow exception: " + e.getMessage());
        }
    }
}
