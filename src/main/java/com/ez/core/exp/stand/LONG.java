package com.ez.core.exp.stand;


import com.ez.core.exp.ExpException;
import com.ez.core.exp.Expression;
import com.ez.core.exp.ExpressionProcessor;
import com.ez.util.ConversionUtils;

import java.util.List;

public class LONG extends Expression {
	
	public LONG(){
		name = "l";
	}

	public Object run(List<?> ls, ExpressionProcessor processor) throws ExpException {
		try{
			Long result = 0l;
			Object lso = ls.get(1);
			if(lso instanceof List){
				result = ConversionUtils.convert(processor.run((List<?>)lso),Long.class);
			}
			else{
				result = ConversionUtils.convert(ls.get(1),Long.class);
			}
			return result;
		}
		catch(Exception e){
			throw new ExpException(e.getMessage());
		}
	}
	
	public String toString(List<?> ls, ExpressionProcessor processor) throws ExpException {
		Long result = 0l;
		Object lso = ls.get(1);
		if(lso instanceof List){
			result = ConversionUtils.convert(processor.run((List<?>)lso),Long.class);
		}
		else{
			result = ConversionUtils.convert(ls.get(1),Long.class);
		}
		return String.valueOf(result);
	}


}
