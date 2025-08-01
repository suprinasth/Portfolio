// Portfolio-specific functionality
document.addEventListener('DOMContentLoaded', function() {
    initProjectFilters();
    initProjectCards();
    initStatCounters();
    initTypewriter();
});

// Project filtering functionality
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects with animation
            projectCards.forEach((card, index) => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterValue === 'all' || cardCategory === filterValue) {
                    // Show card with staggered animation
                    setTimeout(() => {
                        card.classList.remove('hidden');
                        card.style.animationDelay = `${index * 0.1}s`;
                        card.classList.add('slide-up');
                    }, index * 50);
                } else {
                    // Hide card
                    card.classList.add('hidden');
                    card.classList.remove('slide-up');
                }
            });
        });
    });
}

// Project cards interaction
function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Add hover sound effect (optional)
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click tracking for analytics (placeholder)
        card.addEventListener('click', function(e) {
            const projectTitle = this.querySelector('.project-title').textContent;
            console.log(`Project clicked: ${projectTitle}`);
            
            // You can add analytics tracking here
            // gtag('event', 'project_click', { project_name: projectTitle });
        });
        
        // Handle project links
        const projectLinks = card.querySelectorAll('.project-link');
        projectLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Add click animation
                this.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        });
    });
}

// Animated counters for stats
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.textContent.replace(/[^\d]/g, ''));
                const suffix = target.textContent.replace(/\d/g, '');
                
                animateCounter(target, 0, finalValue, 2000, suffix);
                counterObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        counterObserver.observe(stat);
    });
}

// Counter animation function
function animateCounter(element, start, end, duration, suffix) {
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * easeOut);
        
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = end + suffix;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Typewriter effect for hero title
function initTypewriter() {
    const typewriterElement = document.querySelector('.hero-title .highlight');
    if (!typewriterElement) return;
    
    const originalText = typewriterElement.textContent;
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pauseDuration = 2000;
    
    let currentIndex = 0;
    let isDeleting = false;
    
    function typeWriter() {
        if (isDeleting) {
            // Deleting text
            typewriterElement.textContent = originalText.substring(0, currentIndex - 1);
            currentIndex--;
            
            if (currentIndex === 0) {
                isDeleting = false;
                setTimeout(typeWriter, pauseDuration);
                return;
            }
            
            setTimeout(typeWriter, deleteSpeed);
        } else {
            // Typing text
            typewriterElement.textContent = originalText.substring(0, currentIndex + 1);
            currentIndex++;
            
            if (currentIndex === originalText.length) {
                isDeleting = true;
                setTimeout(typeWriter, pauseDuration);
                return;
            }
            
            setTimeout(typeWriter, typeSpeed);
        }
    }
    
    // Start typewriter effect after a delay
    setTimeout(typeWriter, 1000);
}

// Dynamic greeting based on time of day in Nepal (UTC+05:45)
function initDynamicGreeting() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    // Get current time in Nepal (UTC+05:45)
    const now = new Date();
    const utcOffset = now.getTimezoneOffset() * 60 * 1000; // in milliseconds
    const nepalOffset = 5.75 * 60 * 60 * 1000; // Nepal is UTC+05:45
    const nepalTime = new Date(now.getTime() + utcOffset + nepalOffset);
    
    const hour = nepalTime.getHours();
    let greeting = 'Hi';
    
    // Define greeting based on Nepal time
    if (hour < 4) {
        greeting = 'Good evening'; // Late night (12 AM - 4 AM)
    } else if (hour < 12) {
        greeting = 'Good morning'; // Morning (4 AM - 12 PM)
    } else if (hour < 17) {
        greeting = 'Good afternoon'; // Afternoon (12 PM - 5 PM)
    } else {
        greeting = 'Good evening'; // Evening (5 PM - 12 AM)
    }
    
    // Update the greeting text
    const currentText = heroTitle.innerHTML;
    const updatedText = currentText.replace('Hi,', `${greeting},`);
    heroTitle.innerHTML = updatedText;
}

// Lazy loading for project images (if you add real images later)
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Parallax scrolling for floating elements
function initParallaxElements() {
    const floatingElements = document.querySelectorAll('.floating-element');
    
    window.addEventListener('scroll', throttle(function() {
        const scrollTop = window.pageYOffset;
        
        floatingElements.forEach((element, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }, 16)); // ~60fps
}

// Add scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
        z-index: var(--z-fixed);
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

// Initialize cursor follower effect (optional enhancement)
function initCursorFollower() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-follower';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: var(--primary-color);
        border-radius: 50%;
        pointer-events: none;
        z-index: var(--z-tooltip);
        opacity: 0;
        transition: all 0.1s ease;
        mix-blend-mode: difference;
    `;
    
    document.body.appendChild(cursor);
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.opacity = '1';
    });
    
    document.addEventListener('mouseleave', function() {
        cursor.style.opacity = '0';
    });
    
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.1;
        cursorY += dy * 0.1;
        
        cursor.style.left = cursorX - 10 + 'px';
        cursor.style.top = cursorY - 10 + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    // Only enable on non-touch devices
    if (!('ontouchstart' in window)) {
        animateCursor();
    }
}

// Theme toggle functionality (bonus feature)
function initThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i data-feather="moon"></i>';
    themeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        border: none;
        border-radius: 50%;
        color: white;
        cursor: pointer;
        box-shadow: var(--shadow-lg);
        z-index: var(--z-fixed);
        transition: all var(--transition-fast);
    `;
    
    document.body.appendChild(themeToggle);
    
    // Replace Feather icon
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        
        this.innerHTML = isDark ? '<i data-feather="sun"></i>' : '<i data-feather="moon"></i>';
        
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
        
        // Save preference
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i data-feather="sun"></i>';
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }
}

// Utility function for throttling
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
    };
}

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', function() {
    // Core features
    initProjectFilters();
    initProjectCards();
    initStatCounters();
    
    // Enhanced features (optional)
    initDynamicGreeting();
    initScrollProgress();
    
    // Only initialize cursor follower on larger screens
    if (window.innerWidth > 1024) {
        initCursorFollower();
    }
    
    // Theme toggle (uncomment to enable)
    // initThemeToggle();
});

// Add resize handler for responsive features
window.addEventListener('resize', function() {
    // Recalculate any position-dependent features
    if (window.innerWidth <= 768) {
        // Disable certain effects on mobile
        const cursorFollower = document.querySelector('.cursor-follower');
        if (cursorFollower) {
            cursorFollower.style.display = 'none';
        }
    }
});
