/**
 * Neural & Vascular Canvas Particle System
 * مبادرة تنفّس وعي - خلفية حية ناعمة تحاكي الأوعية الدقيقة
 */

class NeuralParticleBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationFrameId = null;
    this.isPaused = false;
    this.mouse = { x: null, y: null, radius: 140 };

    // Density setting from config or fallback
    this.particleCount = (window.presentationConfig && window.presentationConfig.presentation.particlesDensity) || 55;
    this.connectionDistance = 140;

    // Atmospheric Moyamoya Smoke Clouds (سحابة دخان المويا مويا الحية)
    this.smokePuffs = [];
    this.smokeCount = 7;

    // Floating Stardust Sparks
    this.sparks = [];
    this.sparkCount = 35;

    // Breathing pulse tracker
    this.breathCycle = 0;

    // Accessibility check
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.particleCount = 18;
      this.smokeCount = 3;
      this.sparkCount = 10;
    }

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Mouse proximity interaction
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    this.createSmokePuffs();
    this.createParticles();
    this.createSparks();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    if (this.width < 900) {
      this.particleCount = 25;
      this.smokeCount = 4;
      this.connectionDistance = 90;
    }
  }

  // Create soft organic Moyamoya smoke nebula puffs (سحابة دخان)
  createSmokePuffs() {
    this.smokePuffs = [];
    for (let i = 0; i < this.smokeCount; i++) {
      this.smokePuffs.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 260 + 220,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.05 + 0.03,
        // Brand cyan (#18A6B7) and royal blue (#0757A6)
        color: i % 2 === 0 ? '24, 166, 183' : '7, 87, 166',
        scale: 1,
        pulseSpeed: Math.random() * 0.0015 + 0.001
      });
    }
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.42,
        vy: (Math.random() - 0.5) * 0.42,
        radius: Math.random() * 2.2 + 1.2,
        baseAlpha: Math.random() * 0.45 + 0.18,
        color: Math.random() > 0.4 ? 'rgba(24, 166, 183, ' : 'rgba(20, 139, 209, '
      });
    }
  }

  // Glowing upward floating embers / sparks
  createSparks() {
    this.sparks = [];
    for (let i = 0; i < this.sparkCount; i++) {
      this.sparks.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 1.5 + 0.8,
        vy: -(Math.random() * 0.45 + 0.15),
        vx: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.6 + 0.2,
        decay: Math.random() * 0.003 + 0.001
      });
    }
  }

  animate() {
    if (!this.isPaused) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.breathCycle += 0.015;

      // 1. Draw Living Moyamoya Smoke Clouds (سحابة الدخان الناعمة)
      for (let s of this.smokePuffs) {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < -s.radius) s.x = this.width + s.radius;
        if (s.x > this.width + s.radius) s.x = -s.radius;
        if (s.y < -s.radius) s.y = this.height + s.radius;
        if (s.y > this.height + s.radius) s.y = -s.radius;

        // Gentle breathing pulsation
        const pulse = Math.sin(this.breathCycle * 0.6 + s.x) * 0.15;
        const currentRadius = s.radius * (1 + pulse);
        const currentAlpha = Math.max(0.01, s.alpha * (1 + pulse * 0.5));

        const grad = this.ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, currentRadius);
        grad.addColorStop(0, `rgba(${s.color}, ${currentAlpha})`);
        grad.addColorStop(0.5, `rgba(${s.color}, ${currentAlpha * 0.5})`);
        grad.addColorStop(1, 'rgba(3, 27, 59, 0)');

        this.ctx.beginPath();
        this.ctx.arc(s.x, s.y, currentRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = grad;
        this.ctx.fill();
      }

      // 2. Draw Floating Sparks (ذرات مضيئة صاعدة)
      for (let sp of this.sparks) {
        sp.y += sp.vy;
        sp.x += sp.vx;
        if (sp.y < 0) {
          sp.y = this.height;
          sp.x = Math.random() * this.width;
        }

        this.ctx.beginPath();
        this.ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(221, 245, 250, ${sp.alpha})`;
        this.ctx.shadowBlur = 6;
        this.ctx.shadowColor = 'rgba(24, 166, 183, 0.8)';
        this.ctx.fill();
      }

      // 3. Draw Connected Neuro-Vascular Network
      for (let i = 0; i < this.particles.length; i++) {
        const p1 = this.particles[i];

        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > this.width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > this.height) p1.vy *= -1;

        // Node
        this.ctx.beginPath();
        this.ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = p1.color + p1.baseAlpha + ')';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = 'rgba(24, 166, 183, 0.6)';
        this.ctx.fill();

        // Synaptic connections
        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < this.connectionDistance) {
            const alpha = (1 - dist / this.connectionDistance) * 0.22;
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.strokeStyle = `rgba(24, 166, 183, ${alpha})`;
            this.ctx.lineWidth = 1;
            this.ctx.shadowBlur = 0;
            this.ctx.stroke();
          }
        }

        // Proximity interaction with cursor
        if (this.mouse.x !== null) {
          const mdx = p1.x - this.mouse.x;
          const mdy = p1.y - this.mouse.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < this.mouse.radius && mDist > 0) {
            const force = (1 - mDist / this.mouse.radius) * 0.8;
            p1.x += (mdx / mDist) * force;
            p1.y += (mdy / mDist) * force;
          }
        }
      }
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  togglePause() {
    this.isPaused = !this.isPaused;
  }
}

// Auto instantiate when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  window.particleSystem = new NeuralParticleBackground('particles-canvas');
});
