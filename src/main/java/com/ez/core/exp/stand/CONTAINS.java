package com.ez.core.exp.stand;


import com.ez.core.exp.ExpException;
import com.ez.core.exp.Expression;
import com.ez.core.exp.ExpressionProcessor;

import java.util.List;

public class CONTAINS extends Expression {

    public Object run(List<?> ls, ExpressionProcessor processor) throws ExpException {
        Boolean result = false;
        try {
            List<?> ja1 = (List<?>) ls.get(1);
            String s1 = (String) processor.run(ja1);
            List<?> ja2 = (List<?>) ls.get(2);
            String s2 = (String) processor.run(ja2);
            if (s1.contains(s2)) {
                result = true;
            }
        } catch (Exception e) {
            throw new ExpException(e);
        }
        return result;
    }

}
