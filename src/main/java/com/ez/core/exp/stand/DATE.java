package com.ez.core.exp.stand;


import com.ez.core.exp.ExpException;
import com.ez.core.exp.Expression;
import com.ez.core.exp.ExpressionProcessor;
import com.ez.util.ConversionUtils;

import java.util.Date;
import java.util.List;

public class DATE extends Expression {

    public Object run(List<?> ls, ExpressionProcessor processor) throws ExpException {
        try {
            Date result = null;
            Object lso = ls.get(1);
            if (lso instanceof List) {
                result = ConversionUtils.convert(processor.run((List<?>) lso), Date.class);
            } else {
                result = ConversionUtils.convert(ls.get(1), Date.class);
            }
            return result;
        } catch (Exception e) {
            throw new ExpException(e.getMessage());
        }
    }

    public String toString(List<?> ls, ExpressionProcessor processor) throws ExpException {
        return "'" + ConversionUtils.convert(run(ls, processor), String.class) + "'";
    }
}
