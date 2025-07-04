package com.shechubbb.web.resume.resume.controller;

import com.shechubbb.web.resume.resume.dto.ChangePasswordDTO;
import com.shechubbb.web.resume.resume.dto.LoginDTO;
import com.shechubbb.web.resume.resume.entity.AdminUser;
import com.shechubbb.web.resume.resume.service.AdminUserService;
import com.shechubbb.web.resume.resume.util.JwtUtil;
import com.shechubbb.web.resume.resume.vo.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * 管理员控制器
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    @Autowired
    private AdminUserService adminUserService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    /**
     * 管理员登录
     */
    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody @Validated LoginDTO loginDTO) {
        AdminUser adminUser = adminUserService.login(loginDTO.getUsername(), loginDTO.getPassword());
        if (adminUser != null) {
            String token = jwtUtil.generateToken(adminUser.getUsername());
            Map<String, Object> data = new HashMap<>();
            data.put("token", token);
            data.put("username", adminUser.getUsername());
            return Result.success("登录成功", data);
        }
        return Result.error("用户名或密码错误");
    }
    
    /**
     * 修改密码
     */
    @PostMapping("/changePassword")
    public Result<?> changePassword(@RequestBody @Validated ChangePasswordDTO changePasswordDTO, HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            String username = jwtUtil.getUsernameFromToken(token);
            
            boolean success = adminUserService.changePassword(username, changePasswordDTO.getOldPassword(), changePasswordDTO.getNewPassword());
            if (success) {
                return Result.success("密码修改成功");
            }
            return Result.error("旧密码错误");
        }
        return Result.error("未登录或登录已过期");
    }
    
    /**
     * 获取当前用户信息
     */
    @GetMapping("/userInfo")
    public Result<Map<String, Object>> getUserInfo(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            String username = jwtUtil.getUsernameFromToken(token);
            
            AdminUser adminUser = adminUserService.findByUsername(username);
            if (adminUser != null) {
                Map<String, Object> data = new HashMap<>();
                data.put("username", adminUser.getUsername());
                return Result.success(data);
            }
        }
        return Result.error("未登录或登录已过期");
    }
} 