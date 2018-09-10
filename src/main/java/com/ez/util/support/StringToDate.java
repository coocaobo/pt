package com.ez.util.support;

import com.ez.util.EzStrUtil;
import org.joda.time.DateTime;
import org.joda.time.LocalDate;
import org.joda.time.format.DateTimeFormat;
import org.springframework.core.convert.converter.Converter;

import java.util.Date;

public class StringToDate implements Converter<String, Date> {

    private String DATE_FORMAT = "yyyy-MM-dd";
    private String DATETIME1_FORMAT = "yyyy-MM-dd HH:mm:ss";


    public Date convert(String source) {
        if (EzStrUtil.isEmpty(source)) {
            return null;
        }
        if (EzStrUtil.contains(source, "T")) {
            return DateTimeFormat.forPattern(DATETIME1_FORMAT).parseDateTime(source.replace("T", " ")).toDate();
        } else if (EzStrUtil.contains(source, ":")) {
            return DateTimeFormat.forPattern(DATETIME1_FORMAT).parseDateTime(source).toDate();
        } else if (EzStrUtil.contains(source, "-")) {
            return DateTimeFormat.forPattern(DATE_FORMAT).parseDateTime(source).toDate();
        } else if (EzStrUtil.equals(source.toLowerCase(), "now")) {
            return new Date();
        } else if (EzStrUtil.equals(source.toLowerCase(), "today")) {
            return (new DateTime()).withTimeAtStartOfDay().toDate();
        } else if (EzStrUtil.equals(source.toLowerCase(), "yesterday")) {
            return (new LocalDate().minusDays(1).toDate());
        } else if (EzStrUtil.equals(source.toLowerCase(), "tomorrow")) {
            return (new LocalDate().plusDays(1).toDate());
        } else {
//			throw new IllegalArgumentException("Invalid date string value '" + source + "'");
            return null;
        }


    }

}
