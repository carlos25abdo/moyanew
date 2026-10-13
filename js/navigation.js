/**
 * Navigation & Interactive Sequencing Engine
 * مبادرة تنفّس وعي | مؤتمر المويا مويا
 */

class DeckNavigation {
  constructor() {
    this.slides = Array.from(document.querySelectorAll('.slide'));
    this.totalSlides = this.slides.length;
    this.currentIndex = 0;
    this.slideStep = 0;
    this.audio = new window.PresentationAudio();
    this.vascularAnimator = new window.VascularSvgAnimator('vascular-svg-bg');
    this.presenter = new window.PresenterManager(this);
    this.wakeLock = null;
    this.idleTimer = null;

    this.initHUD();
    this.initKeyboard();
    this.initTouch();
    this.initIdleHUD();
    this.requestWakeLock();
    this.updateHUD();
  }

  initHUD() {
    this.navHud = document.getElementById('nav-hud');
    this.progressTrack = document.getElementById('nav-progress-track');
    this.slideNumIndicator = document.getElementById('slide-number-indicator');

    if (this.progressTrack) {
      this.progressTrack.innerHTML = '';
      this.slides.forEach((slide, idx) => {
        const dot = document.createElement('div');
        dot.className = `nav-progress-dot ${idx === 0 ? 'active' : ''}`;
        dot.dataset.index = idx;

        const titleEl = slide.querySelector('h1, h2, .slide-title-main, .slide2-main-question');
        const titleText = titleEl ? titleEl.textContent.trim().substring(0, 32) : `سلايد ${idx + 1}`;

        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip';
        tooltip.textContent = `${(idx + 1).toString().padStart(2, '0')}: ${titleText}`;
        dot.appendChild(tooltip);

        dot.addEventListener('click', () => {
          this.goToSlide(idx);
        });

        this.progressTrack.appendChild(dot);
      });
    }

    // Fullscreen button
    const btnFullscreen = document.getElementById('btn-fullscreen');
    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', () => this.toggleFullscreen());
    }

    // Audio button
    const btnAudio = document.getElementById('btn-audio');
    if (btnAudio) {
      btnAudio.addEventListener('click', () => {
        const muted = this.audio.toggleMute();
        btnAudio.classList.toggle('active', !muted);
      });
    }

    // Audio Atmosphere Badge
    const audioBadge = document.getElementById('audio-atmosphere-badge');
    if (audioBadge) {
      audioBadge.addEventListener('click', () => {
        const muted = this.audio.toggleMute();
        if (btnAudio) btnAudio.classList.toggle('active', !muted);
      });
    }

    // Overview button
    const btnOverview = document.getElementById('btn-overview');
    if (btnOverview) {
      btnOverview.addEventListener('click', () => this.presenter.toggleOverview());
    }

    // Notes button
    const btnNotes = document.getElementById('btn-notes');
    if (btnNotes) {
      btnNotes.addEventListener('click', () => this.presenter.toggleSpeakerNotes());
    }

    // Spotlight button
    const btnSpotlight = document.getElementById('btn-spotlight');
    if (btnSpotlight) {
      btnSpotlight.addEventListener('click', () => this.presenter.toggleSpotlight());
    }

    // Laser button
    const btnLaser = document.getElementById('btn-laser');
    if (btnLaser) {
      btnLaser.addEventListener('click', () => this.presenter.toggleLaser());
    }
  }

  initKeyboard() {
    window.addEventListener('keydown', (e) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      switch (e.code) {
        // Next
        case 'ArrowRight':
        case 'ArrowDown':
        case 'Space':
        case 'Enter':
          e.preventDefault();
          this.next();
          break;

        // Previous
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          this.prev();
          break;

        // First Slide
        case 'Home':
          e.preventDefault();
          this.goToSlide(0);
          break;

        // Last Slide
        case 'End':
          e.preventDefault();
          this.goToSlide(this.totalSlides - 1);
          break;

        // Overview
        case 'Escape':
          e.preventDefault();
          this.presenter.toggleOverview();
          break;

        // Fullscreen
        case 'KeyF':
          e.preventDefault();
          this.toggleFullscreen();
          break;

        // Presenter Notes
        case 'KeyS':
          e.preventDefault();
          this.presenter.toggleSpeakerNotes();
          break;

        // Presenter Menu / Shortcuts
        case 'KeyM':
          e.preventDefault();
          this.presenter.toggleShortcutsModal();
          break;

        // Spotlight
        case 'KeyL':
          e.preventDefault();
          this.presenter.toggleSpotlight();
          break;

        // Laser pointer
        case 'KeyR':
          e.preventDefault();
          this.presenter.toggleLaser();
          break;

        // Pause Particles / Animations
        case 'KeyP':
          e.preventDefault();
          if (window.particleSystem) window.particleSystem.togglePause();
          break;

        // Focus Mode (clean screen)
        case 'Digit0':
        case 'Numpad0':
          e.preventDefault();
          this.presenter.toggleFocusMode();
          break;

        // Audio mute toggle
        case 'KeyA':
          e.preventDefault();
          const muted = this.audio.toggleMute();
          const btnAudio = document.getElementById('btn-audio');
          if (btnAudio) btnAudio.classList.toggle('active', !muted);
          break;
      }
    });
  }

  initTouch() {
    let touchStartX = 0;
    let touchStartY = 0;

    window.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Ensure horizontal swipe
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        // RTL logic: swipe left goes Next, swipe right goes Previous
        if (diffX < 0) {
          this.next();
        } else {
          this.prev();
        }
      }
    }, { passive: true });
  }

  initIdleHUD() {
    const delay = window.presentationConfig?.presentation?.autoHideNavDelay ?? 2500;
    const showHUD = () => {
      if (this.navHud) this.navHud.classList.remove('idle-hidden');
      const topHud = document.getElementById('brand-top-hud');
      if (topHud) topHud.classList.remove('idle-hidden');
      const audioBadge = document.getElementById('audio-atmosphere-badge');
      if (audioBadge) audioBadge.classList.remove('idle-hidden');

      clearTimeout(this.idleTimer);
      this.idleTimer = setTimeout(() => {
        if (this.navHud) this.navHud.classList.add('idle-hidden');
        if (topHud) topHud.classList.add('idle-hidden');
        if (audioBadge) audioBadge.classList.add('idle-hidden');
      }, delay);
    };

    window.addEventListener('mousemove', showHUD);
    window.addEventListener('keydown', showHUD);
    showHUD();
  }

  async requestWakeLock() {
    try {
      if ('wakeLock' in navigator) {
        this.wakeLock = await navigator.wakeLock.request('screen');
        document.addEventListener('visibilitychange', async () => {
          if (this.wakeLock !== null && document.visibilityState === 'visible') {
            this.wakeLock = await navigator.wakeLock.request('screen');
          }
        });
      }
    } catch (err) {
      // Screen wake lock request failed or not supported
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }

  // Next Slide or Sub-step
  next() {
    const handledStep = this.handleSlideStepForward(this.currentIndex);
    if (!handledStep) {
      if (this.currentIndex < this.totalSlides - 1) {
        this.goToSlide(this.currentIndex + 1);
      }
    } else {
      this.audio.playClick();
    }
  }

  // Prev Slide or Sub-step
  prev() {
    if (this.slideStep > 0) {
      this.handleSlideStepBackward(this.currentIndex);
      this.audio.playClick();
    } else {
      if (this.currentIndex > 0) {
        this.goToSlide(this.currentIndex - 1, true);
      }
    }
  }

  goToSlide(index, fromEnd = false) {
    if (index < 0 || index >= this.totalSlides || index === this.currentIndex && this.slides[index].classList.contains('active')) return;

    const prevSlide = this.slides[this.currentIndex];
    const newSlide = this.slides[index];

    // Trigger transition audio
    this.audio.playTransition();

    // Trigger SVG dash animation
    this.vascularAnimator.triggerDrawAnimation();

    // Transition classes
    if (prevSlide) {
      prevSlide.classList.remove('active');
      prevSlide.classList.add('previous');
      setTimeout(() => prevSlide.classList.remove('previous'), 900);
    }

    this.currentIndex = index;
    this.slideStep = 0;

    newSlide.classList.add('active');

    // Trigger Slide specific on-enter lifecycle
    this.onSlideEnter(index);

    this.updateHUD();
    this.presenter.updateSpeakerNotes();
  }

  updateHUD() {
    if (this.slideNumIndicator) {
      this.slideNumIndicator.textContent = `${(this.currentIndex + 1).toString().padStart(2, '0')} ━━━━ ${this.totalSlides.toString().padStart(2, '0')}`;
    }

    if (this.progressTrack) {
      const dots = this.progressTrack.querySelectorAll('.nav-progress-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === this.currentIndex);
      });
    }
  }

  getCurrentSlide() {
    return this.slides[this.currentIndex];
  }

  getNextSlide() {
    return this.slides[this.currentIndex + 1] || null;
  }

  /* Interactive Sub-step Sequencing for complex slides */
  handleSlideStepForward(index) {
    // Slide 2: 3 points sequence
    if (index === 1) {
      const cards = document.querySelectorAll('#slide-2 .slide2-card');
      const conclusion = document.querySelector('#slide-2 .slide2-conclusion');
      const questionsBg = document.querySelector('#slide-2 .slide2-bg-questions');

      if (this.slideStep < 3) {
        if (cards[this.slideStep]) {
          cards[this.slideStep].classList.add('revealed');
        }
        this.slideStep++;
        return true;
      } else if (this.slideStep === 3) {
        if (conclusion) conclusion.classList.add('revealed');
        if (questionsBg) questionsBg.classList.add('fade-out');
        this.slideStep++;
        return true;
      }
      return false;
    }

    // Slide 3: Strike-through sequence
    if (index === 2) {
      const strikes = document.querySelectorAll('#slide-3 .slide3-strike-item');
      const question = document.querySelector('#slide-3 .slide3-big-question');
      const tags = document.querySelectorAll('#slide-3 .slide3-tag');

      if (this.slideStep < 3) {
        if (strikes[this.slideStep]) {
          strikes[this.slideStep].classList.add('strike-active', 'struck');
        }
        this.slideStep++;
        return true;
      } else if (this.slideStep === 3) {
        if (question) question.classList.add('zoomed');
        tags.forEach((tag, i) => {
          setTimeout(() => tag.classList.add('visible'), i * 80);
        });
        this.slideStep++;
        return true;
      }
      return false;
    }

    // Slide 5: WOW MOMENT Split Reveal
    if (index === 4) {
      const mriSide = document.querySelector('#slide-5 .slide5-mri-side');
      const humanSide = document.querySelector('#slide-5 .slide5-human-side');
      const chips = document.querySelectorAll('#slide-5 .slide5-human-chip');
      const climax = document.querySelector('#slide-5 .slide5-climax-statement');

      if (this.slideStep === 0) {
        if (mriSide) mriSide.classList.add('split-active');
        if (humanSide) humanSide.classList.add('split-active');
        chips.forEach((chip, i) => {
          setTimeout(() => chip.classList.add('revealed'), i * 160);
        });
        this.slideStep++;
        return true;
      } else if (this.slideStep === 1) {
        if (climax) climax.classList.add('revealed');
        this.slideStep++;
        return true;
      }
      return false;
    }

    // Slide 12: Roadmap Step 4 triggers laptop browser reveal
    if (index === 11) {
      const steps = document.querySelectorAll('#slide-12 .slide12-roadmap-step');
      const laptop = document.querySelector('#slide-12 .slide12-laptop-mockup-wrapper');

      if (this.slideStep < 3) {
        if (steps[this.slideStep]) {
          steps[this.slideStep].classList.add('active-step');
        }
        this.slideStep++;
        return true;
      } else if (this.slideStep === 3) {
        if (steps[3]) steps[3].classList.add('active-step');
        if (laptop) laptop.classList.add('revealed');
        this.slideStep++;
        return true;
      }
      return false;
    }

    return false;
  }

  handleSlideStepBackward(index) {
    if (this.slideStep <= 0) return;

    if (index === 1) {
      this.slideStep--;
      const cards = document.querySelectorAll('#slide-2 .slide2-card');
      const conclusion = document.querySelector('#slide-2 .slide2-conclusion');
      if (this.slideStep === 3 && conclusion) {
        conclusion.classList.remove('revealed');
      } else if (cards[this.slideStep]) {
        cards[this.slideStep].classList.remove('revealed');
      }
    } else if (index === 2) {
      this.slideStep--;
      const strikes = document.querySelectorAll('#slide-3 .slide3-strike-item');
      if (strikes[this.slideStep]) {
        strikes[this.slideStep].classList.remove('strike-active', 'struck');
      }
    } else {
      this.slideStep--;
    }
  }

  onSlideEnter(index) {
    // Slide 1: Heartbeat sound after opening
    if (index === 0) {
      setTimeout(() => this.audio.playHeartbeat(), 1200);
    }

    // Slide 5: Human revelation heartbeat
    if (index === 4) {
      setTimeout(() => this.audio.playHeartbeat(), 800);
    }

    // Slide 8: Trigger count up for any non-null stat cards
    if (index === 7) {
      const statNums = document.querySelectorAll('#slide-8 .slide8-stat-number');
      statNums.forEach(el => {
        const val = parseInt(el.dataset.val, 10);
        if (!isNaN(val)) {
          window.animateCountUp(el, val, 1800);
        }
      });
    }

    // Slide 13: Reveal words
    if (index === 12) {
      window.revealWordsSequentially('#slide-13 .slide13-vision-text', 130);
    }

    // Slide 14: Montage preview & Finale Chime
    if (index === 13) {
      setTimeout(() => this.audio.playFinaleChime(), 600);
      const montage = document.querySelector('#slide-14 .slide14-montage-container');
      if (montage) {
        montage.classList.add('playing');
      }
    }
  }
}

window.DeckNavigation = DeckNavigation;
