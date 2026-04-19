// ===================================
// GLOBAL VARIABLES
// ===================================
let scrollPosition = 0;
let ticking = false;

// ===================================
// INITIALIZE ON PAGE LOAD
// ===================================
document.addEventListener('DOMContentLoaded', function () {
    initializeTheme();
    initializeNavigation();
    initializeParticles();
    initializeScrollAnimations();
    initializeContactForm();
    initializeSmoothScroll();
    initializeMobileMenu();
    animateCounters();
    createScrollToTopButton();
});

// ===================================
// THEME TOGGLE
// ===================================
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    if (!themeToggle) return;

    const currentTheme = localStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    themeToggle.addEventListener('click', function () {
        body.classList.toggle('dark-mode');

        if (body.classList.contains('dark-mode')) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        }
    });
}

// ===================================
// NAVIGATION
// ===================================
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navbar) return;

    window.addEventListener('scroll', function () {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        updateActiveNavLink();
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';

    sections.forEach(section => {
        if (window.pageYOffset >= section.offsetTop - 100) {
            currentSection = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${currentSection}`
        );
    });
}

// ===================================
// MOBILE MENU
// ===================================
function initializeMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');

    if (!toggle || !navMenu) return;

    toggle.addEventListener('click', function () {
        navMenu.classList.toggle('active');

        const icon = this.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// ===================================
// PARTICLES
// ===================================
function initializeParticles() {
    if (typeof particlesJS === 'undefined') return;

    particlesJS('particles-js', {
        particles: {
            number: { value: 80 },
            color: { value: '#ffffff' },
            size: { value: 3 },
            move: { speed: 2 }
        }
    });
}

// ===================================
// SCROLL ANIMATIONS
// ===================================
function initializeScrollAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');

                if (entry.target.classList.contains('skill-item')) {
                    animateSkillBar(entry.target);
                }
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-aos], .skill-item')
        .forEach(el => observer.observe(el));
}

// ===================================
// SKILL BAR
// ===================================
function animateSkillBar(skillItem) {
    if (skillItem.classList.contains('animated')) return;

    const progressBar = skillItem.querySelector('.skill-progress');
    const progress = skillItem.getAttribute('data-skill');

    if (!progressBar) return;

    setTimeout(() => {
        progressBar.style.width = progress + '%'; // FIXED
        skillItem.classList.add('animated');
    }, 100);
}

// ===================================
// SMOOTH SCROLL
// ===================================
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;

            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
}

// ===================================
// CONTACT FORM
// ===================================
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');

    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const data = {
            name: form.name.value,
            email: form.email.value,
            subject: form.subject.value,
            message: form.message.value
        };

        if (!validateForm(data)) return;

        form.style.display = 'none';
        success.classList.add('show');

        setTimeout(() => {
            form.reset();
            form.style.display = 'flex';
            success.classList.remove('show');
        }, 3000);
    });
}

function validateForm(data) {
    if (!data.name.trim()) return alert('Enter name'), false;
    if (!/^\S+@\S+\.\S+$/.test(data.email)) return alert('Invalid email'), false;
    if (!data.subject.trim()) return alert('Enter subject'), false;
    if (!data.message.trim()) return alert('Enter message'), false;
    return true;
}

// ===================================
// COUNTERS
// ===================================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el = entry.target;
            if (el.classList.contains('counted')) return;

            const text = el.textContent;
            const target = parseInt(text);
            const suffix = text.replace(/[0-9]/g, '');

            let start = 0;
            const duration = 2000; // total animation time
            const startTime = performance.now();

            function easeOutQuad(t) {
                return t * (2 - t); // smooth easing
            }

            function animate(currentTime) {
                const progress = Math.min((currentTime - startTime) / duration, 1);
                const eased = easeOutQuad(progress);

                const value = Math.floor(eased * target);
                el.textContent = value + suffix;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    el.textContent = target + suffix;
                    el.classList.add('counted');
                }
            }

            // ⏳ Delay before starting (premium feel)
            setTimeout(() => {
                requestAnimationFrame(animate);
            }, 300 + Math.random() * 300);

        });
    }, { threshold: 0.6 });

    counters.forEach(counter => observer.observe(counter));
}

// ===================================
// SCROLL TO TOP
// ===================================
function createScrollToTopButton() {
    const btn = document.createElement('button');
    btn.innerHTML = '↑';
    btn.className = 'scroll-to-top';

    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        btn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}