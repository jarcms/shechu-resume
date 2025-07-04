package com.shechubbb.web.resume.resume.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.shechubbb.web.resume.resume.entity.ThemeConfig;
import com.shechubbb.web.resume.resume.mapper.ThemeConfigMapper;
import com.shechubbb.web.resume.resume.service.ThemeConfigService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ThemeConfigServiceImpl extends ServiceImpl<ThemeConfigMapper, ThemeConfig> implements ThemeConfigService {
    
    @Override
    public List<ThemeConfig> getAllThemes() {
        return list();
    }
    
    @Override
    public ThemeConfig getActiveTheme() {
        return getOne(new LambdaQueryWrapper<ThemeConfig>()
                .eq(ThemeConfig::getIsActive, 1));
    }
    
    @Override
    @Transactional
    public boolean setActiveTheme(Long id) {
        // 先将所有主题设置为非启用
        update(new LambdaUpdateWrapper<ThemeConfig>()
                .set(ThemeConfig::getIsActive, 0));
        
        // 将指定主题设置为启用
        return update(new LambdaUpdateWrapper<ThemeConfig>()
                .eq(ThemeConfig::getId, id)
                .set(ThemeConfig::getIsActive, 1));
    }
} 