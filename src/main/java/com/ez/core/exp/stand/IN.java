package com.ez.core.exp.stand;


import com.ez.core.exp.ExpException;
import com.ez.core.exp.Expression;
import com.ez.core.exp.ExpressionProcessor;
import com.ez.util.ConversionUtils;

import java.util.HashSet;
import java.util.List;

public class IN extends Expression {

	public IN() {
		symbol = "in";
	}

	public Object run(List<?> ls, ExpressionProcessor processor) throws ExpException {
		try {
			Object o = processor.run((List<?>) ls.get(1));
			List<?> rang = (List<?>) ls.get(2);
			HashSet<Object> set = new HashSet<Object>();
			set.addAll(rang);
			return set.contains(o);
		} catch (Exception e) {
			throw new ExpException(e.getMessage());
		}
	}

	public String toString(List<?> ls, ExpressionProcessor processor) throws ExpException {
		try {
			Object o = processor.toString((List<?>) ls.get(1));
			StringBuffer sb = new StringBuffer(ConversionUtils.convert(o, String.class));
			sb.append(" ").append(symbol).append("(");
			List<?> rang = (List<?>) ls.get(2);
			for (int i = 0, size = rang.size(); i < size; i++) {
				if (i > 0) {
					sb.append(",");
				}
				Object r = rang.get(i);
				String s = ConversionUtils.convert(r, String.class);
				if (r instanceof Number) {
					sb.append(s);
				} else if(r instanceof List){
					s = ConversionUtils.convert(processor.run((List<?>)r), String.class);
					sb.append(s);
				} else {
//					sb.append("'").append(s).append("'");
					sb.append(s);
				}
			}
			return sb.append(")").toString();
		} catch (Exception e) {
			throw new ExpException(e.getMessage());
		}
	}

	public static void main(String[] args) {

	}

}
