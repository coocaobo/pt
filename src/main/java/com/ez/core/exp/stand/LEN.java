package com.ez.core.exp.stand;


import com.ez.core.exp.ExpException;
import com.ez.core.exp.Expression;
import com.ez.core.exp.ExpressionProcessor;
import com.ez.util.ConversionUtils;

import java.util.List;

public class LEN extends Expression {
	
	public LEN(){
		symbol = "length";
	}

	public Object run(List<?> ls, ExpressionProcessor processor) throws ExpException {
		Object o = ls.get(1);
		if(o instanceof List){
			o = processor.run((List<?>)o);
		}
		String str = ConversionUtils.convert(o,String.class);
		return str.length();
	}
	
	public String toString(List<?> ls, ExpressionProcessor processor) throws ExpException {
		StringBuffer sb = new StringBuffer(symbol).append("(");
		Object lso = ls.get(1);
		if(lso instanceof List){
			sb.append(processor.toString((List<?>)lso));
		}
		else{
			sb.append(ConversionUtils.convert(lso,String.class));
		}
		sb.append(")");
		return sb.toString();
	}

}
