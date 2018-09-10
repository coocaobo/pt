package com.ez.core.exp.stand;

import com.ez.core.exp.ExpException;
import com.ez.core.exp.Expression;
import com.ez.core.exp.ExpressionProcessor;
import com.ez.util.ConversionUtils;

import java.util.List;


public class INT extends Expression {
	
	public INT(){
		name = "i";
	}

	public Object run(List<?> ls, ExpressionProcessor processor) throws ExpException {
		try{
			Integer result = 0;
			Object lso = ls.get(1);
			if(lso instanceof List){
				result = ConversionUtils.convert(processor.run((List<?>)lso),Integer.class);
			}
			else{
				result = ConversionUtils.convert(ls.get(1),Integer.class);
			}
			return result;
		}
		catch(Exception e){
			throw new ExpException(e.getMessage());
		}
	}
	
	public String toString(List<?> ls, ExpressionProcessor processor) throws ExpException {
		Integer result = 0;
		Object lso = ls.get(1);
		if(lso instanceof List){
			result = ConversionUtils.convert(processor.run((List<?>)lso),Integer.class);
		}
		else{
			result = ConversionUtils.convert(ls.get(1),Integer.class);
		}
		return String.valueOf(result);
	}


}
