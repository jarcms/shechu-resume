package com.shechubbb.web.resume.resume.service;

import com.shechubbb.web.resume.resume.entity.AdminUser;

/**
 * 管理员服务接口
 */
public interface AdminUserService {
    
    /**
     * 登录验证
     */
    AdminUser login(String username, String password);
    
    /**
     * 根据用户名查找管理员
     */
    AdminUser findByUsername(String username);
    
    /**
     * 修改密码
     */
    boolean changePassword(String username, String oldPassword, String newPassword);
} 