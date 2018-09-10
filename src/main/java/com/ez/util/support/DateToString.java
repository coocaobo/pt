package com.ez.util.support;

import org.springframework.core.convert.converter.Converter;

import java.text.SimpleDateFormat;
import java.util.Date;

public class DateToString implements Converter<Date,String> {
	
    private  String DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
    private SimpleDateFormat df = new SimpleDateFormat(DATETIME_FORMAT);
  
	public String convert(Date source) {

		return df.format(source);
	}

}
