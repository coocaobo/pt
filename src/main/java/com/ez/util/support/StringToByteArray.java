package com.ez.util.support;

import org.springframework.core.convert.converter.Converter;

public class StringToByteArray implements Converter<String,byte[]> {
	
	public byte[] convert(String source) {
		try {
			return source.getBytes("UTF-8");
		} catch (Exception e) {
			throw new IllegalStateException(e);
		}
	}

}
