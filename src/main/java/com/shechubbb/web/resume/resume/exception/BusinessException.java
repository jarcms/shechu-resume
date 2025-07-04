package com.shechubbb.web.resume.resume.exception;

/**
 * 业务异常类
 */
public class BusinessException extends RuntimeException {
    
    public BusinessException(String message) {
        super(message);
    }
    
    public BusinessException(String message, Throwable cause) {
        super(message, cause);
    }
} 