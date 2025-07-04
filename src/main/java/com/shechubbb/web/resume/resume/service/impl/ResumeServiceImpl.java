package com.shechubbb.web.resume.resume.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.shechubbb.web.resume.resume.entity.Resume;
import com.shechubbb.web.resume.resume.mapper.ResumeMapper;
import com.shechubbb.web.resume.resume.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 简历服务实现类
 */
@Service
public class ResumeServiceImpl implements ResumeService {
    
    @Autowired
    private ResumeMapper resumeMapper;
    
    @Override
    public Page<Resume> getResumeList(long current, long size) {
        Page<Resume> page = new Page<>(current, size);
        QueryWrapper<Resume> queryWrapper = new QueryWrapper<>();
        queryWrapper.orderByDesc("create_time");
        return resumeMapper.selectPage(page, queryWrapper);
    }
    
    @Override
    public List<Resume> getAllResumes() {
        QueryWrapper<Resume> queryWrapper = new QueryWrapper<>();
        queryWrapper.orderByDesc("create_time");
        return resumeMapper.selectList(queryWrapper);
    }
    
    @Override
    public Resume getResumeById(Long id) {
        return resumeMapper.selectById(id);
    }
    
    @Override
    public Resume getActiveResume() {
        QueryWrapper<Resume> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("is_active", 1);
        return resumeMapper.selectOne(queryWrapper);
    }
    
    @Override
    public boolean saveResume(Resume resume) {
        return resumeMapper.insert(resume) > 0;
    }
    
    @Override
    public boolean updateResume(Resume resume) {
        return resumeMapper.updateById(resume) > 0;
    }
    
    @Override
    public boolean deleteResume(Long id) {
        return resumeMapper.deleteById(id) > 0;
    }
    
    @Override
    @Transactional
    public boolean setActiveResume(Long id) {
        // 先将所有简历设为非启用状态
        UpdateWrapper<Resume> updateWrapper = new UpdateWrapper<>();
        updateWrapper.set("is_active", 0);
        resumeMapper.update(null, updateWrapper);
        
        // 再将指定简历设为启用状态
        Resume resume = new Resume();
        resume.setId(id);
        resume.setIsActive(1);
        return resumeMapper.updateById(resume) > 0;
    }

    @Override
    public Resume getById(Long id) {
        return resumeMapper.selectById(id);
    }
} 