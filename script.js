document.addEventListener("DOMContentLoaded", () => {
    
    /* =======================================
       0. Hero Animation
       ======================================= */
    setTimeout(() => {
        document.body.classList.add("loaded");
    }, 100);

    /* =======================================
       1. Particles Generation
       ======================================= */
    const container = document.getElementById("particles-container");
    const colors = ["#d4af37", "#f3e5ab", "#ffffff"];
    
    function createParticle() {
        if(!container) return;
        
        const particle = document.createElement("div");
        particle.classList.add("particle");
        
        // Randomize size, width, background
        const size = Math.random() * 3 + 1; // 1px to 4px
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = color;
        particle.style.boxShadow = `0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color}`;
        
        // Random horizontal start
        particle.style.left = `${Math.random() * 100}vw`;
        
        // Random fall duration (10s to 25s)
        const duration = Math.random() * 15 + 10;
        particle.style.animationDuration = `${duration}s`;
        
        // Random delay
        particle.style.animationDelay = `${Math.random() * 2}s`;
        
        container.appendChild(particle);
        
        // Clean up
        setTimeout(() => {
            if(particle.parentNode) {
                particle.remove();
            }
        }, (duration + 2) * 1000);
    }
    
    // Create initial set of particles softly
    for(let i=0; i<30; i++) {
        setTimeout(createParticle, Math.random() * 4000);
    }
    
    // Continually generate new particles
    setInterval(createParticle, 600);

    /* =======================================
       2. Scroll Reveal Animations
       ======================================= */
    const reveals = document.querySelectorAll(".reveal");
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    /* =======================================
       3. Countdown Timer to May 9, 2026
       ======================================= */
    const weddingDate = new Date("May 9, 2026 11:30:00").getTime();
    
    const elements = {
        days: document.getElementById("days"),
        hours: document.getElementById("hours"),
        mins: document.getElementById("mins"),
        secs: document.getElementById("secs")
    };
    
    function updateCountdown() {
        const now = new Date().getTime();
        const diff = weddingDate - now;
        
        if (diff > 0) {
            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);
            
            if(elements.days) elements.days.innerText = d;
            if(elements.hours) elements.hours.innerText = h < 10 ? "0" + h : h;
            if(elements.mins) elements.mins.innerText = m < 10 ? "0" + m : m;
            if(elements.secs) elements.secs.innerText = s < 10 ? "0" + s : s;
        } else {
            if(elements.days) elements.days.innerText = "0";
            if(elements.hours) elements.hours.innerText = "00";
            if(elements.mins) elements.mins.innerText = "00";
            if(elements.secs) elements.secs.innerText = "00";
        }
    }
    
    setInterval(updateCountdown, 1000);
    updateCountdown();

    /* =======================================
       4. Active Navigation Links
       ======================================= */
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".glass-nav a");

    window.addEventListener("scroll", () => {
        let current = "";
        const scrollPosition = window.scrollY + window.innerHeight / 3;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    });
});
