package com.ez.core.exp.stand;

import com.ez.core.exp.ExpException;
import com.ez.core.exp.Expression;
import com.ez.core.exp.ExpressionProcessor;
import com.ez.util.ConversionUtils;

import java.util.List;


public class DIV extends Expression {
	
	public DIV(){
		symbol = "%";
	}
	
	public Object run(List<?> ls, ExpressionProcessor processor)throws ExpException {
		try{
			Number result = null;
			Object lso = ls.get(1);
			if(lso instanceof List){
				result = (Number)processor.run((List<?>)lso);
			}
			else{
				result = ConversionUtils.convert(lso, Number.class);
			}
			for(int i = 2,size = ls.size(); i < size; i ++){
				Number v = null;
				lso = ls.get(i);
				if(lso instanceof List){
					v = (Number)processor.run((List<?>)lso);
				}
				else{
					v = ConversionUtils.convert(lso, Number.class);
				}
				result = result.doubleValue() / v.doubleValue();
			}
			return result;
		}
		catch(Exception e){
			throw new ExpException(e.getMessage());
		}
	}

}
