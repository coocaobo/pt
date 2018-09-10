package com.ez.core.service.resource.boot;

import com.ez.core.service.resource.AbstractConfigurable;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


public class Boot extends AbstractConfigurable{

	public Boot(String id, Map<String, Object> props) {
		super(id, props);
	}

}
