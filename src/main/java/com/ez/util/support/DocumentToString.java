package com.ez.util.support;

import org.dom4j.Document;
import org.springframework.core.convert.converter.Converter;

public class DocumentToString implements Converter<Document,String> {
	
	public String convert(Document source) {
		return source.asXML();
	}

}
