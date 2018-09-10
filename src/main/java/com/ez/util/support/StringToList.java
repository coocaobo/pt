package com.ez.util.support;


import com.ez.util.JSONUtils;
import org.springframework.core.convert.converter.Converter;

import java.util.List;

@SuppressWarnings("rawtypes")
public class StringToList implements Converter<String,List> {
	
	public List convert(String source) {
		return JSONUtils.parse(source, List.class);
	}

}
