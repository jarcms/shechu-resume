// 简历页面主要功能
class ResumeApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupStickyHeader();
        this.setupFloatingNav();
        this.loadTheme();
        this.loadResumeData();
    }

    // 设置吸顶导航
    setupStickyHeader() {
        window.addEventListener('scroll', () => {
            const header = document.getElementById('sticky-header');
            if (window.scrollY > 100) {
                header.classList.add('visible');
            } else {
                header.classList.remove('visible');
            }
        });
    }

    // 设置浮动导航
    setupFloatingNav() {
        const nav = document.getElementById('floating-nav');
        const navItems = nav.querySelectorAll('.nav-item');

        // 点击导航项处理
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('data-section');
                const targetSection = document.querySelector(`.resume-section[data-section="${targetId}"]`);
                if (targetSection) {
                    const offset = 80; // 考虑吸顶导航的高度
                    const targetPosition = targetSection.offsetTop - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // 滚动监听
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.updateActiveNavItem();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // 更新当前激活的导航项
    updateActiveNavItem() {
        const sections = document.querySelectorAll('.resume-section');
        const navItems = document.querySelectorAll('.nav-item');
        
        const offset = 100; // 偏移量
        const scrollPosition = window.scrollY + offset;

        // 清除所有激活状态
        navItems.forEach(item => item.classList.remove('active'));

        // 找到当前滚动位置对应的section
        sections.forEach(section => {
            const sectionId = section.getAttribute('data-section');
            const navItem = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
            if (!navItem) return;

            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navItem.classList.add('active');
            }
        });
    }

    // 加载主题
    loadTheme() {
        fetch('/api/theme/active')
            .then(response => response.json())
            .then(result => {
                if (result.code === 1 && result.data) {
                    this.applyTheme(result.data.primaryColor);
                }
            })
            .catch(error => console.error('加载主题失败:', error));
    }

    // 应用主题
    applyTheme(primaryColor) {
        const root = document.documentElement;
        
        // 设置主题色
        root.style.setProperty('--primary-color', primaryColor);
        
        // 计算并设置衍生色
        root.style.setProperty('--primary-dark', this.adjustColor(primaryColor, -0.15));
        root.style.setProperty('--primary-light', this.adjustColor(primaryColor, 0.15));
    }

    // 颜色处理工具函数
    adjustColor(hex, percent) {
        // hex转rgb
        let r = parseInt(hex.slice(1,3), 16);
        let g = parseInt(hex.slice(3,5), 16);
        let b = parseInt(hex.slice(5,7), 16);
        
        // 调整明暗度
        r = Math.round(r * (1 + percent));
        g = Math.round(g * (1 + percent));
        b = Math.round(b * (1 + percent));
        
        // 确保值在0-255范围内
        r = Math.min(255, Math.max(0, r));
        g = Math.min(255, Math.max(0, g));
        b = Math.min(255, Math.max(0, b));
        
        // rgb转回hex
        return '#' + 
            (r < 16 ? '0' : '') + r.toString(16) +
            (g < 16 ? '0' : '') + g.toString(16) +
            (b < 16 ? '0' : '') + b.toString(16);
    }

    // 加载简历数据
    loadResumeData() {
        fetch('/api/user/resume')
            .then(response => response.json())
            .then(result => {
                if (result.code === 1 && result.data) {
                    this.renderResume(result.data);
                } else {
                    this.showError(result.message || '暂无简历数据');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                this.showError('加载简历数据失败，请稍后重试');
            });
    }

    // 渲染简历内容
    renderResume(resume) {
        const content = JSON.parse(resume.content);
        
        // 设置页面标题
        document.title = `${content.personalInfo.name}-${content.personalInfo.title}-个人简历`;
        
        // 设置吸顶栏内容
        this.setupStickyContent(content.personalInfo);
        
        // 渲染简历内容
        this.renderResumeContent(content);
    }

    // 设置吸顶栏内容
    setupStickyContent(personalInfo) {
        document.getElementById('sticky-name').textContent = personalInfo.name;
        document.getElementById('sticky-title').textContent = personalInfo.title;
        document.getElementById('sticky-contact').innerHTML = `
            <a href="mailto:${personalInfo.email}">📧 ${personalInfo.email}</a>
            <span>📱 ${personalInfo.phone}</span>
            <span>📍 ${personalInfo.location}</span>
        `;
    }

    // 渲染简历主要内容
    renderResumeContent(content) {
        const container = document.getElementById('resume-content');
        
        container.innerHTML = `
            <div class="resume-container">
                ${this.renderHeader(content.personalInfo)}
                <div class="resume-content">
                    <div class="content-sections">
                        ${this.renderSummary(content.summary)}
                        ${this.renderEducation(content.education)}
                        ${this.renderWorkExperience(content.workExperience)}
                        ${this.renderProjectExperience(content.projectExperience)}
                        ${this.renderSkills(content.skills)}
                    </div>
                </div>
            </div>
        `;

        // 初始化完成后更新一次导航状态
        setTimeout(() => this.updateActiveNavItem(), 100);
    }

    // 渲染头部
    renderHeader(personalInfo) {
        return `
            <div class="resume-section" data-section="personal-info">
                <div class="resume-header">
                    <div class="header-content">
                        <div class="header-info">
                            <div class="header-name">${personalInfo.name}</div>
                            <div class="header-title">${personalInfo.title}</div>
                            <div class="header-contact">
                                <div class="contact-item">
                                    <span class="icon">📧</span>
                                    ${personalInfo.email}
                                </div>
                                <div class="contact-item">
                                    <span class="icon">📱</span>
                                    ${personalInfo.phone}
                                </div>
                                <div class="contact-item">
                                    <span class="icon">📍</span>
                                    ${personalInfo.location}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // 渲染个人简介
    renderSummary(summary) {
        return `
            <div class="resume-section" data-section="summary">
                <div class="section-header">
                    <span>个人简介</span>
                </div>
                <div class="section-content">
                    <div class="summary-content">${summary.replace(/\n/g, '<br>')}</div>
                </div>
            </div>
        `;
    }

    // 渲染教育背景
    renderEducation(education) {
        const educationItems = education.map(edu => `
            <div class="education-item">
                <div class="item-header">
                    <div class="item-title">${edu.school}</div>
                    <div class="item-date">${edu.startDate} ~ ${edu.endDate}</div>
                </div>
                <div class="item-subtitle">${edu.major} | ${edu.degree}</div>
            </div>
        `).join('');

        return `
            <div class="resume-section" data-section="education">
                <div class="section-header">
                    <span>教育背景</span>
                </div>
                <div class="section-content">
                    ${educationItems}
                </div>
            </div>
        `;
    }

    // 渲染工作经历
    renderWorkExperience(workExperience) {
        const workItems = workExperience.map(work => `
            <div class="work-item">
                <div class="item-header">
                    <div class="item-title">${work.company}</div>
                    <div class="item-date">${work.startDate} ~ ${work.endDate}</div>
                </div>
                <div class="item-subtitle">${work.position}</div>
                <div class="item-description">${work.description.replace(/\n/g, '<br>')}</div>
            </div>
        `).join('');

        return `
            <div class="resume-section" data-section="work">
                <div class="section-header">
                    <span>工作经历</span>
                </div>
                <div class="section-content">
                    ${workItems}
                </div>
            </div>
        `;
    }

    // 渲染项目经历
    renderProjectExperience(projectExperience) {
        const projectItems = projectExperience.map(project => `
            <div class="project-item">
                <div class="item-header">
                    <div class="item-title">${project.name}</div>
                    <div class="item-date">${project.startDate} ~ ${project.endDate}</div>
                </div>
                <div class="item-subtitle">${project.role}</div>
                <div class="item-tech">${project.technologies.join(' | ')}</div>
                <div class="item-description">${project.description.replace(/\n/g, '<br>')}</div>
            </div>
        `).join('');

        return `
            <div class="resume-section" data-section="projects">
                <div class="section-header">
                    <span>项目经历</span>
                </div>
                <div class="section-content">
                    ${projectItems}
                </div>
            </div>
        `;
    }

    // 渲染技能特长
    renderSkills(skills) {
        return `
            <div class="resume-section" data-section="skills">
                <div class="section-header">
                    <span>技能特长</span>
                </div>
                <div class="section-content">
                    <div class="skills-content">
                        ${skills.map(skill => `<span class="skill-item">${skill}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // 显示错误信息
    showError(message) {
        document.getElementById('resume-content').innerHTML = 
            `<div class="error">${message}</div>`;
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new ResumeApp();
}); 