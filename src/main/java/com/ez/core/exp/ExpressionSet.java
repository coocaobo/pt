package com.ez.core.exp;

import java.util.HashMap;
import java.util.List;

public class ExpressionSet {
    private String name;
    private HashMap<String, Expression> exprs = new HashMap<String, Expression>();

    public void setName(String nm) {
        name = nm;
    }

    public String getName() {
        return name;
    }

    public void setExpressions(List<Expression> exprs) {
        for (Expression expr : exprs) {
            addExpression(expr.getName(), expr);
        }
    }

    public void addExpression(String nm, Expression expr) {
        exprs.put(nm, expr);
    }

    public void register(String nm, Expression expr) {
        exprs.put(nm, expr);
    }

    public Expression getExpression(String nm) {
        if (exprs.containsKey(nm)) {
            return exprs.get(nm);
        }
        return null;
    }

}
