package com.shechubbb.web.resume.resume.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.shechubbb.web.resume.resume.dto.ResumeDTO;
import com.shechubbb.web.resume.resume.entity.Resume;

import java.util.List;

/**
 * 简历服务接口
 */
public interface ResumeService {

    /**
     * 分页查询简历列表
     */
    Page<Resume> getResumeList(long current, long size);

    /**
     * 获取所有简历
     */
    List<Resume> getAllResumes();

    /**
     * 根据ID获取简历
     */
    Resume getResumeById(Long id);

    /**
     * 获取启用的简历
     */
    Resume getActiveResume();

    /**
     * 保存简历
     */
    boolean saveResume(Resume resume);

    /**
     * 更新简历
     */
    boolean updateResume(Resume resume);

    /**
     * 删除简历
     */
    boolean deleteResume(Long id);

    /**
     * 设置简历为启用状态
     */
    boolean setActiveResume(Long id);

    Resume getById(Long id);

}
