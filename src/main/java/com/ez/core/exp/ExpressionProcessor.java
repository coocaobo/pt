package com.ez.core.exp;

import com.ez.util.JSONUtils;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

public class ExpressionProcessor {
    private static final String BASE_LANG = "base";
    private static ConcurrentHashMap<String, ExpressionSet> languages = new ConcurrentHashMap<String, ExpressionSet>();
    private static ConcurrentHashMap<String, ExpressionProcessor> instances = new ConcurrentHashMap<String, ExpressionProcessor>();

    private String language;

    public ExpressionProcessor() {
        this(BASE_LANG);
    }

    public ExpressionProcessor(String lang) {
        language = lang;
        instances.put(language, this);
    }

    private static ExpressionProcessor instance(String lang) throws ExpException {
        if (lang == null) {
            return instance();
        }
        if (!languages.containsKey(lang)) {
            throw new ExpException("expr language[" + lang + "] is not found.");
        }
        ExpressionProcessor o = null;
        if (!instances.containsKey(lang)) {
            o = new ExpressionProcessor(lang);
        } else {
            o = instances.get(lang);
        }
        return o;
    }

    public static ExpressionProcessor instance() throws ExpException {
        return instance(BASE_LANG);
    }

    public void setExpressionSets(List<ExpressionSet> langs) {
        for (ExpressionSet lang : langs) {
            addExpressionSet(lang.getName(), lang);
        }
    }

    public void addExpressionSet(String nm, ExpressionSet es) {
        languages.put(nm, es);
    }

    public void addExpressionSet(ExpressionSet es) {
        addExpressionSet(BASE_LANG, es);
    }

    private Expression getExpression(String nm) {
        Expression expr = null;
        if (languages.containsKey(language)) {
            expr = languages.get(language).getExpression(nm);
        }
        if (expr == null) {
            expr = languages.get(BASE_LANG).getExpression(nm);
        }
        return expr;
    }

    private Expression lookup(List<?> ls) throws ExpException {
        if (ls == null || ls.isEmpty()) {
            throw new ExpException("expr list is empty.");
        }
        String nm = (String) ls.get(0);
        Expression expr = getExpression(nm);
        if (expr == null) {
            throw new ExpException("expr[" + nm + "] not found.");
        }
        return expr;
    }

    public List<?> parseStr(String exp) throws ExpException {
        try {
            List<?> ls = JSONUtils.parse(exp, List.class);
            return ls;
        } catch (Exception e) {
            throw new ExpException(e);
        }
    }

    public Object run(String exp) throws ExpException {
        return run(parseStr(exp));
    }

    public String toString(String exp) throws ExpException {
        return toString(parseStr(exp));
    }

    public Object run(List<?> ls) throws ExpException {
        return lookup(ls).run(ls, this);
    }

    public String toString(List<?> ls) throws ExpException {
        return lookup(ls).toString(ls, this);
    }

    public static void main(String[] args) {
        String  ss = ExpressionProcessor.instance().toString("['eq',['$', 'name'], ['s', '22']]");
        System.out.println(ss);
    }
}
