package com.shechubbb.web.resume.resume.controller;

import com.shechubbb.web.resume.resume.entity.Resume;
import com.shechubbb.web.resume.resume.service.ResumeService;
import com.shechubbb.web.resume.resume.vo.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 用户端简历控制器
 */
@RestController
@RequestMapping("/api/user")
public class UserController {
    
    @Autowired
    private ResumeService resumeService;
    
    /**
     * 获取当前启用的简历
     */
    @GetMapping("/resume")
    public Result<Resume> getActiveResume() {
        Resume resume = resumeService.getActiveResume();
        if (resume != null) {
            return Result.success(resume);
        }
        return Result.error("暂无启用的简历");
    }
} 