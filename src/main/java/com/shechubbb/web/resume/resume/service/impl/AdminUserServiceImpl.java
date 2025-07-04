package com.shechubbb.web.resume.resume.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.shechubbb.web.resume.resume.entity.AdminUser;
import com.shechubbb.web.resume.resume.mapper.AdminUserMapper;
import com.shechubbb.web.resume.resume.service.AdminUserService;
import com.shechubbb.web.resume.resume.util.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 管理员服务实现类
 */
@Service
public class AdminUserServiceImpl implements AdminUserService {
    
    @Autowired
    private AdminUserMapper adminUserMapper;
    
    @Override
    public AdminUser login(String username, String password) {
        AdminUser adminUser = findByUsername(username);
        if (adminUser != null && PasswordUtil.matches(password, adminUser.getPassword())) {
            return adminUser;
        }
        return null;
    }
    
    @Override
    public AdminUser findByUsername(String username) {
        QueryWrapper<AdminUser> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", username);
        return adminUserMapper.selectOne(queryWrapper);
    }
    
    @Override
    public boolean changePassword(String username, String oldPassword, String newPassword) {
        AdminUser adminUser = findByUsername(username);
        if (adminUser != null && PasswordUtil.matches(oldPassword, adminUser.getPassword())) {
            adminUser.setPassword(PasswordUtil.encode(newPassword));
            return adminUserMapper.updateById(adminUser) > 0;
        }
        return false;
    }
} 