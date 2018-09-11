package com.ez.util;

import org.apache.commons.lang.StringUtils;

/**
 * Created by Ez on 2017/12/7.
 */
public class EzStrUtil extends StringUtils {
    static public boolean isEmpty(String s) {
        if (s == null || s.length() == 0) {
            return true;
        }
        return false;
    }
}
