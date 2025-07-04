-- 创建数据库
CREATE DATABASE IF NOT EXISTS resume_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE resume_db;

-- 管理员表
CREATE TABLE admin_user (
    id BIGINT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '登录名',
    password VARCHAR(100) NOT NULL COMMENT '密码(BCrypt加密)',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 简历表
CREATE TABLE resume (
    id BIGINT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '简历名称',
    is_active TINYINT DEFAULT 0 COMMENT '是否启用(0-否,1-是，只能有一个启用)',
    content JSON NOT NULL COMMENT '简历内容(JSON格式)',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 主题配置表
CREATE TABLE theme_config (
    id BIGINT PRIMARY KEY,
    name VARCHAR(50) NOT NULL COMMENT '主题名称',
    is_active TINYINT DEFAULT 0 COMMENT '是否启用(0-否,1-是)',
    primary_color VARCHAR(7) NOT NULL COMMENT '主题色（hex格式）',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 初始管理员数据
INSERT INTO admin_user (id, username, password)
VALUES (1, 'admin', '$2a$10$y8A8tX4jvbMpNbXbm3b02.p.hHXPTen5Zze5tOFZ.MHWEFTdsx3PO');
-- 默认密码：admin123

-- 插入舍出的个人简历数据
INSERT INTO resume (id, name, is_active, content, create_time, update_time) VALUES (
    1,
    '舍出的个人简历',
    1,
    '{
        "personalInfo": {
            "name": "舍出",
            "title": "JAVA架构师",
            "phone": "138****8888",
            "email": "shechu@example.com",
            "location": "北京市朝阳区"
        },
        "summary": "拥有十几年互联网公司开发经验的资深JAVA架构师，在大型分布式系统设计、微服务架构、高并发系统优化等方面有着丰富的实战经验。曾在阿里巴巴、腾讯等知名互联网公司担任核心技术岗位，主导过多个千万级用户产品的架构设计与技术升级，对云原生、容器化部署、DevOps等前沿技术有深入理解和实践。",
        "workExperience": [
            {
                "company": "腾讯科技有限公司",
                "position": "高级架构师",
                "startDate": "2019-03",
                "endDate": "至今",
                "description": "负责腾讯云核心产品的架构设计与优化，主导微服务架构转型项目，系统性能提升300%。带领20+人技术团队，制定技术规范和最佳实践，推动DevOps流程标准化。参与腾讯云容器服务、消息队列等核心产品的架构设计，服务数千万用户。"
            },
            {
                "company": "阿里巴巴集团",
                "position": "资深开发工程师",
                "startDate": "2015-06",
                "endDate": "2019-02",
                "description": "在淘宝技术部负责交易系统的架构升级和性能优化，参与双11大促技术保障工作。主导分布式缓存系统重构，系统响应时间降低50%。负责新人培养和技术分享，获得阿里巴巴优秀员工奖。"
            },
            {
                "company": "京东商城",
                "position": "高级开发工程师",
                "startDate": "2012-08",
                "endDate": "2015-05",
                "description": "负责京东商城订单系统和支付系统的开发与维护，参与系统架构升级和数据库优化。独立完成多个核心模块的重构工作，代码质量和系统稳定性显著提升。"
            },
            {
                "company": "美团网",
                "position": "JAVA开发工程师",
                "startDate": "2010-07",
                "endDate": "2012-07",
                "description": "参与美团早期核心业务系统开发，负责团购系统后端开发和API设计。在快速业务增长过程中，持续优化系统架构，保障系统稳定运行。"
            }
        ],
        "projectExperience": [
            {
                "name": "腾讯云微服务架构平台",
                "role": "架构师",
                "startDate": "2020-01",
                "endDate": "2023-12",
                "technologies": ["Spring Cloud", "Kubernetes", "Docker", "Redis", "MySQL", "Kafka", "Elasticsearch"],
                "description": "主导设计和实现腾讯云微服务架构平台，支持服务注册发现、配置管理、链路追踪、监控告警等功能。平台服务超过1000+个微服务实例，日处理请求量达到10亿+。采用云原生架构，支持弹性扩缩容，大幅提升了系统的可用性和可维护性。"
            },
            {
                "name": "阿里淘宝交易系统重构",
                "role": "技术负责人",
                "startDate": "2017-03",
                "endDate": "2018-11",
                "technologies": ["Spring Boot", "Dubbo", "MyBatis", "Redis", "RocketMQ", "Sentinel"],
                "description": "负责淘宝核心交易系统的架构重构，从单体应用拆分为微服务架构。通过引入分布式缓存、消息队列、熔断降级等技术手段，系统吞吐量提升5倍，可用性达到99.99%。项目涉及数百万行代码重构，零故障上线。"
            },
            {
                "name": "京东订单中心系统",
                "role": "核心开发",
                "startDate": "2013-05",
                "endDate": "2015-03",
                "technologies": ["Spring", "MyBatis", "Oracle", "Redis", "ActiveMQ"],
                "description": "参与京东订单中心系统的设计与开发，负责订单状态机、库存扣减、支付回调等核心功能模块。通过数据库分库分表、缓存优化等技术手段，支撑日订单量千万级别的业务需求。"
            }
        ],
        "skills": ["Java", "Spring Boot", "Spring Cloud", "MyBatis", "MySQL", "Redis", "Kafka", "Elasticsearch", "Docker", "Kubernetes", "微服务架构", "分布式系统", "高并发优化", "系统架构设计"],
        "education": [
            {
                "school": "北京理工大学",
                "major": "计算机科学与技术",
                "degree": "本科",
                "startDate": "2006-09",
                "endDate": "2010-06"
            }
        ]
    }',
    NOW(),
    NOW()
);

-- 插入舍出的备份简历数据
INSERT INTO resume (id, name, is_active, content, create_time, update_time) VALUES (
    2,
    '舍出的备份简历',
    0,
    '{
        "personalInfo": {
            "name": "舍出",
            "title": "高级技术专家",
            "phone": "138****8888",
            "email": "shechu@example.com",
            "location": "北京市海淀区"
        },
        "summary": "拥有十余年大型互联网公司研发经验，专注于云原生技术、分布式系统和高可用架构设计。曾主导多个大型技术中台建设，对微服务治理、容器编排、DevOps实践等领域有深入研究。善于技术攻坚和团队管理，推动过多个重大技术革新项目，在确保系统稳定性的同时持续推进技术演进。",
        "workExperience": [
            {
                "company": "腾讯科技有限公司",
                "position": "技术专家",
                "startDate": "2019-03",
                "endDate": "至今",
                "description": "作为腾讯云原生团队技术专家，主导容器平台和微服务治理中心的建设。设计实现了支持万级节点的容器编排系统，将平台部署效率提升500%。建立了完整的微服务治理体系，包括服务网格、链路追踪、监控告警等，服务可用性达到99.999%。"
            },
            {
                "company": "阿里巴巴集团",
                "position": "高级技术专家",
                "startDate": "2015-06",
                "endDate": "2019-02",
                "description": "负责阿里云容器服务的架构设计和研发管理，打造了业界领先的容器PaaS平台。主导了服务网格产品从0到1的建设过程，月服务客户数超过10万。获得年度技术创新奖，多次在技术大会上进行经验分享。"
            },
            {
                "company": "京东商城",
                "position": "资深架构师",
                "startDate": "2012-08",
                "endDate": "2015-05",
                "description": "主导京东技术中台建设，设计了统一的微服务开发框架和治理平台。推动了全公司级的DevOps转型，将发布效率提升10倍，故障率降低80%。建立了技术评审和架构设计规范，显著提升了系统可维护性。"
            },
            {
                "company": "美团网",
                "position": "技术经理",
                "startDate": "2010-07",
                "endDate": "2012-07",
                "description": "带领团队完成美团支付系统的微服务化改造，实现了支付系统的高可用部署。设计了分布式事务解决方案，确保了支付系统的数据一致性。推动了系统监控和告警体系建设，大幅提升了故障发现和处理效率。"
            }
        ],
        "projectExperience": [
            {
                "name": "云原生PaaS平台",
                "role": "总架构师",
                "startDate": "2021-03",
                "endDate": "2023-12",
                "technologies": ["Kubernetes", "Istio", "Prometheus", "Grafana", "GitOps", "Helm", "Harbor"],
                "description": "设计并落地了企业级云原生PaaS平台，提供容器服务、微服务治理、监控运维等一站式解决方案。平台支持多云部署，通过GitOps实现了应用全生命周期管理。平台现服务于集团内200+核心应用，月均部署次数超过10000次，故障恢复时间从小时级降低到分钟级。"
            },
            {
                "name": "微服务治理中心",
                "role": "技术负责人",
                "startDate": "2019-06",
                "endDate": "2021-02",
                "technologies": ["Spring Cloud", "Service Mesh", "OpenTelemetry", "Elasticsearch", "Kafka", "gRPC"],
                "description": "构建了统一的微服务治理中心，实现服务注册发现、配置管理、限流熔断、链路追踪等功能的统一管理。支持多协议接入，无侵入埋点，分布式追踪覆盖率达到95%。平台接入服务数超过3000个，日均处理调用量突破千亿级。"
            },
            {
                "name": "DevOps自动化平台",
                "role": "架构设计师",
                "startDate": "2018-01",
                "endDate": "2019-05",
                "technologies": ["Jenkins", "Docker", "Ansible", "Python", "Shell", "GitLab CI"],
                "description": "设计了一站式DevOps平台，集成代码管理、构建发布、环境管理、测试自动化等功能。实现了配置即代码，支持环境一键复制和回滚。平台使用后将应用发布时间从小时级缩短到分钟级，研发效率提升300%。"
            }
        ],
        "skills": ["云原生架构", "微服务治理", "DevOps", "Kubernetes", "Service Mesh", "容器技术", "Java", "Spring Cloud", "分布式系统", "高可用架构", "技术管理", "架构设计", "自动化运维", "性能优化"],
        "education": [
            {
                "school": "北京理工大学",
                "major": "计算机科学与技术",
                "degree": "本科",
                "startDate": "2006-09",
                "endDate": "2010-06"
            }
        ]
    }',
    NOW(),
    NOW()
);

-- 预设主题数据
INSERT INTO theme_config (id, name, is_active, primary_color) VALUES
(1, '标准蓝', 1, '#4B6EAF'),
(2, '深邃蓝', 0, '#2C3E50'),
(3, '天空蓝', 0, '#739AE8'),
(4, '珊瑚红', 0, '#F67280'),
(5, '森林绿', 0, '#4CAF50'),
(6, '活力橙', 0, '#E67E22'),
(7, '热情红', 0, '#E74C3C'),
(8, '沉稳棕', 0, '#795548'),
(9, '湖水蓝', 0, '#3498DB'),
(10, '靛青蓝', 0, '#476EBF'),
(11, '优雅紫', 0, '#9B59B6'),
(12, '金秋黄', 0, '#F1C40F');

