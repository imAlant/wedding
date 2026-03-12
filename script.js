document.addEventListener("DOMContentLoaded", () => {
    
    /* =======================================
       0. Envelope Opening — Cinematic Sequence
       ======================================= */
    const envelopeWrapper = document.getElementById("envelope-wrapper");
    const envelopeBtn    = document.getElementById("envelope-btn");
    const waxSeal        = envelopeWrapper?.querySelector(".wax-seal");
    const envelope       = envelopeWrapper?.querySelector(".envelope");

    let opened = false;

    function openEnvelope() {
        if (opened) return;
        opened = true;

        // ── Stage 1 (0ms): Seal shakes/vibrates ──────────────────────
        waxSeal?.classList.add("seal-cracking");

        // ── Stage 2 (400ms): Seal explodes / shatters out ────────────
        setTimeout(() => {
            waxSeal?.classList.add("seal-explode");
            spawnSealParticles();
        }, 400);

        // ── Stage 3 (900ms): Flap folds open ─────────────────────────
        setTimeout(() => {
            envelopeBtn.classList.add("flap-open");
        }, 900);

        // ── Stage 4 (1600ms): Letter slides up + golden confetti ──────
        setTimeout(() => {
            envelopeBtn.classList.add("letter-rise");
            spawnConfetti();
            // Start BGM in sync with letter rise (user gesture already happened)
            if (window._fireEnvelopeOpened) window._fireEnvelopeOpened();
        }, 1600);

        // ── Stage 5 (3800ms): Envelope drifts away, main page fades in
        setTimeout(() => {
            envelopeBtn.classList.add("envelope-exit");
        }, 3800);

        setTimeout(() => {
            envelopeWrapper.classList.add("hidden");
            document.body.classList.remove("envelope-active");
            document.body.classList.add("loaded");
        }, 5200);
    }

    if (envelopeBtn && envelopeWrapper) {
        envelopeBtn.addEventListener("click", openEnvelope);
        // Also allow clicking the wax seal specifically
        waxSeal?.addEventListener("click", (e) => {
            e.stopPropagation();
            openEnvelope();
        });
    } else {
        setTimeout(() => document.body.classList.add("loaded"), 100);
    }

    /* Spawn small radial sparks from the wax seal on crack */
    function spawnSealParticles() {
        if (!envelope) return;
        const seal = envelope.querySelector(".wax-seal");
        if (!seal) return;

        const rect = seal.getBoundingClientRect();
        const envRect = envelope.getBoundingClientRect();
        const cx = rect.left - envRect.left + rect.width / 2;
        const cy = rect.top  - envRect.top  + rect.height / 2;

        const colors = ["#ffd700", "#ffaa00", "#ff6600", "#fff5c0", "#ffffff"];
        for (let i = 0; i < 18; i++) {
            const spark = document.createElement("div");
            spark.className = "seal-spark";
            const angle = (i / 18) * Math.PI * 2;
            const dist  = 60 + Math.random() * 60;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size  = 4 + Math.random() * 5;
            spark.style.cssText = `
                position:absolute;
                left:${cx}px; top:${cy}px;
                width:${size}px; height:${size}px;
                border-radius:50%;
                background:${color};
                box-shadow:0 0 ${size*2}px ${color};
                z-index:30;
                pointer-events:none;
                transform:translate(-50%,-50%);
                animation: sparkFly 0.7s ease-out forwards;
                --tx:${Math.cos(angle)*dist}px;
                --ty:${Math.sin(angle)*dist}px;
            `;
            envelope.appendChild(spark);
            setTimeout(() => spark.remove(), 800);
        }
    }

    /* Spawn golden confetti from the top of the envelope */
    function spawnConfetti() {
        const container = document.getElementById("particles-container");
        if (!container) return;

        const colors = ["#d4af37","#f9e46e","#ffffff","#ffd700","#c8860a","#ffe066","#fffbe0"];
        for (let i = 0; i < 60; i++) {
            setTimeout(() => {
                const c = document.createElement("div");
                c.className = "confetti-piece";
                const color = colors[Math.floor(Math.random() * colors.length)];
                const size  = 5 + Math.random() * 8;
                const isRect = Math.random() > 0.5;
                c.style.cssText = `
                    position:fixed;
                    left:${20 + Math.random() * 60}vw;
                    top:-10px;
                    width:${isRect ? size/2 : size}px;
                    height:${isRect ? size * 2 : size}px;
                    background:${color};
                    border-radius:${isRect ? "2px" : "50%"};
                    opacity:0.9;
                    z-index:9998;
                    pointer-events:none;
                    animation: confettiFall ${1.5 + Math.random()*2}s ease-in forwards;
                    animation-delay:${Math.random()*0.6}s;
                    transform: rotate(${Math.random()*360}deg);
                `;
                container.appendChild(c);
                setTimeout(() => c.remove(), 4000);
            }, i * 30);
        }
    }


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
       4. Background Music (Web Audio API)
       ======================================= */
    const musicBtn  = document.getElementById("music-toggle");
    const musicIcon = document.getElementById("music-icon");

    let audioCtx    = null;
    let masterGain  = null;
    let musicOn     = false;
    let musicStarted = false;
    let scheduledNodes = [];

    // Warm romantic chord progression (Am - F - C - G) with frequencies
    const CHORDS = [
        // Am
        [220.00, 261.63, 329.63, 392.00],
        // F
        [174.61, 220.00, 261.63, 349.23],
        // C
        [130.81, 164.81, 196.00, 261.63],
        // G
        [196.00, 246.94, 293.66, 392.00],
    ];

    // Gentle melody notes over Am - F - C - G (relative to A minor)
    const MELODY = [
        440.00, 392.00, 349.23, 392.00,  // over Am
        349.23, 329.63, 293.66, 329.63,  // over F
        329.63, 293.66, 261.63, 293.66,  // over C
        392.00, 349.23, 329.63, 392.00,  // over G
    ];

    function createAudioCtx() {
        if (audioCtx) return;
        audioCtx   = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.28, audioCtx.currentTime + 3);
        masterGain.connect(audioCtx.destination);
    }

    /* Play a single soft note with attack/release envelope */
    function playNote(freq, startTime, duration, vol = 0.15, type = "sine") {
        if (!audioCtx || !masterGain) return;

        const osc  = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type      = type;
        osc.frequency.setValueAtTime(freq, startTime);

        // Soft detuning for warmth
        osc.detune.setValueAtTime((Math.random() - 0.5) * 4, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(vol, startTime + 0.08);
        gain.gain.setValueAtTime(vol, startTime + duration - 0.3);
        gain.gain.linearRampToValueAtTime(0, startTime + duration);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(startTime);
        osc.stop(startTime + duration + 0.05);

        scheduledNodes.push({ osc, gain });
    }

    /* Schedule one full 4-chord loop */
    function scheduleLoop(startTime) {
        const noteDur  = 1.8;   // each melody note
        const chordDur = 7.2;   // each chord block (4 notes)
        const loopDur  = chordDur * 4;

        CHORDS.forEach((chord, ci) => {
            const chordStart = startTime + ci * chordDur;

            // Warm low bass note
            playNote(chord[0] / 2, chordStart, chordDur * 0.95, 0.12, "sine");

            // Soft chord pads — triangle waves for warmth
            chord.forEach((freq, fi) => {
                const delay = fi * 0.12; // slight arpeggiated strum
                playNote(freq, chordStart + delay, chordDur * 0.9 - delay, 0.06, "triangle");
            });

            // Melody notes on top (4 per chord block)
            for (let n = 0; n < 4; n++) {
                const noteIdx  = ci * 4 + n;
                const noteFreq = MELODY[noteIdx] || 0;
                const noteStart = chordStart + n * noteDur;
                if (noteFreq > 0) {
                    playNote(noteFreq, noteStart, noteDur * 0.85, 0.08, "sine");
                    // Soft 5th harmony
                    playNote(noteFreq * 1.5, noteStart, noteDur * 0.7, 0.025, "sine");
                }
            }
        });

        return loopDur;
    }

    let loopTimer = null;

    function startMusic() {
        createAudioCtx();
        if (audioCtx.state === "suspended") audioCtx.resume();

        let nextStart = audioCtx.currentTime + 0.1;
        const dur = scheduleLoop(nextStart);

        // Keep looping seamlessly
        function loop() {
            nextStart += dur;
            scheduleLoop(nextStart);
            loopTimer = setTimeout(loop, (dur - 4) * 1000);
        }
        loopTimer = setTimeout(loop, (dur - 4) * 1000);

        musicOn = true;
        musicStarted = true;
        updateMusicBtn();
    }

    function pauseMusic() {
        if (audioCtx) audioCtx.suspend();
        clearTimeout(loopTimer);
        musicOn = false;
        updateMusicBtn();
    }

    function resumeMusic() {
        if (!musicStarted) { startMusic(); return; }
        if (audioCtx) audioCtx.resume();
        musicOn = true;
        updateMusicBtn();
    }

    function updateMusicBtn() {
        if (!musicBtn) return;
        if (musicOn) {
            musicIcon.textContent = "♪";
            musicBtn.classList.remove("muted");
            musicBtn.title = "Mute music";
        } else {
            musicIcon.textContent = "♪";
            musicBtn.classList.add("muted");
            musicBtn.title = "Play music";
        }
    }

    // Show music button after envelope opens, and auto-start music
    window.addEventListener("envelopeOpened", () => {
        if (musicBtn) musicBtn.classList.add("visible");
        startMusic();
    });

    if (musicBtn) {
        musicBtn.addEventListener("click", () => {
            musicOn ? pauseMusic() : resumeMusic();
        });
    }

    // Expose function so envelope code can fire the event
    window._fireEnvelopeOpened = () => {
        window.dispatchEvent(new Event("envelopeOpened"));
    };

});
