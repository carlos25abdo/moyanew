/**
 * Master Presentation Bootstrapper & Dynamic Data Renderer
 * مبادرة تنفّس وعي | مؤتمر المويا مويا
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Rendering from Config
  renderMoyaInLifeCards();
  renderJourneyMilestones();
  renderImpactStats();
  renderSponsors();
  setupImageFallbacks();

  // 2. Preloader & Intro Sequence
  setupPreloader();
});

function setupPreloader() {
  const preloader = document.getElementById('preloader-screen');
  const statusText = document.getElementById('preloader-status-text');
  const enterBtn = document.getElementById('preloader-enter-btn');
  const enterHint = document.getElementById('preloader-enter-hint');

  if (!preloader) return;

  // Cinematic text stages
  setTimeout(() => {
    if (statusText) statusText.textContent = 'نجهّز الحكاية…';
  }, 400);

  setTimeout(() => {
    if (statusText) {
      statusText.textContent = 'جاهزون.';
      statusText.classList.add('glow-cyan-text');
    }
    if (enterBtn) enterBtn.style.display = 'inline-flex';
    if (enterHint) enterHint.style.display = 'block';
  }, 1400);

  const startPresentation = () => {
    // Request fullscreen automatically on presentation start
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }

    // Vascular burst
    preloader.classList.add('hidden');

    // Initialize Navigation Deck
    window.deckNav = new window.DeckNavigation();

    // Start Conference Ambient Soundscape with user gesture
    if (window.deckNav?.audio) {
      window.deckNav.audio.initContext();
      window.deckNav.audio.startAmbientSoundscape();
    }

    // Trigger Slide 1 entrance
    window.deckNav.goToSlide(0);

    // Remove preloader listeners
    window.removeEventListener('keydown', handlePreloaderKey);
  };

  const handlePreloaderKey = (e) => {
    if (e.code === 'Enter' || e.code === 'Space') {
      e.preventDefault();
      startPresentation();
    }
  };

  if (enterBtn) enterBtn.addEventListener('click', startPresentation);
  window.addEventListener('keydown', handlePreloaderKey);
}

// Render Slide 4 (مويا في الحياة)
function renderMoyaInLifeCards() {
  const container = document.getElementById('slide4-cards-container');
  if (!container || !window.presentationConfig?.moyaInLife) return;

  const items = window.presentationConfig.moyaInLife;
  container.innerHTML = items.map(item => `
    <div class="slide4-card" data-series-id="${item.id}" data-details="${item.details || ''}">
      <img src="${item.image}" alt="${item.title}" class="slide4-card-bg-visual" onerror="this.src='assets/logo-tanaffas-waai.svg'">
      <div class="slide4-card-overlay"></div>
      <div class="slide4-card-content">
        <h3 class="slide4-card-title">${item.title}</h3>
        <p class="slide4-card-desc">${item.desc}</p>
        <span class="slide4-card-explore-hint">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 16 16 12 12 8"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          استكشف الدليل
        </span>
      </div>
    </div>
  `).join('');

  // Add click to preview
  container.querySelectorAll('.slide4-card').forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('.slide4-card-title').textContent;
      const details = card.dataset.details || card.querySelector('.slide4-card-desc').textContent;
      if (window.deckNav?.presenter) {
        window.deckNav.presenter.openLightbox(card.querySelector('img').src, `${title} — ${details}`);
      }
    });
  });
}

// Render Slide 7 (رحلة المبادرة)
function renderJourneyMilestones() {
  const container = document.getElementById('slide7-milestones-row');
  if (!container || !window.presentationConfig?.journey) return;

  const milestones = window.presentationConfig.journey;
  container.innerHTML = milestones.map(m => `
    <div class="slide7-milestone-item">
      <div class="slide7-milestone-card">
        <div class="slide7-milestone-num">محطة ${m.step} ${m.date ? '• ' + m.date : ''}</div>
        <div class="slide7-milestone-title">${m.title}</div>
        <div class="slide7-milestone-desc">${m.desc}</div>
      </div>
      <div class="slide7-milestone-dot"></div>
    </div>
  `).join('');
}

// Render Slide 8 (الأثر بالأرقام)
function renderImpactStats() {
  const container = document.getElementById('slide8-stats-container');
  if (!container) return;

  const impact = window.presentationConfig?.impact || {};
  const metrics = [
    { key: 'volunteers', label: 'عدد المتطوعين' },
    { key: 'cities', label: 'عدد المدن' },
    { key: 'activities', label: 'عدد الأنشطة' },
    { key: 'beneficiaries', label: 'عدد المستفيدين' },
    { key: 'partners', label: 'عدد الشركاء' }
  ];

  // Strictly filter only non-null values
  const activeMetrics = metrics.filter(m => impact[m.key] !== null && impact[m.key] !== undefined);

  if (activeMetrics.length === 0) {
    // Dignified, beautiful fallback with official certification state
    container.innerHTML = `
      <div class="slide8-null-fallback-wrap">
        <div class="slide8-status-pill">
          <span class="slide8-live-dot"></span>
          <span>توثيق ميداني مباشر بالتزامن مع فعاليات المؤتمر</span>
        </div>
        <div class="slide8-preview-grid">
          <div class="slide8-preview-card">
            <div class="slide8-preview-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#18A6B7" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div class="slide8-preview-val">قيد التوثيق</div>
            <div class="slide8-preview-label">شبكة المتطوعين</div>
          </div>
          <div class="slide8-preview-card">
            <div class="slide8-preview-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#148BD1" stroke-width="2"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/></svg>
            </div>
            <div class="slide8-preview-val">امتداد وطني</div>
            <div class="slide8-preview-label">الانتشار الجغرافي</div>
          </div>
          <div class="slide8-preview-card">
            <div class="slide8-preview-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#18A6B7" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <div class="slide8-preview-val">مسارات مستمرة</div>
            <div class="slide8-preview-label">الأنشطة الميدانية</div>
          </div>
          <div class="slide8-preview-card">
            <div class="slide8-preview-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E52532" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </div>
            <div class="slide8-preview-val">أثرٌ ممتد</div>
            <div class="slide8-preview-label">المرضى والأسر</div>
          </div>
        </div>
        <div class="slide8-null-quote">
          «الأرقام الطبية مسؤولية وأمانة… نوثّق كل خطوة بشفافية علمية تليق بالمريض وأسرته.»
        </div>
      </div>
    `;
  } else {
    container.innerHTML = activeMetrics.map(m => `
      <div class="slide8-stat-card">
        <div class="slide8-stat-number" data-val="${impact[m.key]}">0</div>
        <div class="slide8-stat-label">${m.label}</div>
      </div>
    `).join('');
  }
}

// Render Slide 11 (شركاء الأثر)
function renderSponsors() {
  const container = document.getElementById('slide11-sponsors-grid');
  if (!container || !window.presentationConfig?.sponsors) return;

  const sponsors = window.presentationConfig.sponsors;
  container.innerHTML = sponsors.map(s => `
    <div class="slide11-sponsor-card" id="sponsor-${s.id}">
      <div class="slide11-sponsor-logo-box">
        <img src="${s.logo}" alt="${s.name}" onerror="this.src='assets/sponsors/${s.id}.svg'">
      </div>
      <h3 class="slide11-sponsor-name">${s.name}</h3>
      <span class="slide11-sponsor-badge">${s.tag}</span>
    </div>
  `).join('');
}

// Graceful fallback for all images
function setupImageFallbacks() {
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      // If image fails, replace with vector logo fallback or placeholder
      if (!this.dataset.triedFallback) {
        this.dataset.triedFallback = 'true';
        if (this.src.includes('logo')) {
          this.src = 'assets/logo-tanaffas-waai.svg';
        }
      }
    });
  });
}
