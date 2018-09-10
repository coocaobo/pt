package com.ez.core.exp.stand;


import com.ez.core.exp.ExpException;
import com.ez.core.exp.Expression;
import com.ez.core.exp.ExpressionProcessor;
import com.ez.util.ConversionUtils;
import com.ez.util.PyConverter;

import java.util.List;

public class PY extends Expression {

	public PY(){
		symbol = "pingyin";
	}
	
	public Object run(List<?> ls, ExpressionProcessor processor) throws ExpException {
		
		try{
			Object lso = ls.get(1);
			String str = null;
			if(lso instanceof List){
				str = (String)processor.run((List<?>)lso);
			}
			else{
				str = ConversionUtils.convert(lso, String.class);
			}
			return PyConverter.getFirstLetter(str);
		}
		catch(Exception e){
			throw new ExpException(e.getMessage());
		}
		
	}
	
	public String toString(List<?> ls,ExpressionProcessor processor) throws ExpException{
		return symbol + "(" + processor.toString((List<?>)ls.get(1)) + ")";
	}

}
