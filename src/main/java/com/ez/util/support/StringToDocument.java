package com.ez.util.support;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.springframework.core.convert.converter.Converter;

public class StringToDocument implements Converter<String,Document> {
	
	public Document convert(String source) {
		try {
			return DocumentHelper.parseText(source);
		} 
    	catch (DocumentException e) {
    		throw new IllegalArgumentException("Failed to parse xml " + source + ", cause: " + e.getMessage(), e);
		}
	}

}
