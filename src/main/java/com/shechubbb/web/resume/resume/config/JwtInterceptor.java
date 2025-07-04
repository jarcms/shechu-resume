package com.shechubbb.web.resume.resume.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shechubbb.web.resume.resume.vo.Result;
import com.shechubbb.web.resume.resume.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;

/**
 * JWT拦截器
 */
@Component
public class JwtInterceptor implements HandlerInterceptor {
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 如果是OPTIONS请求，直接放行
        if ("OPTIONS".equals(request.getMethod())) {
            return true;
        }
        
        // 获取token
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            try {
                // 验证token
                String username = jwtUtil.getUsernameFromToken(token);
                if (username != null && !username.isEmpty()) {
                    return true;
                }
            } catch (Exception e) {
                returnJson(response, Result.error("token无效或已过期"));
                return false;
            }
        }
        
        returnJson(response, Result.error("未登录或登录已过期"));
        return false;
    }
    
    /**
     * 返回JSON数据
     */
    private void returnJson(HttpServletResponse response, Result<?> result) throws Exception {
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        PrintWriter writer = response.getWriter();
        writer.write(objectMapper.writeValueAsString(result));
        writer.flush();
        writer.close();
    }
} 