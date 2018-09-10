package com.ez.util.support;

import com.ez.util.NetUtils;
import org.springframework.core.convert.converter.Converter;

import java.net.InetSocketAddress;

public class StringToInetSocketAddress implements Converter<String,InetSocketAddress> {
	
	public InetSocketAddress convert(String source) {
		return NetUtils.toAddress(source);
	}

}
