/**
 * Presenter Tools & Modes
 * مبادرة تنفّس وعي | مؤتمر المويا مويا
 * Includes: Speaker Notes, Overview Mode, Spotlight, Laser Pointer, Focus Mode, Lightbox
 */

class PresenterManager {
  constructor(deck) {
    this.deck = deck;
    this.timerInterval = null;
    this.timerSeconds = 0;
    this.spotlightActive = false;
    this.laserActive = false;
    this.focusActive = false;

    this.initElements();
    this.initCustomCursor();
    this.initTimer();
  }

  initElements() {
    this.notesPanel = document.getElementById('speaker-notes-panel');
    this.overviewModal = document.getElementById('overview-modal');
    this.spotlightEl = document.getElementById('spotlight-overlay');
    this.laserEl = document.getElementById('laser-pointer');
    this.shortcutsModal = document.getElementById('shortcuts-modal');
    this.lightboxModal = document.getElementById('lightbox-modal');
    this.timerDisplay = document.getElementById('presentation-timer-display');
  }

  initCustomCursor() {
    this.cursorDot = document.getElementById('custom-cursor');
    this.cursorFollower = document.getElementById('custom-cursor-follower');

    if (!this.cursorDot || !this.cursorFollower) return;

    window.addEventListener('mousemove', (e) => {
      const { clientX: x, clientY: y } = e;

      // Update cursor dot
      this.cursorDot.style.left = `${x}px`;
      this.cursorDot.style.top = `${y}px`;

      // Update cursor follower
      this.cursorFollower.style.left = `${x}px`;
      this.cursorFollower.style.top = `${y}px`;

      // Update spotlight CSS vars
      if (this.spotlightActive) {
        document.documentElement.style.setProperty('--mouse-x', `${x}px`);
        document.documentElement.style.setProperty('--mouse-y', `${y}px`);
      }

      // Update laser pointer
      if (this.laserActive) {
        this.laserEl.style.left = `${x}px`;
        this.laserEl.style.top = `${y}px`;
      }
    });

    // Hover effect on interactives
    const interactiveElements = 'button, a, .nav-progress-dot, .slide4-card, .slide6-node, .slide7-milestone-item, .slide9-mosaic-item, .slide11-sponsor-card, .overview-card';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveElements)) {
        this.cursorDot.classList.add('hovering');
        this.cursorFollower.classList.add('hovering');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveElements)) {
        this.cursorDot.classList.remove('hovering');
        this.cursorFollower.classList.remove('hovering');
      }
    });
  }

  initTimer() {
    this.timerSeconds = 0;
    this.timerInterval = setInterval(() => {
      this.timerSeconds++;
      const mins = Math.floor(this.timerSeconds / 60).toString().padStart(2, '0');
      const secs = (this.timerSeconds % 60).toString().padStart(2, '0');
      if (this.timerDisplay) {
        this.timerDisplay.textContent = `${mins}:${secs}`;
      }
    }, 1000);
  }

  // Toggle Speaker Notes Panel (Key 'S')
  toggleSpeakerNotes() {
    if (!this.notesPanel) return;
    this.notesPanel.classList.toggle('active');
    this.updateSpeakerNotes();
  }

  updateSpeakerNotes() {
    if (!this.notesPanel) return;
    const currentSlide = this.deck.getCurrentSlide();
    const notesContent = this.notesPanel.querySelector('.notes-content');
    const nextPreview = this.notesPanel.querySelector('.notes-next-preview');

    if (currentSlide && notesContent) {
      const notes = currentSlide.getAttribute('data-notes') || 'لا توجد ملاحظات مسجلة لهذه السلايد.';
      notesContent.textContent = notes;
    }

    if (nextPreview) {
      const nextSlide = this.deck.getNextSlide();
      if (nextSlide) {
        const nextTitle = nextSlide.querySelector('h1, h2, .slide-title-main, .slide2-main-question')?.textContent || `السلايد ${this.deck.currentIndex + 2}`;
        nextPreview.textContent = `السلايد التالية: ${nextTitle.trim()}`;
      } else {
        nextPreview.textContent = 'نهاية العرض';
      }
    }
  }

  // Toggle Overview Grid Mode (Key 'Esc')
  toggleOverview() {
    if (!this.overviewModal) return;
    const isActive = this.overviewModal.classList.toggle('active');

    if (isActive) {
      this.renderOverviewGrid();
    }
  }

  renderOverviewGrid() {
    const grid = this.overviewModal.querySelector('.overview-grid');
    if (!grid) return;
    grid.innerHTML = '';

    this.deck.slides.forEach((slide, index) => {
      const card = document.createElement('div');
      card.className = `overview-card ${index === this.deck.currentIndex ? 'current' : ''}`;

      const titleEl = slide.querySelector('h1, h2, .slide-title-main, .slide2-main-question');
      const titleText = titleEl ? titleEl.textContent.trim().substring(0, 48) : `سلايد ${index + 1}`;

      card.innerHTML = `
        <div class="overview-card-num">${(index + 1).toString().padStart(2, '0')}</div>
        <div class="overview-card-title">${titleText}</div>
      `;

      card.addEventListener('click', () => {
        this.deck.goToSlide(index);
        this.overviewModal.classList.remove('active');
      });

      grid.appendChild(card);
    });
  }

  // Toggle Spotlight Mode (Key 'L')
  toggleSpotlight() {
    this.spotlightActive = !this.spotlightActive;
    if (this.spotlightEl) {
      this.spotlightEl.classList.toggle('active', this.spotlightActive);
    }
    const btn = document.getElementById('btn-spotlight');
    if (btn) btn.classList.toggle('active', this.spotlightActive);
  }

  // Toggle Laser Pointer (Key 'R')
  toggleLaser() {
    this.laserActive = !this.laserActive;
    if (this.laserEl) {
      this.laserEl.classList.toggle('active', this.laserActive);
    }
    const btn = document.getElementById('btn-laser');
    if (btn) btn.classList.toggle('active', this.laserActive);
  }

  // Toggle Focus Mode (Key '0')
  toggleFocusMode() {
    this.focusActive = !this.focusActive;
    document.body.classList.toggle('focus-mode', this.focusActive);
  }

  // Toggle Shortcuts Help (Key '?' or 'M')
  toggleShortcutsModal() {
    if (this.shortcutsModal) {
      this.shortcutsModal.classList.toggle('active');
    }
  }

  // Lightbox View
  openLightbox(imageSrc, caption = '') {
    if (!this.lightboxModal) return;
    const imgEl = this.lightboxModal.querySelector('img');
    const captionEl = this.lightboxModal.querySelector('.lightbox-caption');

    if (imgEl) imgEl.src = imageSrc;
    if (captionEl) captionEl.textContent = caption;

    this.lightboxModal.classList.add('active');
  }

  closeLightbox() {
    if (this.lightboxModal) {
      this.lightboxModal.classList.remove('active');
    }
  }
}

window.PresenterManager = PresenterManager;
