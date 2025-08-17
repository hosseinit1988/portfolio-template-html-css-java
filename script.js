document.addEventListener('DOMContentLoaded', () => {
    // --- Inverted Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    window.addEventListener('mousemove', (e) => {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
        cursorOutline.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 500, fill: "forwards" });
    });
    document.querySelectorAll('.interactive').forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovered'));
    });

    // --- Mobile Navigation ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    if (burger && nav) {
        burger.addEventListener('click', () => nav.classList.toggle('nav-active'));
        nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('nav-active')));
    }

    // --- Theme Toggler ---
    const themeToggle = document.getElementById('theme-toggle');
    const userTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const themeCheck = () => {
        if (userTheme === "dark" || (!userTheme && systemTheme)) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    };
    themeToggle.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
    themeCheck();

    // --- Scroll Animations ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    
    // --- THE FINAL, ROBUST SLIDER LOGIC (Corrected for initial scroll issue) ---
    const prevBtn = document.getElementById('slide-prev');
    const nextBtn = document.getElementById('slide-next');
    const items = document.querySelectorAll('.portfolio-item');
    
    if (prevBtn && nextBtn && items.length > 0) {
        let currentIndex = 0;
        const totalItems = items.length;

        const updateButtons = () => {
            // This function ONLY updates the disabled state of the buttons
            nextBtn.disabled = currentIndex === 0;
            prevBtn.disabled = currentIndex === totalItems - 1;
        };

        const scrollToCurrentItem = () => {
            // This function ONLY handles the scrolling
            items[currentIndex].scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'nearest'
            });
        };

        // Right button (moves to the next item in array)
        prevBtn.addEventListener('click', () => {
            if (currentIndex < totalItems - 1) {
                currentIndex++;
                scrollToCurrentItem();
                updateButtons();
            }
        });
        
        // Left button (moves to the previous item in array)
        nextBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                scrollToCurrentItem();
                updateButtons();
            }
        });

        // ON PAGE LOAD: ONLY update the buttons, DO NOT scroll!
        // This solves the issue of the page jumping to the slider on load.
        updateButtons(); 
    }
});