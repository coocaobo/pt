package com.ez.util.support;

import java.util.Date;

import org.springframework.core.convert.converter.Converter;

public class LongToDate implements Converter<Long,Date> {

	public Date convert(Long source) {
		return new Date(source);
	}

}
