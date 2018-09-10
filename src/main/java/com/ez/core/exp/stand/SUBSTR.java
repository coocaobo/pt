package com.ez.core.exp.stand;


import com.ez.core.exp.ExpException;
import com.ez.core.exp.Expression;
import com.ez.core.exp.ExpressionProcessor;
import com.ez.util.ConversionUtils;
import com.ez.util.EzStrUtil;

import java.util.List;

public class SUBSTR extends Expression {

	public SUBSTR(){
		name = symbol = "substring";
	}
	
	@Override
	public Object run(List<?> ls, ExpressionProcessor processor) throws ExpException {
		try{
			String str = (String)processor.run((List<?>)ls.get(1));
			int start = ConversionUtils.convert(ls.get(2), Integer.class);
			if(ls.size() == 4){
				int end = ConversionUtils.convert(ls.get(3), Integer.class);
				return EzStrUtil.substring(str, start, end);
			}
			else{
				return str.substring(start);
			}
			
		}
		catch(Exception e){
			throw new ExpException(e.getMessage());
		}
	}
	
	@Override
	public String toString(List<?> ls, ExpressionProcessor processor) throws ExpException {
		try{
			String str = processor.toString((List<?>)ls.get(1));
			int start = ConversionUtils.convert(ls.get(2), Integer.class);
			
			StringBuffer sb = new StringBuffer(symbol).append("(").append(str).append(",").append(start);
			if(ls.size() == 4){
				int end = ConversionUtils.convert(ls.get(3), Integer.class);
				sb.append(",").append(end);
			}
			sb.append(")");
			return sb.toString();
		}
		catch(Exception e){
			throw new ExpException(e.getMessage());
		}
	}

}
