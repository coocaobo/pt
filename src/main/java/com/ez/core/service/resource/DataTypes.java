package com.ez.core.service.resource;

import com.ez.util.ConversionUtils;
import org.apache.commons.lang.StringUtils;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;

public class DataTypes {
	public static final String STRING = "string";
	public static final String INT = "int";
	public static final String LONG = "long";
	public static final String DOUBLE = "double";
	public static final String BOOLEAN = "boolean";
	public static final String DATE = "date";
	public static final String BIGDECIMAL = "bigDecimal";
	public static final String TIME = "timestamp";
	public static final String DATETIME = "datetime";
	public static final String CHAR = "char";
	public static final String BINARY = "binary";
	public static final String OBJECT = "object";
	
	private static HashMap<String, Class<?>> types = new HashMap<String,Class<?>>();

	static{
		types.put(BIGDECIMAL,BigDecimal.class);
		types.put(INT,Integer.class);
		types.put(LONG,Long.class);
		types.put(DOUBLE,Double.class);
		types.put(STRING, String.class);
		types.put(DATE,Date.class);
		types.put(TIME,Date.class);
		types.put(CHAR,Character.class);
		types.put(BOOLEAN, Boolean.class);
		types.put(DATETIME, Date.class);
		types.put(BINARY, byte[].class);
		types.put(OBJECT, Object.class);
	}
	
	public static Class<?> getTypeClass(String nm){
		return types.get(StringUtils.uncapitalize(nm));
	}
	
	public static boolean isSupportType(String type){
		return types.containsKey(StringUtils.uncapitalize(type));
	}
	
	public static Object toTypeValue(String type,Object value){
		if(!types.containsKey(type)){
			throw new IllegalStateException("type[" + type + "] is not supported.");
		}
		return ConversionUtils.convert(value, getTypeClass(type));
	}
	
	public static boolean isNumberType(String type){
		if(!types.containsKey(type)){
			return false;
		}
		Class<?> typeClass = getTypeClass(type);
		return Number.class.isAssignableFrom(typeClass);
	}
}
