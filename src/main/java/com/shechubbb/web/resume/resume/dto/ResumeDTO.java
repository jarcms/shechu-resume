package com.shechubbb.web.resume.resume.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * 简历DTO
 */
@Data
public class ResumeDTO {
    
    private Long id;
    
    @NotBlank(message = "简历名称不能为空")
    private String name;
    
    private Integer isActive;
    
    @NotBlank(message = "简历内容不能为空")
    private String content;
} 