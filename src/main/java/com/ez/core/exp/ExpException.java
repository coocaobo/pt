package com.ez.core.exp;

/**
 * @author robin
 */
public class ExpException extends RuntimeException {

    public final static String NO_SUCH_EXPRESSION = " NO_SUCH_EXPRESSION ";
    public final static String EXPRESSION_DEFINE_ERROR = " EXPRESSION_DEFINE_ERROR ";
    public final static String RUNTIME_ERROR = " RUNTIME_ERROR ";
    public final static String READVALUE_ERROR = " READVALUE_ERROR ";

    private static final long serialVersionUID = 9155432820010822690L;

    public ExpException(String msg) {
        super(msg);
    }

    public ExpException(String msg, Throwable e) {
        super(e);
    }

    public ExpException(Throwable e) {
        super(e);
    }
}
