package com.ez.core.exp.stand;


import com.ez.core.exp.ExpException;
import com.ez.core.exp.Expression;
import com.ez.core.exp.ExpressionProcessor;

import java.util.HashMap;
import java.util.List;

public class REF extends Expression {
	
	public REF(){
		symbol = "$";
		name = symbol;
	}
	
	public Object run(List<?> ls, ExpressionProcessor processor) throws ExpException {
		try{
			String nm = (String)ls.get(1);
			if (nm.startsWith("%")) {
				nm = nm.substring(1);
			}
			return REFUtil.get(nm);
		}
		catch(Exception e){
			throw new ExpException(e.getMessage());
		}
	}
	
	public String toString(List<?> ls,  ExpressionProcessor processor) throws ExpException {
		try{
			String nm = (String)ls.get(1);
			if (!nm.startsWith("%")) {
				return nm;
			}
//			Boolean forPreparedStatement = ContextUtils.get("$exp.forPreparedStatement",Boolean.class);
			Object o = run(ls,processor);
//
//			if(forPreparedStatement != null && forPreparedStatement == true){
//				nm = nm.substring(1);
//
//				HashMap<String,Object> parameters = ContextUtils.get("$exp.statementParameters",HashMap.class);
//				parameters.put(nm, o);
//				return ":"  + nm;
//			}
//			else{
				if(o instanceof Number){
					return String.valueOf(o);
				}
				else{
					return "'" + String.valueOf(o) + "'";
				}
//			}
		}
		catch(Exception e){
			throw new ExpException(e);
		}
	}

}
