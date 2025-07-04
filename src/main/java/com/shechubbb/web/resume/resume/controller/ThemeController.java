package com.shechubbb.web.resume.resume.controller;

import com.shechubbb.web.resume.resume.entity.ThemeConfig;
import com.shechubbb.web.resume.resume.service.ThemeConfigService;
import com.shechubbb.web.resume.resume.vo.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ThemeController {
    
    @Autowired
    private ThemeConfigService themeConfigService;
    
    /**
     * 管理端：获取所有主题配置
     */
    @GetMapping("/api/admin/themes")
    public Result<List<ThemeConfig>> getAllThemes() {
        List<ThemeConfig> themes = themeConfigService.getAllThemes();
        return Result.success(themes);
    }
    
    /**
     * 管理端：设置启用的主题
     */
    @PostMapping("/api/admin/themes/{id}/active")
    public Result<?> setActiveTheme(@PathVariable Long id) {
        boolean success = themeConfigService.setActiveTheme(id);
        if (success) {
            return Result.success("主题设置成功");
        }
        return Result.error("主题设置失败");
    }
    
    /**
     * 用户端：获取当前启用的主题
     */
    @GetMapping("/api/theme/active")
    public Result<ThemeConfig> getActiveTheme() {
        ThemeConfig theme = themeConfigService.getActiveTheme();
        if (theme != null) {
            return Result.success(theme);
        }
        return Result.error("未找到启用的主题");
    }
} 