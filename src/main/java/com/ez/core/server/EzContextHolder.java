package com.ez.core.server;

import com.ez.common.bytecode.Wrapper;
import com.ez.core.service.EzService;
import org.springframework.aop.SpringProxy;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.util.ClassUtils;

import java.lang.reflect.Proxy;

/**
 * Created by Ez on 2017/12/7.
 */
public class EzContextHolder implements ApplicationContextAware {

    private static ApplicationContext applicationContext;
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
        initBeanServer(applicationContext);
    }

    public static Object getBean(String beanName){
        return applicationContext.getBean(beanName);
    }

    public static <T> T getBean(String beanName, Class<T> type){
        return applicationContext.getBean(beanName, type);
    }

    private void initBeanServer(ApplicationContext applicationContext) {
        String[] beanNames = applicationContext.getBeanDefinitionNames();
        for (String name: beanNames) {
            Object bean = applicationContext.getBean(name);
            Class clazz = decideCommonServiceClass(bean);
            if(clazz == null) {
                continue;
            }
            generalDynamicClass(name, clazz);

        }
    }
    private void generalDynamicClass(String name, Class clazz) {
        Wrapper.getOrAddWrapper(name, clazz);
    }

    public static Class decideCommonServiceClass(Object bean) {
        if(!EzService.class.isAssignableFrom(bean.getClass())) {
            return null;
        }
        Class  clazz = bean.getClass();
        if(bean instanceof SpringProxy){
            while (Proxy.isProxyClass(clazz) || ClassUtils.isCglibProxyClass(clazz)) {
                clazz = clazz.getSuperclass();
            }
        }

        return clazz;
    }
}
