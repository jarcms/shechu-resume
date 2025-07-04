// 全局变量
let currentResumeId = null;
let editMode = false;

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 检查登录状态
    const token = localStorage.getItem('token');
    if (token) {
        showAdminPanel();
        loadResumes();
    } else {
        showLoginPage();
    }
});

// 登录相关函数
function login(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    fetch('/api/admin/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(result => {
        if (result.code === 1) {
            localStorage.setItem('token', result.data.token);
            showAdminPanel();
            loadResumes();
        } else {
            showMessage('login-message', result.message, 'error');
        }
    })
    .catch(error => {
        showMessage('login-message', '登录失败，请重试', 'error');
    });
}

function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('token');
        showLoginPage();
    }
}

// 简历管理相关函数
function loadResumes() {
    fetch('/api/admin/resume/all', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(response => response.json())
    .then(result => {
        if (result.code === 1) {
            displayResumes(result.data);
        } else {
            showMessage('message', result.message, 'error');
        }
    })
    .catch(error => {
        showMessage('message', '加载简历列表失败', 'error');
    });
}

function displayResumes(resumes) {
    const container = document.getElementById('resume-list');
    if (resumes.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">暂无简历数据</div>';
        return;
    }
    
    container.innerHTML = resumes.map(resume => `
        <div class="resume-item ${resume.isActive ? 'active' : ''}">
            <div>
                <strong>${resume.name}</strong>
                ${resume.isActive ? ' <span style="color: #28a745">[当前启用]</span>' : ''}
            </div>
            <div class="actions">
                <button onclick="editResume(${resume.id})">编辑</button>
                ${!resume.isActive ? `<button onclick="setActive(${resume.id})" class="success">启用</button>` : ''}
                <button onclick="exportPdf(${resume.id})" class="primary">导出PDF</button>
                <button onclick="deleteResume(${resume.id})" class="danger">删除</button>
            </div>
        </div>
    `).join('');
}

function showAddForm() {
    editMode = false;
    currentResumeId = null;
    document.getElementById('modal-title').textContent = '添加简历';
    document.getElementById('resume-name').value = '';
    resetResumeForm();
    document.getElementById('resume-modal').classList.add('active');
}

function showEditForm() {
    document.getElementById('modal-title').textContent = '编辑简历';
    document.getElementById('resume-modal').classList.add('active');
}

function hideForm() {
    document.getElementById('resume-modal').classList.remove('active');
}

function editResume(id) {
    editMode = true;
    currentResumeId = id;
    
    fetch(`/api/admin/resume/${id}`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(response => response.json())
    .then(result => {
        if (result.code === 1) {
            const resume = result.data;
            document.getElementById('modal-title').textContent = '编辑简历';
            document.getElementById('resume-name').value = resume.name;
            
            // 解析JSON内容并填充表单
            const content = JSON.parse(resume.content);
            fillResumeForm(content);
            
            document.getElementById('resume-modal').classList.add('active');
        } else {
            showMessage('message', result.message, 'error');
        }
    })
    .catch(error => {
        showMessage('message', '加载简历数据失败', 'error');
    });
}

function saveResume(event) {
    event.preventDefault();
    
    // 收集表单数据
    const resumeData = {
        name: document.getElementById('resume-name').value,
        content: JSON.stringify(collectResumeData())
    };
    
    const url = editMode ? `/api/admin/resume/${currentResumeId}` : '/api/admin/resume';
    const method = editMode ? 'PUT' : 'POST';
    
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(resumeData)
    })
    .then(response => response.json())
    .then(result => {
        if (result.code === 1) {
            showMessage('message', result.message, 'success-msg');
            hideForm();
            loadResumes();
        } else {
            showMessage('message', result.message, 'error');
        }
    })
    .catch(error => {
        showMessage('message', '保存失败，请重试', 'error');
    });
}

function deleteResume(id) {
    if (!confirm('确定要删除这份简历吗？')) {
        return;
    }
    
    fetch(`/api/admin/resume/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(response => response.json())
    .then(result => {
        if (result.code === 1) {
            showMessage('message', result.message, 'success-msg');
            loadResumes();
        } else {
            showMessage('message', result.message, 'error');
        }
    })
    .catch(error => {
        showMessage('message', '删除失败，请重试', 'error');
    });
}

function setActive(id) {
    fetch(`/api/admin/resume/${id}/active`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(response => response.json())
    .then(result => {
        if (result.code === 1) {
            showMessage('message', result.message, 'success-msg');
            loadResumes();
        } else {
            showMessage('message', result.message, 'error');
        }
    })
    .catch(error => {
        showMessage('message', '设置失败，请重试', 'error');
    });
}

// 简历表单数据处理
function resetResumeForm() {
    // 重置个人信息
    document.getElementById('personal-name').value = '';
    document.getElementById('personal-title').value = '';
    document.getElementById('personal-phone').value = '';
    document.getElementById('personal-email').value = '';
    document.getElementById('personal-location').value = '';
    document.getElementById('personal-summary').value = '';
    
    // 重置工作经历
    document.getElementById('work-experience-list').innerHTML = '';
    
    // 重置项目经历
    document.getElementById('project-experience-list').innerHTML = '';
    
    // 重置技能
    document.getElementById('skills-list').innerHTML = '';
    
    // 重置教育经历
    document.getElementById('education-list').innerHTML = '';
}

function fillResumeForm(content) {
    // 填充个人信息
    const personalInfo = content.personalInfo;
    document.getElementById('personal-name').value = personalInfo.name;
    document.getElementById('personal-title').value = personalInfo.title;
    document.getElementById('personal-phone').value = personalInfo.phone;
    document.getElementById('personal-email').value = personalInfo.email;
    document.getElementById('personal-location').value = personalInfo.location;
    document.getElementById('personal-summary').value = content.summary;
    
    // 填充工作经历
    const workList = document.getElementById('work-experience-list');
    workList.innerHTML = '';
    content.workExperience.forEach(work => {
        addWorkExperience(work);
    });
    
    // 填充项目经历
    const projectList = document.getElementById('project-experience-list');
    projectList.innerHTML = '';
    content.projectExperience.forEach(project => {
        addProjectExperience(project);
    });
    
    // 填充技能
    const skillsList = document.getElementById('skills-list');
    skillsList.innerHTML = '';
    content.skills.forEach(skill => {
        addSkill(skill);
    });
    
    // 填充教育经历
    const educationList = document.getElementById('education-list');
    educationList.innerHTML = '';
    content.education.forEach(edu => {
        addEducation(edu);
    });
}

function collectResumeData() {
    return {
        personalInfo: {
            name: document.getElementById('personal-name').value,
            title: document.getElementById('personal-title').value,
            phone: document.getElementById('personal-phone').value,
            email: document.getElementById('personal-email').value,
            location: document.getElementById('personal-location').value
        },
        summary: document.getElementById('personal-summary').value,
        workExperience: collectWorkExperience(),
        projectExperience: collectProjectExperience(),
        skills: collectSkills(),
        education: collectEducation()
    };
}

// 动态列表项管理
function addWorkExperience(data = {}) {
    const list = document.getElementById('work-experience-list');
    const item = document.createElement('div');
    item.className = 'dynamic-list-item';
    item.innerHTML = `
        <span class="remove-item" onclick="this.parentElement.remove()">×</span>
        <div class="form-group">
            <label>公司名称：</label>
            <input type="text" class="work-company" value="${data.company || ''}" required>
        </div>
        <div class="form-group">
            <label>职位：</label>
            <input type="text" class="work-position" value="${data.position || ''}" required>
        </div>
        <div class="form-group">
            <label>开始时间：</label>
            <input type="text" class="work-start-date" value="${data.startDate || ''}" required>
        </div>
        <div class="form-group">
            <label>结束时间：</label>
            <input type="text" class="work-end-date" value="${data.endDate || ''}" required>
        </div>
        <div class="form-group">
            <label>工作描述：</label>
            <textarea class="work-description" required>${data.description || ''}</textarea>
        </div>
    `;
    list.appendChild(item);
}

function addProjectExperience(data = {}) {
    const list = document.getElementById('project-experience-list');
    const item = document.createElement('div');
    item.className = 'dynamic-list-item';
    item.innerHTML = `
        <span class="remove-item" onclick="this.parentElement.remove()">×</span>
        <div class="form-group">
            <label>项目名称：</label>
            <input type="text" class="project-name" value="${data.name || ''}" required>
        </div>
        <div class="form-group">
            <label>担任角色：</label>
            <input type="text" class="project-role" value="${data.role || ''}" required>
        </div>
        <div class="form-group">
            <label>开始时间：</label>
            <input type="text" class="project-start-date" value="${data.startDate || ''}" required>
        </div>
        <div class="form-group">
            <label>结束时间：</label>
            <input type="text" class="project-end-date" value="${data.endDate || ''}" required>
        </div>
        <div class="form-group">
            <label>技术栈：</label>
            <input type="text" class="project-technologies" value="${(data.technologies || []).join(', ')}" required>
        </div>
        <div class="form-group">
            <label>项目描述：</label>
            <textarea class="project-description" required>${data.description || ''}</textarea>
        </div>
    `;
    list.appendChild(item);
}

function addSkill(skill = '') {
    const list = document.getElementById('skills-list');
    const item = document.createElement('div');
    item.className = 'dynamic-list-item';
    item.innerHTML = `
        <span class="remove-item" onclick="this.parentElement.remove()">×</span>
        <div class="form-group">
            <label>技能：</label>
            <input type="text" class="skill-name" value="${skill}" required>
        </div>
    `;
    list.appendChild(item);
}

function addEducation(data = {}) {
    const list = document.getElementById('education-list');
    const item = document.createElement('div');
    item.className = 'dynamic-list-item';
    item.innerHTML = `
        <span class="remove-item" onclick="this.parentElement.remove()">×</span>
        <div class="form-group">
            <label>学校名称：</label>
            <input type="text" class="education-school" value="${data.school || ''}" required>
        </div>
        <div class="form-group">
            <label>专业：</label>
            <input type="text" class="education-major" value="${data.major || ''}" required>
        </div>
        <div class="form-group">
            <label>学位：</label>
            <input type="text" class="education-degree" value="${data.degree || ''}" required>
        </div>
        <div class="form-group">
            <label>开始时间：</label>
            <input type="text" class="education-start-date" value="${data.startDate || ''}" required>
        </div>
        <div class="form-group">
            <label>结束时间：</label>
            <input type="text" class="education-end-date" value="${data.endDate || ''}" required>
        </div>
    `;
    list.appendChild(item);
}

// 收集动态列表数据
function collectWorkExperience() {
    const items = document.querySelectorAll('#work-experience-list .dynamic-list-item');
    return Array.from(items).map(item => ({
        company: item.querySelector('.work-company').value,
        position: item.querySelector('.work-position').value,
        startDate: item.querySelector('.work-start-date').value,
        endDate: item.querySelector('.work-end-date').value,
        description: item.querySelector('.work-description').value
    }));
}

function collectProjectExperience() {
    const items = document.querySelectorAll('#project-experience-list .dynamic-list-item');
    return Array.from(items).map(item => ({
        name: item.querySelector('.project-name').value,
        role: item.querySelector('.project-role').value,
        startDate: item.querySelector('.project-start-date').value,
        endDate: item.querySelector('.project-end-date').value,
        technologies: item.querySelector('.project-technologies').value.split(',').map(t => t.trim()),
        description: item.querySelector('.project-description').value
    }));
}

function collectSkills() {
    const items = document.querySelectorAll('#skills-list .dynamic-list-item');
    return Array.from(items).map(item => item.querySelector('.skill-name').value);
}

function collectEducation() {
    const items = document.querySelectorAll('#education-list .dynamic-list-item');
    return Array.from(items).map(item => ({
        school: item.querySelector('.education-school').value,
        major: item.querySelector('.education-major').value,
        degree: item.querySelector('.education-degree').value,
        startDate: item.querySelector('.education-start-date').value,
        endDate: item.querySelector('.education-end-date').value
    }));
}

// 工具函数
function showMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.innerHTML = `<div class="message ${type}">${message}</div>`;
    setTimeout(() => {
        element.innerHTML = '';
    }, 3000);
}

function showLoginPage() {
    document.getElementById('login-page').style.display = 'flex';
    document.getElementById('admin-panel').style.display = 'none';
}

function showAdminPanel() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
}

function showTab(tabId, element) {
    // 移除所有tab的active类
    document.querySelectorAll('.tab-button').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 隐藏所有内容
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });
    
    // 激活当前tab
    element.classList.add('active');
    
    // 显示对应内容
    const content = document.getElementById(tabId);
    if (content) {
        content.style.display = 'block';
        
        // 如果切换到简历管理tab，重新加载简历列表
        if (tabId === 'resume-management') {
            loadResumes();
        }
        // 如果切换到主题管理tab，加载主题列表
        else if (tabId === 'theme-management') {
            loadThemes();
        }
    }
}

// 修改密码相关函数
function changePassword(event) {
    event.preventDefault();
    
    const oldPassword = document.getElementById('old-password').value;
    const newPassword = document.getElementById('new-password').value;
    
    fetch('/api/admin/changePassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
            oldPassword,
            newPassword
        })
    })
    .then(response => response.json())
    .then(result => {
        if (result.code === 1) {
            showMessage('password-message', '密码修改成功，请重新登录', 'success-msg');
            setTimeout(() => {
                logout();
            }, 2000);
        } else {
            showMessage('password-message', result.message, 'error');
        }
    })
    .catch(error => {
        showMessage('password-message', '密码修改失败，请重试', 'error');
    });
}

// 处理内部导航
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        
        // 更新导航项的激活状态
        document.querySelectorAll('.modal-nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`.modal-nav-item[onclick*="${sectionId}"]`).classList.add('active');
        
        // 展开对应的部分
        if (!section.classList.contains('expanded')) {
            toggleSection(section.querySelector('.section-header'));
        }
    }
}

// 处理部分的展开/收起
function toggleSection(header) {
    const section = header.parentElement;
    section.classList.toggle('expanded');
}

// 监听滚动以更新导航状态
document.querySelector('.modal-content').addEventListener('scroll', function() {
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.modal-nav-item');
    
    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const modalContent = document.querySelector('.modal-content');
        const modalRect = modalContent.getBoundingClientRect();
        
        if (rect.top <= modalRect.top + 100 && rect.bottom >= modalRect.top) {
            navItems.forEach(item => item.classList.remove('active'));
            navItems[index].classList.add('active');
        }
    });
});

function exportPdf(id) {
    const token = localStorage.getItem('token');
    
    // 使用fetch API下载PDF
    fetch(`/api/admin/resume/${id}/export/pdf`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('导出失败');
        }
        
        // 从响应头获取文件名
        const contentDisposition = response.headers.get('Content-Disposition');
        let fileName = '简历.pdf';
        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename\*=UTF-8''(.+)/);
            if (fileNameMatch) {
                fileName = decodeURIComponent(fileNameMatch[1]);
            } else {
                const simpleMatch = contentDisposition.match(/filename="(.+)"/);
                if (simpleMatch) {
                    fileName = decodeURIComponent(simpleMatch[1]);
                }
            }
        }
        
        return response.blob().then(blob => ({ blob, fileName }));
    })
    .then(({ blob, fileName }) => {
        // 创建下载链接
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.style.display = 'none';
        
        // 触发下载
        document.body.appendChild(link);
        link.click();
        
        // 清理
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        showMessage('message', 'PDF导出成功', 'success-msg');
    })
    .catch(error => {
        console.error('PDF导出失败:', error);
        showMessage('message', '导出PDF失败，请重试', 'error');
    });
}

// 主题管理相关函数
function loadThemes() {
    fetch('/api/admin/themes', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(response => response.json())
    .then(result => {
        if (result.code === 1) {
            displayThemes(result.data);
        } else {
            showMessage('message', '加载主题列表失败', 'error');
        }
    })
    .catch(error => {
        showMessage('message', '加载主题列表失败', 'error');
    });
}

function displayThemes(themes) {
    const themeList = document.querySelector('.theme-list');
    themeList.innerHTML = themes.map(theme => `
        <div class="theme-item">
            <div class="color-preview" style="background-color: ${theme.primaryColor}"></div>
            <span class="theme-name">${theme.name}</span>
            <button onclick="setTheme(${theme.id})" ${theme.isActive ? 'class="active"' : ''}>
                ${theme.isActive ? '当前使用' : '使用'}
            </button>
        </div>
    `).join('');
}

function setTheme(id) {
    fetch(`/api/admin/themes/${id}/active`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(response => response.json())
    .then(result => {
        if (result.code === 1) {
            showMessage('message', '主题设置成功', 'success-msg');
            loadThemes(); // 重新加载主题列表
        } else {
            showMessage('message', result.message, 'error');
        }
    })
    .catch(error => {
        showMessage('message', '主题设置失败', 'error');
    });
} 