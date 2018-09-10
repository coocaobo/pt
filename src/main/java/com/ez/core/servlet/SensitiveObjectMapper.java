package com.ez.core.servlet;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.deser.DefaultDeserializationContext;
import com.fasterxml.jackson.databind.ser.DefaultSerializerProvider;

/**
 * Created by Administrator on 2018/2/8.
 */
public class SensitiveObjectMapper extends ObjectMapper {

    /**
     * 对弗雷的jsonfactory使用自定义工厂
     */
    public SensitiveObjectMapper() {
        super(new SensitiveJsonFactory(), (DefaultSerializerProvider) null, (DefaultDeserializationContext) null);
    }
}
