package com.ez.core.exp.stand;


import com.ez.core.exp.ExpException;
import com.ez.core.exp.ExpressionProcessor;

import java.util.HashSet;
import java.util.List;

public class NOTIN extends IN {

	public NOTIN() {
		symbol = "not in";
	}

	public Object run(List<?> ls, ExpressionProcessor processor) throws ExpException {
		try {
			Object o = processor.run((List<?>) ls.get(1));
			List<?> rang = (List<?>) ls.get(2);
			HashSet<Object> set = new HashSet<Object>();
			set.addAll(rang);
			return !set.contains(o);
		} catch (Exception e) {
			throw new ExpException(e.getMessage());
		}
	}

}
