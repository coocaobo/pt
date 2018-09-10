package com.ez.core.exp.stand;


import com.ez.core.exp.ExpException;
import com.ez.core.exp.Expression;
import com.ez.core.exp.ExpressionProcessor;
import com.ez.util.ConversionUtils;

import java.util.List;

public class LE extends Expression {

    public LE() {
        symbol = "<=";
    }

    public Object run(List<?> ls, ExpressionProcessor processor) throws ExpException {
        try {
            Object lso = ls.get(1);
            Number v1 = null;
            if (lso instanceof List) {
                v1 = ConversionUtils.convert(processor.run((List<?>) lso), Number.class);
            } else {
                v1 = ConversionUtils.convert(lso, Number.class);
            }
            for (int i = 2, size = ls.size(); i < size; i++) {
                Number v2 = null;
                lso = ls.get(i);
                if (lso instanceof List) {
                    v2 = ConversionUtils.convert(processor.run((List<?>) lso), Number.class);
                } else {
                    v2 = ConversionUtils.convert(lso, Number.class);
                }
                if (v1.doubleValue() > v2.doubleValue()) {
                    return false;
                }
            }
            return true;
        } catch (Exception e) {
            throw new ExpException(e.getMessage());
        }
    }

}
