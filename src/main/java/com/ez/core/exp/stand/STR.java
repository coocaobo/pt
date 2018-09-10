package com.ez.core.exp.stand;


import com.ez.core.exp.ExpException;
import com.ez.core.exp.Expression;
import com.ez.core.exp.ExpressionProcessor;
import com.ez.util.ConversionUtils;

import java.util.List;

public class STR extends Expression {
	
	public STR(){
		name = "s";
	}

	public Object run(List<?> ls, ExpressionProcessor processor) throws ExpException {
		try{
			return ConversionUtils.convert(ls.get(1),String.class);
		}
		catch(Exception e){
			throw new ExpException(e.getMessage());
		}
	}
	
	public String toString(List<?> ls, ExpressionProcessor processor) throws ExpException {
		return "'" + run(ls,processor) + "'";
	}

}
