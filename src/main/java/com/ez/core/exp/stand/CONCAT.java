package com.ez.core.exp.stand;

import com.ez.core.exp.ExpException;
import com.ez.core.exp.Expression;
import com.ez.core.exp.ExpressionProcessor;
import com.ez.util.ConversionUtils;

import java.util.List;

public class CONCAT extends Expression {

	public CONCAT(){
        symbol = "concat";
	}
	
	public Object run(List<?> ls, ExpressionProcessor processor) throws ExpException {
		
		try{
			StringBuffer sb = new StringBuffer();
			for(int i = 1,size = ls.size();i < size; i ++){
				Object o = ls.get(i);
				if(o instanceof List){
					o = processor.run((List<?>)o);
				}
				sb.append(ConversionUtils.convert(o, String.class));
			}
			return sb.toString();
		}
		catch(Exception e){
			throw new ExpException(e.getMessage());
		}

	}
	
	@Override
	public String toString(List<?> ls,ExpressionProcessor processor) throws ExpException{
		return "'" + run(ls, processor) + "'";
	}

}