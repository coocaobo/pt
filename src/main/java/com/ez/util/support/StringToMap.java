package com.ez.util.support;

import com.ez.util.JSONUtils;
import org.springframework.core.convert.converter.Converter;

import java.util.Map;

@SuppressWarnings("rawtypes")
public class StringToMap implements Converter<String,Map> {
	
	public Map convert(String source) {
		return JSONUtils.parse(source, Map.class);
	}

}
