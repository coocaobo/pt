package com.ez.core.exp.stand;


import com.ez.core.exp.ExpException;
import com.ez.core.exp.Expression;
import com.ez.core.exp.ExpressionProcessor;
import com.ez.util.ConversionUtils;

import java.util.List;

public class IF extends Expression {
	
	public IF(){
		symbol = "if";
	}
	
	public Object run(List<?> ls, ExpressionProcessor processor) throws ExpException {
		try{
			boolean status =  (Boolean)processor.run((List<?>)ls.get(1));
			Object result = null;
			if(status){
				result = ls.get(2);
				if(result instanceof List){
					result = processor.run((List<?>)result);
				}
			}
			else{
				result = ls.get(3);
				if(result instanceof List){
					result = processor.run((List<?>)result);
				}
			}
			return result;
		}
		catch(Exception e){
			throw new ExpException(e.getMessage());
		}
	}
	
	@Override
	public String toString(List<?> ls, ExpressionProcessor processor) throws ExpException {
		try{
			StringBuffer sb = new StringBuffer(processor.toString((List<?>)ls.get(1)));
			sb.append(" ? ");
			
			Object lso = ls.get(2);
			if(lso instanceof List){
				sb.append(processor.toString((List<?>)lso));
			}
			else{
				sb.append(ConversionUtils.convert(lso, String.class));
			}
			sb.append(" : ");
			lso = ls.get(3);
			if(lso instanceof List){
				sb.append(processor.toString((List<?>)ls.get(3)));
			}
			else{
				sb.append(ConversionUtils.convert(lso, String.class));
			}
			return sb.toString();
		}
		catch(Exception e){
			throw new ExpException(e.getMessage());
		}
	}

}
