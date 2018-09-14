package com.ez.core.servlet.filter;

import org.apache.log4j.Logger;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by Ez on 2017/12/11.
 * 可以做一个过滤链，可以被动态配置
 */
public class BaseFilter implements Filter {
    private static final Logger logger = Logger.getLogger(BaseFilter.class);

    public void init(FilterConfig filterConfig) throws ServletException {

    }

    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        dealCors(servletRequest, servletResponse);
        filterChain.doFilter(servletRequest, servletResponse);
//        doFilterInternal(servletRequest, servletResponse,filterChain);
    }

    private void dealCors(ServletRequest servletRequest, ServletResponse servletResponse) {
        HttpServletResponse response = (HttpServletResponse)servletResponse;
        HttpServletRequest request = (HttpServletRequest)servletRequest;
        response.setContentType("textml;charset=UTF-8");
        response.addHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
        response.addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE,OPTIONS");
        response.addHeader("Access-Control-Allow-Headers", "Content-Type,X-Requested-With");
        response.addHeader("Access-Control-Max-Age", "1800");// 30 min
        response.addHeader("Access-Control-Allow-Credentials", "true");
        response.addHeader("XDomainRequestAllowed", "1");
    }

    private void doFilterInternal(ServletRequest request, ServletResponse response
            , FilterChain filter)
            throws ServletException, IOException {
        //是否启用筛选器
//        if (!_enbale) {
//            filter.doFilter(request, response);
//            return;
//        }
        HttpServletRequest req = (HttpServletRequest) request;
        String url = req.getRequestURI();
        //1 处理 request 请求信息
        //1.1 不验证的资源
//        Matcher matcher = _pattenUrl.matcher(url);
//        if (matcher.find()) {
//            filter.doFilter(request, response);
//            return;
//        }
        // 1.2 功能权限验证
        // 1.2.1 实例化一个响应包装器，用于缓存 response 中的内容到 CharArrayWriter 对象中
        AuthCodeResponseWrapper authResp = new AuthCodeResponseWrapper((HttpServletResponse) response);
        // 2  调用 doFilter() 方法，继续执行 filter 链中其它 filter
        filter.doFilter(request, authResp);
        // 3 处理 response 响应信息
        ServletOutputStream out = response.getOutputStream();
        // 3.1  不需要验证的 content-type
//        String contentType = response.getContentType();
//        if (!StringExtend.isNullOrEmpty(contentType)) {
//            matcher = _pattenContentType.matcher(contentType);
//            if (!matcher.find()) {
//                authResp.getByteArrayOutputStream().writeTo(out);
//                return;
//            }
//        }
        // 3.2 filter 链执行结束，获取 CharArrayWriter 的内容
        // 3.3  将 content 内容进行过滤
        String content = authResp.getTextContent();

//        String html = content.replece("hello word!", "你好，世界！"); //替换敏感词
//        if (StringExtend.isNullOrEmpty(html)) {
//            authResp.getByteArrayOutputStream().writeTo(out);
//            return;
//        }
//        // 3.4 将过滤后的内容写入响应流中
//        if (!_rule.isFilter()) {//没有进行过功能筛选则原样输出
//            authResp.getByteArrayOutputStream().writeTo(out);
//            return;
//        }
        //3.5 写入输出流
        out.write(content.getBytes("UTF-8"));
    }


    public void destroy() {

    }
}
