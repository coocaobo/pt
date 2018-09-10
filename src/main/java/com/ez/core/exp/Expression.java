package com.ez.core.exp;

import com.ez.util.ConversionUtils;

import java.util.List;

public abstract class Expression {
    protected String symbol;
    protected String name;
    protected boolean needBrackets = false;

    public abstract Object run(List<?> ls, ExpressionProcessor processor) throws ExpException;

    public String getName() {
        if (name != null) {
            return name;
        } else {
            String nm = this.getClass().getName();
            int n = nm.lastIndexOf(".");
            name = nm.substring(n + 1).toLowerCase();
        }
        return name;
    }

    @SuppressWarnings("unchecked")
    public String toString(List<?> ls, ExpressionProcessor processor) throws ExpException {
        try {
            StringBuffer sb = new StringBuffer();
            if (needBrackets) {
                sb.append("(");
            }
            for (int i = 1, size = ls.size(); i < size; i++) {
                if (i > 1) {
                    sb.append(" ").append(symbol).append(" ");
                }
                Object lso = ls.get(i);
                String s = null;
                if (lso instanceof List) {
                    s = processor.toString((List<Object>) lso);
                } else {
                    if (lso instanceof String) {
                        s = "'" + lso + "'";
                    } else {

                        s = ConversionUtils.convert(lso, String.class);
                    }
                }
                sb.append(s);
            }
            if (needBrackets) {
                sb.append(")");
            }
            return sb.toString();
        } catch (Exception e) {
            throw new ExpException(e);
        }
    }
}
