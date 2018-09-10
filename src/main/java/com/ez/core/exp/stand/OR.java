package com.ez.core.exp.stand;


import com.ez.core.exp.ExpException;
import com.ez.core.exp.Expression;
import com.ez.core.exp.ExpressionProcessor;

import java.util.List;

public class OR extends Expression {

	public OR(){
		symbol = "or";
		needBrackets = true;
	}
	
	@Override
	public Object run(List<?> ls, ExpressionProcessor processor) throws ExpException {
		try{
			for(int i = 1,size = ls.size();i < size; i ++){
				boolean r = (Boolean)processor.run((List<?>)ls.get(i));
				if(r){
					return true;
				}
			}
			return false;
		}
		catch(Exception e){
			throw new ExpException(e.getMessage());
		}
	}

}
