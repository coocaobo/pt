package com.ez.util;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import java.io.InputStream;
import java.text.SimpleDateFormat;

public class JSONUtils {
	private static ObjectMapper mapper =  new ObjectMapper();
	
	static{
		mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
		mapper.configure(JsonParser.Feature.ALLOW_SINGLE_QUOTES, true);

		mapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));
		mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
		mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);

	}


	public static <T> T parse(String value,Class<T> clz){
		if (EzStrUtil.isEmpty(value)) {
			return null;
		}
		try {
			return mapper.readValue(value, clz);
		}
		catch (Exception e) {
			throw new IllegalStateException(e);
		}
	}

	public static <T> T parse(InputStream ins,Class<T> clz){
		try {
			return mapper.readValue(ins, clz);
		} 
		catch (Exception e) {
			throw new IllegalStateException(e);
		} 
	}

}
