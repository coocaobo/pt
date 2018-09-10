package com.ez.util.support;

import java.util.Date;

import org.springframework.core.convert.converter.Converter;

public class DateToNumber implements Converter<Date,Number> {

	public Number convert(Date source) {
		return source.getTime();
	}

}
