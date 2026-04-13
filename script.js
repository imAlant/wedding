document.addEventListener("DOMContentLoaded", () => {

    /* =======================================
       0. Envelope Opening — Cinematic Sequence
       ======================================= */
    const envelopeWrapper = document.getElementById("envelope-wrapper");
    const envelopeBtn = document.getElementById("envelope-btn");
    const waxSeal = envelopeWrapper?.querySelector(".wax-seal");
    const envelope = envelopeWrapper?.querySelector(".envelope");

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
        const cy = rect.top - envRect.top + rect.height / 2;

        const colors = ["#ffd700", "#ffaa00", "#ff6600", "#fff5c0", "#ffffff"];
        for (let i = 0; i < 18; i++) {
            const spark = document.createElement("div");
            spark.className = "seal-spark";
            const angle = (i / 18) * Math.PI * 2;
            const dist = 60 + Math.random() * 60;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = 4 + Math.random() * 5;
            spark.style.cssText = `
                position:absolute;
                left:${cx}px; top:${cy}px;
                width:${size}px; height:${size}px;
                border-radius:50%;
                background:${color};
                box-shadow:0 0 ${size * 2}px ${color};
                z-index:30;
                pointer-events:none;
                transform:translate(-50%,-50%);
                animation: sparkFly 0.7s ease-out forwards;
                --tx:${Math.cos(angle) * dist}px;
                --ty:${Math.sin(angle) * dist}px;
            `;
            envelope.appendChild(spark);
            setTimeout(() => spark.remove(), 800);
        }
    }

    /* Spawn golden confetti from the top of the envelope */
    function spawnConfetti() {
        const container = document.getElementById("particles-container");
        if (!container) return;

        const colors = ["#d4af37", "#f9e46e", "#ffffff", "#ffd700", "#c8860a", "#ffe066", "#fffbe0"];
        for (let i = 0; i < 60; i++) {
            setTimeout(() => {
                const c = document.createElement("div");
                c.className = "confetti-piece";
                const color = colors[Math.floor(Math.random() * colors.length)];
                const size = 5 + Math.random() * 8;
                const isRect = Math.random() > 0.5;
                c.style.cssText = `
                    position:fixed;
                    left:${20 + Math.random() * 60}vw;
                    top:-10px;
                    width:${isRect ? size / 2 : size}px;
                    height:${isRect ? size * 2 : size}px;
                    background:${color};
                    border-radius:${isRect ? "2px" : "50%"};
                    opacity:0.9;
                    z-index:9998;
                    pointer-events:none;
                    animation: confettiFall ${1.5 + Math.random() * 2}s ease-in forwards;
                    animation-delay:${Math.random() * 0.6}s;
                    transform: rotate(${Math.random() * 360}deg);
                `;
                container.appendChild(c);
                setTimeout(() => c.remove(), 4000);
            }, i * 30);
        }
    }
});
/* =======================================
   1. Particles Generation
   ======================================= */
const container = document.getElementById("particles-container");
const colors = ["#d4af37", "#f3e5ab", "#ffffff"];

function createParticle() {
    if (!container) return;

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
        if (particle.parentNode) {
            particle.remove();
        }
    }, (duration + 2) * 1000);
}

// Create initial set of particles softly
for (let i = 0; i < 30; i++) {
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

const revealOnScroll = new IntersectionObserver(function (entries, observer) {
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

        if (elements.days) elements.days.innerText = d;
        if (elements.hours) elements.hours.innerText = h < 10 ? "0" + h : h;
        if (elements.mins) elements.mins.innerText = m < 10 ? "0" + m : m;
        if (elements.secs) elements.secs.innerText = s < 10 ? "0" + s : s;
    } else {
        if (elements.days) elements.days.innerText = "0";
        if (elements.hours) elements.hours.innerText = "00";
        if (elements.mins) elements.mins.innerText = "00";
        if (elements.secs) elements.secs.innerText = "00";
    }
}

setInterval(updateCountdown, 1000);
updateCountdown();

/* =======================================
   4. Background Music — Canon in D (Pachelbel) (Web Audio API)
   ======================================= */
const musicBtn = document.getElementById("music-toggle");
const musicIcon = document.getElementById("music-icon");

let audioCtx = null;
let masterGain = null;
let musicOn = false;
let musicStarted = false;
let loopTimer = null;

// ── Canon in D  —  D major, 72 BPM ──────────────────────────────
// Iconic 8-bar repeating bass: D – A – Bm – F# – G – D – G – A
const BASS_LINE = [146.83, 110.00, 123.47, 92.50, 98.00, 146.83, 98.00, 110.00];

// Chord tones for string pads (one chord per bar)
const PAD_CHORDS = [
    [293.66, 369.99, 440.00],  // D maj
    [220.00, 277.18, 329.63],  // A maj
    [246.94, 293.66, 369.99],  // B min
    [184.99, 246.94, 369.99],  // F# maj
    [196.00, 246.94, 293.66],  // G maj
    [293.66, 369.99, 440.00],  // D maj
    [196.00, 246.94, 293.66],  // G maj
    [220.00, 277.18, 329.63],  // A maj
];

// First variation: 4 quarter notes per bar × 8 bars
const MELODY_V1 = [
    739.99, 659.25, 587.33, 554.37,  // Bar 1 – D
    493.88, 440.00, 493.88, 554.37,  // Bar 2 – A
    587.33, 554.37, 493.88, 440.00,  // Bar 3 – Bm
    415.30, 369.99, 415.30, 440.00,  // Bar 4 – F#
    493.88, 440.00, 392.00, 440.00,  // Bar 5 – G
    493.88, 554.37, 587.33, 554.37,  // Bar 6 – D
    493.88, 440.00, 392.00, 369.99,  // Bar 7 – G
    329.63, 369.99, 415.30, 440.00,  // Bar 8 – A
];

// Second variation: 8 eighth notes per bar (runs)
const MELODY_V2 = [
    587.33, 659.25, 739.99, 659.25, 587.33, 554.37, 493.88, 440.00,
    493.88, 440.00, 415.30, 440.00, 493.88, 554.37, 493.88, 440.00,
    440.00, 493.88, 554.37, 493.88, 440.00, 415.30, 369.99, 329.63,
    369.99, 415.30, 369.99, 329.63, 277.18, 293.66, 329.63, 369.99,
    392.00, 440.00, 493.88, 440.00, 392.00, 369.99, 329.63, 369.99,
    440.00, 493.88, 554.37, 587.33, 659.25, 587.33, 554.37, 493.88,
    493.88, 440.00, 392.00, 369.99, 329.63, 369.99, 392.00, 440.00,
    493.88, 440.00, 415.30, 369.99, 329.63, 369.99, 415.30, 440.00,
];

let loopCount = 0;

function createAudioCtx() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.20, audioCtx.currentTime + 3.5);
    masterGain.connect(audioCtx.destination);
}

/* Piano / harp-like tone: sine + faint 2nd harmonic, natural decay */
function playNote(freq, startTime, duration, vol = 0.10) {
    if (!audioCtx || !masterGain) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc.type = "sine"; osc2.type = "triangle";
    osc.frequency.setValueAtTime(freq, startTime);
    osc2.frequency.setValueAtTime(freq * 2, startTime);
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(vol, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(vol * 0.35, startTime + duration * 0.35);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    gain2.gain.setValueAtTime(0, startTime);
    gain2.gain.linearRampToValueAtTime(vol * 0.22, startTime + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.22);
    osc.connect(gain); gain.connect(masterGain);
    osc2.connect(gain2); gain2.connect(masterGain);
    osc.start(startTime); osc.stop(startTime + duration + 0.05);
    osc2.start(startTime); osc2.stop(startTime + duration * 0.25);
}

/* Warm string pad — detuned triangle waves, slow bow attack */
function playPad(freqs, startTime, duration, vol = 0.042) {
    if (!audioCtx || !masterGain) return;
    freqs.forEach((freq, i) => {
        [-5, 0, 5].forEach(det => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(freq, startTime);
            osc.detune.setValueAtTime(det + i * 2, startTime);
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(vol, startTime + 1.4);
            gain.gain.setValueAtTime(vol, startTime + duration - 1.2);
            gain.gain.linearRampToValueAtTime(0, startTime + duration);
            osc.connect(gain); gain.connect(masterGain);
            osc.start(startTime); osc.stop(startTime + duration + 0.1);
        });
    });
}

/* Soft pizzicato bass pluck */
function playBass(freq, startTime, duration) {
    if (!audioCtx || !masterGain) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.16, startTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.7);
    osc.connect(gain); gain.connect(masterGain);
    osc.start(startTime); osc.stop(startTime + duration);
}

/* Schedule one 8-bar Canon in D loop */
function scheduleLoop(startTime) {
    const BPM = 72;
    const beat = 60 / BPM;       // 0.833s
    const barDur = beat * 4;       // 4/4
    const loopDur = barDur * 8;

    const useV2 = (loopCount % 2 === 1);
    const melody = useV2 ? MELODY_V2 : MELODY_V1;
    const noteDur = useV2 ? beat / 2 : beat;

    // String pads — one per bar
    PAD_CHORDS.forEach((chord, bar) => {
        playPad(chord, startTime + bar * barDur, barDur * 1.04);
    });

    // Bass — root on beat 1, perfect 5th on beat 3
    BASS_LINE.forEach((freq, bar) => {
        const bs = startTime + bar * barDur;
        playBass(freq, bs, beat * 1.2);
        playBass(freq * 1.498, bs + beat * 2, beat * 0.9);
    });

    // Melody
    melody.forEach((freq, i) => {
        const t = startTime + i * noteDur;
        const vol = useV2 ? (i % 4 === 0 ? 0.10 : 0.07)
            : (i % 4 === 0 ? 0.12 : 0.08);
        playNote(freq, t, noteDur * 1.5, vol);
    });

    loopCount++;
    return loopDur;
}

function startMusic() {
    createAudioCtx();
    if (audioCtx.state === "suspended") audioCtx.resume();
    let nextStart = audioCtx.currentTime + 0.1;
    const dur = scheduleLoop(nextStart);
    function loop() {
        nextStart += dur;
        scheduleLoop(nextStart);
        loopTimer = setTimeout(loop, (dur - 2) * 1000);
    }
    loopTimer = setTimeout(loop, (dur - 2) * 1000);
    musicOn = true; musicStarted = true;
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
    musicIcon.textContent = "♪";
    musicBtn.classList.toggle("muted", !musicOn);
    musicBtn.title = musicOn ? "Mute music" : "Play music";
}

window.addEventListener("envelopeOpened", () => {
    if (musicBtn) musicBtn.classList.add("visible");
    startMusic();
});

if (musicBtn) {
    musicBtn.addEventListener("click", () => {
        musicOn ? pauseMusic() : resumeMusic();
    });
}

window._fireEnvelopeOpened = () => {
    window.dispatchEvent(new Event("envelopeOpened"));
};
