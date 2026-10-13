/**
 * Presentation Animation Engine & Sound Design
 * مبادرة تنفّس وعي | مؤتمر المويا مويا
 */

class PresentationAudio {
  constructor() {
    // Start enabled for conference atmosphere, with user interaction resume
    this.muted = false;
    this.audioCtx = null;
    this.ambientGain = null;
    this.isAmbientPlaying = false;
    this.ambientOscillators = [];
    this.breathInterval = null;
    this.lfoTimer = null;
    this.eqCallbacks = [];
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Toggle Mute / Unmute
  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopAmbientSoundscape();
    } else {
      this.initContext();
      this.playTone(520, 'sine', 0.12, 0.08); // pleasant unmute chime
      this.startAmbientSoundscape();
    }
    this.updateBadgeUI();
    return this.muted;
  }

  // Set explicit mute state
  setMuted(state) {
    if (this.muted === state) return;
    this.toggleMute();
  }

  // -------------------------------------------------------------
  // ATMOSPHERIC CINEMATIC AMBIENT SOUNDSCAPE (أجواء سينمائية للمؤتمر)
  // Generative warm ambient pad that breathes gently with "تنفّس وعي"
  // -------------------------------------------------------------
  startAmbientSoundscape() {
    if (this.muted || this.isAmbientPlaying) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      this.isAmbientPlaying = true;
      const ctx = this.audioCtx;

      // Master ambient gain node
      this.ambientGain = ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, ctx.currentTime);
      // Gentle fade-in over 3 seconds
      this.ambientGain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 3);

      // Lowpass resonant filter for smooth warmth
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);
      filter.Q.setValueAtTime(1.8, ctx.currentTime);

      // Soft Stereo Delay / Reverb simulation
      const delay = ctx.createDelay();
      delay.delayTime.setValueAtTime(0.35, ctx.currentTime);
      const delayFeedback = ctx.createGain();
      delayFeedback.gain.setValueAtTime(0.28, ctx.currentTime);

      // Connect routing
      filter.connect(this.ambientGain);
      this.ambientGain.connect(ctx.destination);
      this.ambientGain.connect(delay);
      delay.connect(delayFeedback);
      delayFeedback.connect(delay);
      delayFeedback.connect(ctx.destination);

      // Harmonic chords for "تنفّس وعي" (Ebmaj9, Abadd9, Bb sus4)
      // Base frequencies (Hz): Eb2 (77.78), Bb2 (116.54), G3 (196), D4 (293.66), F4 (349.23)
      const chordFrequencies = [77.78, 116.54, 155.56, 196.00, 293.66, 349.23];
      this.ambientOscillators = [];

      chordFrequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        // Alternate warm triangle and soft sine waves
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Subtle detuning for lush chorusing atmosphere
        const detuneCents = (Math.random() - 0.5) * 8;
        osc.detune.setValueAtTime(detuneCents, ctx.currentTime);

        // Individual voice balance
        const voiceVol = idx < 2 ? 0.35 : 0.18;
        oscGain.gain.setValueAtTime(voiceVol, ctx.currentTime);

        osc.connect(oscGain);
        oscGain.connect(filter);
        osc.start();

        this.ambientOscillators.push(osc);
      });

      // "تنفّس وعي" Breathing Cycle Modulation (LFO: Inhale / Exhale every 5.5s)
      let breathPhase = 0;
      this.lfoTimer = setInterval(() => {
        if (!this.isAmbientPlaying || !this.audioCtx || this.audioCtx.state === 'closed') return;
        try {
          const now = this.audioCtx.currentTime;
          breathPhase = (breathPhase + 1) % 2;
          if (breathPhase === 1) {
            // Inhale (تنفّس): filter opens up, volume swells gently
            filter.frequency.setTargetAtTime(750, now, 2.0);
            if (this.ambientGain) this.ambientGain.gain.setTargetAtTime(0.09, now, 1.8);
          } else {
            // Exhale: filter softens, warm relaxation
            filter.frequency.setTargetAtTime(380, now, 2.2);
            if (this.ambientGain) this.ambientGain.gain.setTargetAtTime(0.05, now, 2.0);
          }
        } catch (e) {}
      }, 5500);

      this.updateBadgeUI();
    } catch (e) {
      this.isAmbientPlaying = false;
    }
  }

  stopAmbientSoundscape() {
    if (!this.isAmbientPlaying) return;
    this.isAmbientPlaying = false;

    if (this.lfoTimer) {
      clearInterval(this.lfoTimer);
      this.lfoTimer = null;
    }

    if (this.ambientGain && this.audioCtx) {
      try {
        const now = this.audioCtx.currentTime;
        this.ambientGain.gain.setTargetAtTime(0.0001, now, 0.4);
        setTimeout(() => {
          this.ambientOscillators.forEach(osc => {
            try { osc.stop(); osc.disconnect(); } catch (err) {}
          });
          this.ambientOscillators = [];
        }, 500);
      } catch (e) {}
    }
    this.updateBadgeUI();
  }

  // Update on-screen Audio Badge indicator
  updateBadgeUI() {
    const badge = document.getElementById('audio-atmosphere-badge');
    const btnAudio = document.getElementById('btn-audio');
    const badgeText = document.querySelector('.audio-badge-text');

    const isActive = !this.muted && this.isAmbientPlaying;

    if (badge) {
      badge.classList.toggle('playing', isActive);
      badge.classList.toggle('muted', this.muted);
    }
    if (btnAudio) {
      btnAudio.classList.toggle('active', isActive);
    }
    if (badgeText) {
      badgeText.textContent = isActive ? 'الأجواء الصوتية: مفعّلة' : 'الأجواء الصوتية: صامت (اضغط A)';
    }
  }

  // Synthesize soft tactile click
  playClick() {
    if (this.muted) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(640, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, this.audioCtx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.06);
    } catch (e) {}
  }

  // Synthesize smooth cinematic slide transition sweep & sub bass
  playTransition() {
    if (this.muted) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;

      // Sub-bass sweep
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.35);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.42);

      // Gentle high chime sparkle
      const chime = this.audioCtx.createOscillator();
      const chimeGain = this.audioCtx.createGain();
      chime.type = 'triangle';
      chime.frequency.setValueAtTime(880, now + 0.08);
      chime.frequency.exponentialRampToValueAtTime(1320, now + 0.3);
      chimeGain.gain.setValueAtTime(0.025, now + 0.08);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      chime.connect(chimeGain);
      chimeGain.connect(this.audioCtx.destination);
      chime.start(now + 0.08);
      chime.stop(now + 0.42);
    } catch (e) {}
  }

  // Synthesize subtle heartbeat sound (lub-dub)
  playHeartbeat() {
    if (this.muted) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      // Lub
      this.triggerHeartThump(now, 68, 0.14);
      // Dub
      this.triggerHeartThump(now + 0.24, 54, 0.1);
    } catch (e) {}
  }

  triggerHeartThump(time, freq, duration) {
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(28, time + duration);
    gain.gain.setValueAtTime(0.18, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(time);
    osc.stop(time + duration + 0.02);
  }

  // Triumphant shimmer on finale (Slide 14)
  playFinaleChime() {
    if (this.muted) return;
    this.initContext();
    if (!this.audioCtx) return;

    const notes = [311.13, 392.00, 466.16, 622.25, 783.99]; // Eb major pentatonic
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 1.4, 0.05);
      }, idx * 140);
    });
  }

  playTone(freq, type, duration, volume) {
    if (!this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {}
  }
}

class VascularSvgAnimator {
  constructor(svgContainerId) {
    this.container = document.getElementById(svgContainerId);
    this.initPaths();
  }

  initPaths() {
    if (!this.container) return;
    // Render dynamic cerebral vascular network in background
    const paths = [
      "M -100 150 Q 300 280 650 180 T 1300 320 T 2100 150",
      "M -50 850 Q 400 620 900 780 T 1600 580 T 2100 900",
      "M 250 -50 Q 400 450 320 850 T 450 1200",
      "M 1650 -50 Q 1500 400 1600 800 T 1550 1200",
      "M 960 540 Q 820 400 600 460 T 350 380",
      "M 960 540 Q 1100 400 1320 460 T 1570 380"
    ];

    let svgHtml = `<svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">`;
    paths.forEach((d, idx) => {
      svgHtml += `<path id="vasc-path-${idx}" d="${d}" fill="none" stroke="rgba(24, 166, 183, 0.4)" stroke-width="${idx < 2 ? 2.5 : 1.5}" stroke-linecap="round" />`;
    });
    svgHtml += `</svg>`;
    this.container.innerHTML = svgHtml;
  }

  triggerDrawAnimation() {
    const paths = this.container?.querySelectorAll('path');
    if (!paths) return;
    paths.forEach(p => {
      const length = p.getTotalLength();
      p.style.transition = 'none';
      p.style.strokeDasharray = `${length}`;
      p.style.strokeDashoffset = `${length}`;
      p.getBoundingClientRect(); // trigger reflow
      p.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1)';
      p.style.strokeDashoffset = '0';
    });
  }
}

// Number Count-Up Animation
function animateCountUp(element, target, duration = 1600) {
  if (!element || isNaN(target)) return;
  const start = 0;
  const startTime = performance.now();

  function updateNumber(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out quart
    const easeProgress = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(start + (target - start) * easeProgress);

    element.textContent = current.toLocaleString('ar-EG');

    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    } else {
      element.textContent = target.toLocaleString('ar-EG');
    }
  }

  requestAnimationFrame(updateNumber);
}

// Word by word reveal
function revealWordsSequentially(containerSelector, delayBetweenWords = 140) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const text = container.dataset.rawText || container.textContent.trim();
  container.dataset.rawText = text;
  const words = text.split(/\s+/);

  container.innerHTML = words.map(w => `<span class="word-span" style="opacity:0; display:inline-block; transition: opacity 0.5s ease, transform 0.5s ease; transform: translateY(10px); margin: 0 4px;">${w}</span>`).join(' ');

  const spans = container.querySelectorAll('.word-span');
  spans.forEach((span, idx) => {
    setTimeout(() => {
      span.style.opacity = '1';
      span.style.transform = 'translateY(0)';
    }, idx * delayBetweenWords);
  });
}

window.PresentationAudio = PresentationAudio;
window.VascularSvgAnimator = VascularSvgAnimator;
window.animateCountUp = animateCountUp;
window.revealWordsSequentially = revealWordsSequentially;
