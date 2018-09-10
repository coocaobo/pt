package com.ez.util;


import java.util.Set;

import com.ez.util.support.*;
import org.springframework.core.convert.converter.Converter;
import org.springframework.core.convert.support.ConfigurableConversionService;
import org.springframework.core.convert.support.DefaultConversionService;


public class ConversionUtils {
	private static ConfigurableConversionService conversion = new DefaultConversionService();
	
	static {
		conversion.addConverter(new LongToDate());
		conversion.addConverter(new DateToLong());
		conversion.addConverter(new DateToNumber());
		conversion.addConverter(new DateToString());
		conversion.addConverter(new StringToDate());
		conversion.addConverter(new StringToMap());
		conversion.addConverter(new StringToList());
		conversion.addConverter(new StringToDocument());
		conversion.addConverter(new StringToElement());
		conversion.addConverter(new StringToInetSocketAddress());
		conversion.addConverter(new DocumentToString());
		conversion.addConverter(new ElementToString());
		conversion.addConverter(new ElementToObject());
		conversion.addConverter(new ObjectToElement());
		conversion.addConverter(new MapToObject());
		conversion.addConverter(new ObjectToMap());
		conversion.addConverter(new StringToByteArray());
		conversion.addConverter(new ByteArrayToString());
	}
	
	public void setConverters(Set<Converter> converters) {
		for(Converter c : converters){
			conversion.addConverter(c);
		}
	}
	
	public static <T> T convert(Object source, Class<T> targetType){
		if(source == null){
			return null;
		}
		if(targetType.isInstance(source)){
			return (T)source;
		}
		return conversion.convert(source, targetType);
	}
	
	public static boolean canConvert(Class<?> sourceType, Class<?> targetType){
		return conversion.canConvert(sourceType, targetType);
	}
	
}

