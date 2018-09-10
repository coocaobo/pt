package com.ez.util.support;

import java.io.IOException;

import org.springframework.core.convert.converter.Converter;

public class ByteArrayToString implements Converter<byte[],String> {
	
	public String convert(byte[] source) {
		try {
			return new String(source, "UTF-8");
		} catch (IOException e) {
			throw new IllegalStateException(e);
		}
	}

}
