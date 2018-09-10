package com.ez.core.exp.stand;


import com.ez.core.exp.ExpException;
import com.ez.core.exp.Expression;
import com.ez.core.exp.ExpressionProcessor;
import com.ez.util.ConversionUtils;
import org.apache.commons.lang.StringUtils;

import java.util.List;
import java.util.regex.Pattern;

public class LIKE extends Expression {
	
	public LIKE(){
		symbol = "like";
	}

	public Object run(List<?> ls, ExpressionProcessor processor) throws ExpException {
		try{
			Object lso = ls.get(1);
			String str1 = null;
			if(lso instanceof List){
				str1 = ConversionUtils.convert(processor.run((List<?>)lso),String.class);
			}
			else{
				str1 = ConversionUtils.convert(lso,String.class);
			}
			
			lso = ls.get(2);
			String str2 = null;
			if(lso instanceof List){
				str2 = ConversionUtils.convert(processor.run((List<?>)lso),String.class);
			}
			else{
				str2 = ConversionUtils.convert(lso,String.class);
			}
			
			if(!StringUtils.contains(str2, "%")){
				str2 = str2 + "%";
			}
			
			Pattern pattern = Pattern.compile(str2.replaceAll("%", ".*"));
			return pattern.matcher(str1).find();
		}
		catch(Exception e){
			throw new ExpException(e.getMessage());
		}
	}
	
	@SuppressWarnings("unchecked")
	public String toString(List<?> ls, ExpressionProcessor processor) throws ExpException {
		StringBuffer sb = new StringBuffer();
		Object lso = ls.get(1);
		String str1 = null;
		if(lso instanceof List){
			str1 = processor.toString((List<?>)lso);
		}
		else{
			str1 = ConversionUtils.convert(lso,String.class);
		}
		sb.append(str1).append(" ").append(symbol).append(" ");
		
		lso = ls.get(2);
		String str2 = null;
		
		if(lso instanceof List){
			str2 = processor.toString((List<?>)lso);
				if(str2.startsWith("'")){
					str2 = str2.substring(1);
				}
				if(str2.endsWith("'")){
					str2 = str2.substring(0,str2.length() - 1);
				}
				sb.append("'").append(str2);
				if(!StringUtils.contains(str2, "%") && !StringUtils.contains(str2, "_")){
					sb.append("%");
				}
				sb.append("'");
		}
		else{
			str2 = ConversionUtils.convert(lso,String.class);
			sb.append("'").append(str2);
			if(!StringUtils.contains(str2, "%") && !StringUtils.contains(str2, "_")){
				sb.append("%");
			}
			sb.append("'");
		}
		
		return sb.toString();
	}

}
