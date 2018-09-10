package com.ez.core.exp.stand;


import com.ez.core.exp.ExpException;
import com.ez.core.exp.Expression;
import com.ez.core.exp.ExpressionProcessor;

import java.util.List;

public class TOCHAR extends Expression {

	public TOCHAR() {
		symbol = "to_char";
	}

	public String toString(List<?> ls, ExpressionProcessor processor) throws ExpException {
		List<?> la1 = (List<?>) ls.get(1);
		String s = processor.toString(la1);
		List<?> la2 = (List<?>) ls.get(2);
		String p = (String) processor.run(la2);
		String sb = symbol;
		if (ls.size() > 3) {
			sb = (String) ls.get(3);
		}
		return sb + "(" + s + ",'" + p + "')";
	}

	@Override
	public Object run(List<?> ls, ExpressionProcessor processor) throws ExpException {
		return toString();
	}

}
