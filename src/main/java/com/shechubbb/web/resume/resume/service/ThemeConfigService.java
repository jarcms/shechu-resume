package com.shechubbb.web.resume.resume.service;

import com.shechubbb.web.resume.resume.entity.ThemeConfig;
import java.util.List;

public interface ThemeConfigService {
    
    /**
     * 获取所有主题配置
     */
    List<ThemeConfig> getAllThemes();
    
    /**
     * 获取当前启用的主题
     */
    ThemeConfig getActiveTheme();
    
    /**
     * 设置启用的主题
     */
    boolean setActiveTheme(Long id);
} 