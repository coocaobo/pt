package com.ez.core.servlet.filter;


import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;


import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;




/** 
* 功能权限响应对象
* @author xxj 
*/
public class AuthCodeResponseWrapper extends HttpServletResponseWrapper {
	ByteArrayOutputStream _stream = new ByteArrayOutputStream();
	PrintWriter _pw=new PrintWriter(_stream);
	
	public AuthCodeResponseWrapper(HttpServletResponse response) {
		super(response);		
	}
    /**
     * 覆盖getWriter()方法，将字符流缓冲到本地
     */
	@Override
    public PrintWriter getWriter() throws IOException {
		return _pw;
    } 
	/**
	 * 覆盖getOutputStream()方法，将字节流缓冲到本地
	 */
    @Override
	public ServletOutputStream getOutputStream() throws IOException {
    	return new ServletOutputStream(){
			@Override
			public void write(int b) throws IOException {
				_stream.write(b);
			}
    	};
	}
    /**
     * 把缓冲区内容写入输出流后关闭
     * 
     *  @author xxj
     */
    public void flush(){
		try {
			_pw.flush();
			_pw.close();
			_stream.flush();
			_stream.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
    }
    /**
     * 获取字节流
     * @return
     */
    public ByteArrayOutputStream getByteArrayOutputStream(){
    	return _stream;
    } 
    /**
     * 将换出区内容转为文本输出
     * @return
     */
	public String getTextContent() {
		flush();
		String  ret = null;
		try {
			ret = new String(_stream.toByteArray(), "UTF-8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return ret;
//		return _stream.toString();
    }
}