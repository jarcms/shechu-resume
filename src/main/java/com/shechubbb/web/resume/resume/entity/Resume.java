package com.shechubbb.web.resume.resume.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 简历实体类
 */
@Data
@TableName("resume")
public class Resume {
    
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    
    /**
     * 简历名称
     */
    private String name;
    
    /**
     * 是否启用(0-否,1-是，只能有一个启用)
     */
    private Integer isActive;
    
    /**
     * 简历内容(JSON格式)
     */
    private String content;
    
    /**
     * 创建时间
     */
    private LocalDateTime createTime;
    
    /**
     * 更新时间
     */
    private LocalDateTime updateTime;
} 