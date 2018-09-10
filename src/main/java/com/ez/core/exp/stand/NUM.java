package com.ez.core.exp.stand;


import com.ez.core.exp.ExpException;
import com.ez.core.exp.Expression;
import com.ez.core.exp.ExpressionProcessor;
import com.ez.util.ConversionUtils;

import java.math.BigDecimal;
import java.util.List;

public class NUM extends Expression {
	
	public NUM(){
		name = "d";
	}
	
	public Object run(List<?> ls, ExpressionProcessor processor) throws ExpException {
		try{
			Number result = 0;
			Object lso = ls.get(1);
			if(lso instanceof List){
				result = ConversionUtils.convert(processor.run((List<?>)lso),Number.class);
			}
			else{
				result = ConversionUtils.convert(ls.get(1),Number.class);
			}
			if(ls.size() == 3){
				int scale = ConversionUtils.convert(ls.get(2),int.class);
				result =  BigDecimal.valueOf(ConversionUtils.convert(result,Double.class)).setScale(scale,BigDecimal.ROUND_HALF_UP).doubleValue();
			}
			return result;
		}
		catch(Exception e){
			throw new ExpException(e.getMessage());
		}
	}
	
	@Override
	public String toString(List<?> ls, ExpressionProcessor processor) throws ExpException {
		Number result = 0;
		Object lso = ls.get(1);
		if(lso instanceof List){
			result = ConversionUtils.convert(processor.run((List<?>)lso),Number.class);
		}
		else{
			result = ConversionUtils.convert(ls.get(1),Number.class);
		}
		return String.valueOf(result);
	}

}
