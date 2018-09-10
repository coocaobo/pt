package com.ez.core.exp.stand;

import com.ez.core.exp.ExpException;
import com.ez.core.exp.Expression;
import com.ez.core.exp.ExpressionProcessor;

import java.util.List;

public class AND extends Expression {

    public AND() {
        symbol = "and";
        needBrackets = true;
    }

    public Object run(List<?> ls, ExpressionProcessor processor) throws ExpException {
        try {
            for (int i = 1, size = ls.size(); i < size; i++) {
                boolean r = (Boolean) processor.run((List<?>) ls.get(i));
                if (!r) {
                    return false;
                }
            }
            return true;
        } catch (Exception e) {
            throw new ExpException(e.getMessage());
        }
    }

}
