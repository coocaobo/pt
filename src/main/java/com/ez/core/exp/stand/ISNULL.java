package com.ez.core.exp.stand;


import com.ez.core.exp.ExpException;
import com.ez.core.exp.Expression;
import com.ez.core.exp.ExpressionProcessor;
import com.ez.util.ConversionUtils;

import java.util.List;

public class ISNULL extends Expression {
	public ISNULL() {
		name = "isNull";
	}

	public Object run(List<?> ls,ExpressionProcessor processor) throws ExpException {
		Object lso = ls.get(1);
		if(lso instanceof List){
			lso = processor.run((List<?>)lso);
		}
		return lso == null;
	}

	public String toString(List<?> ls, ExpressionProcessor processor) throws ExpException {
		Object lso = ls.get(1);
		if(lso instanceof List){
			lso = processor.toString((List<?>)lso);
		}
		StringBuffer sb = new StringBuffer(ConversionUtils.convert(lso, String.class));
		sb.append(" is null");
		return sb.toString();
	}

}
