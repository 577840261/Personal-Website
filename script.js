// 加载动画
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelector('.loading-screen').style.opacity = '0';
        setTimeout(() => {
            document.querySelector('.loading-screen').style.display = 'none';
        }, 500);
    }, 1500);
});

// 自定义光标
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;
    
    cursorOutline.style.left = `${posX}px`;
    cursorOutline.style.top = `${posY}px`;
});

// 粒子系统
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// 初始化粒子系统
const particlesCanvas = document.getElementById('particles-canvas');
if (particlesCanvas) {
    new ParticleSystem(particlesCanvas);
}

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 性能优化：节流函数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 导航栏滚动效果（优化版）
const handleScroll = throttle(() => {
    const navbar = document.querySelector('.navbar');
    const scrolled = window.pageYOffset;
    
    if (scrolled > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        navbar.style.transform = 'translateY(0)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    
    // 视差效果
    const parallax = document.querySelector('.hero-visual');
    if (parallax) {
        const speed = scrolled * 0.3;
        parallax.style.transform = `translateY(-50%) translateZ(${speed}px)`;
    }
}, 16);

window.addEventListener('scroll', handleScroll);

// 高级滚动动画
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) rotateX(0)';
        }
    });
}, observerOptions);

// 检测移动设备
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

// 为需要动画的元素添加观察
const initAnimations = () => {
    const animateElements = document.querySelectorAll('.project-card, .about-text, .profile-card, .skill-tag, .achievement-card');
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = isMobile ? 'translateY(30px)' : 'translateY(50px) rotateX(10deg)';
        el.style.transition = `all 0.4s cubic-bezier(0.23, 1, 0.32, 1) ${index * 0.05}s`;
        observer.observe(el);
    });
    
    // 技能标签特殊动画
    document.querySelectorAll('.skill-tag').forEach((tag, index) => {
        tag.style.animationDelay = `${index * 0.1}s`;
    });
    
    // 成就卡片特殊效果（仅桌面端）
    if (!isMobile) {
        document.querySelectorAll('.achievement-card').forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-15px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                if (card.classList.contains('featured')) {
                    card.style.transform = 'scale(1.05)';
                } else {
                    card.style.transform = 'translateY(0) scale(1)';
                }
            });
        });
    }
};

// 3D倾斜效果（仅桌面端）
if (!isMobile) {
    document.querySelectorAll('[data-tilt]').forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// 磁性按钮效果（仅桌面端）
if (!isMobile) {
    document.querySelectorAll('.magnetic').forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0) scale(1)';
        });
    });
}

// 主题切换
const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
});

// 光标交互效果（仅桌面端）
if (!isMobile && cursorDot && cursorOutline) {
    document.querySelectorAll('a, button, .project-card').forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursorDot.style.transform = 'scale(2)';
            cursorOutline.style.transform = 'scale(2)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursorDot.style.transform = 'scale(1)';
            cursorOutline.style.transform = 'scale(1)';
        });
    });
}

// 键盘快捷键
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + D 切换主题
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        themeToggle.click();
    }
    
    // ESC 键回到顶部
    if (e.key === 'Escape') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// 页面可见性API - 当用户切换标签页时暂停动画
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // 页面不可见时暂停动画
        document.body.style.animationPlayState = 'paused';
    } else {
        // 页面可见时恢复动画
        document.body.style.animationPlayState = 'running';
    }
});

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', () => {
    // 预加载关键资源
    const preloadImages = [
        // 在这里添加需要预加载的图片URL
    ];
    
    preloadImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    // 初始化所有交互效果
    console.log('🚀 高级个人网站已加载完成！');
});

// 确保DOM加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
} else {
    initAnimations();
}