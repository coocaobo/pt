package com.ez.util;

import net.sourceforge.pinyin4j.PinyinHelper;
import net.sourceforge.pinyin4j.format.HanyuPinyinCaseType;
import net.sourceforge.pinyin4j.format.HanyuPinyinOutputFormat;
import net.sourceforge.pinyin4j.format.HanyuPinyinToneType;
import net.sourceforge.pinyin4j.format.HanyuPinyinVCharType;
import net.sourceforge.pinyin4j.format.exception.BadHanyuPinyinOutputFormatCombination;

public class PyConverter {
	public static HanyuPinyinOutputFormat ft = new HanyuPinyinOutputFormat();
	
	static{
		ft.setCaseType(HanyuPinyinCaseType.LOWERCASE);
		ft.setToneType(HanyuPinyinToneType.WITHOUT_TONE);
		ft.setVCharType(HanyuPinyinVCharType.WITH_V);
	}
	
	public static String getFirstLetter(String s) {
    	 if(s == null || s.length() == 0){
    		 return "";
    	 }
    	 StringBuffer sb = new StringBuffer();
    	 char[] array = s.toCharArray();
    	 for(int i = 0; i < array.length; i ++){
    		 char c = array[i];
    		 if(c <= 128){
    			 sb.append(c);
    			 continue;
    		 }
    		 String[] ss = PinyinHelper.toHanyuPinyinStringArray(c);
    		 if(ss!=null && ss.length > 0){
    			 sb.append(ss[0].charAt(0));
    		 }
    		 else{
    			 sb.append("-");
    		 }
    	 }
    	 return sb.toString();
     }
     
	public static String getPinYin(String s){
	   	 if(s == null || s.length() == 0){
			 return "";
		 }
		 StringBuffer sb = new StringBuffer();
		 char[] array = s.toCharArray();
		 for(int i = 0; i < array.length; i ++){
			 char c = array[i];
			 if(c <= 128){
				 sb.append(c);
				 continue;
			 }
			 String[] ss;
			try {
				ss = PinyinHelper.toHanyuPinyinStringArray(c,ft);
				 if(ss.length > 0){
					 sb.append(ss[0]);
				 }
				 else{
					 sb.append(" ");
				 }
			} catch (BadHanyuPinyinOutputFormatCombination e) {
				sb.append(" ");
			}
		 }
		 return sb.toString();		
	}
	
}
