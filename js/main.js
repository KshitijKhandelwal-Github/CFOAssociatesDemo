/* ============================================================
   CFOAssociates - Main JavaScript
   Handles: Mobile nav, Cookie consent, Testimonial carousel,
   Logo marquee pause, Scroll animations, Smooth scroll
   ============================================================ */

(() => {
  'use strict';

  // ============================================================
  // UTILITY FUNCTIONS
  // ============================================================
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

  const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  };

  const throttle = (fn, limit) => {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        fn(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  // ============================================================
  // MOBILE NAVIGATION
  // ============================================================
  function initMobileNav() {
    const toggle = $('#navToggle');
    const mobileNav = $('#navMobile');
    const overlay = $('#navOverlay');

    if (!toggle || !mobileNav || !overlay) return;

    const openNav = () => {
      toggle.setAttribute('aria-expanded', 'true');
      mobileNav.classList.add('is-open', 'active');
      overlay.classList.add('is-open', 'active');
      document.body.style.overflow = 'hidden';
    };

    const closeNav = () => {
      toggle.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('is-open', 'active');
      overlay.classList.remove('is-open', 'active');
      document.body.style.overflow = '';
    };

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      isOpen ? closeNav() : openNav();
    });

    overlay.addEventListener('click', closeNav);

    // Close on link click
    $$('#navMobile a').forEach(link => {
      link.addEventListener('click', closeNav);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && (mobileNav.classList.contains('is-open') || mobileNav.classList.contains('active'))) {
        closeNav();
        toggle.focus();
      }
    });

    // Handle resize
    window.addEventListener('resize', debounce(() => {
      if (window.innerWidth > 960 && (mobileNav.classList.contains('is-open') || mobileNav.classList.contains('active'))) {
        closeNav();
      }
    }, 250));
  }

  // ============================================================
  // COOKIE CONSENT
  // ============================================================
  function initCookieConsent() {
    const banner = $('#kycBanner');
    const prefs = $('#kycPrefs');
    const acceptBtn = $('#kycAcceptAll');
    const rejectBtn = $('#kycRejectAll');
    const saveBtn = $('#kycSavePrefs');
    const closeBtn = $('#kycClosePrefs');
    const analyticsToggle = $('#kycAnalyticsToggle');
    const marketingToggle = $('#kycMarketingToggle');

    if (!banner || !prefs) return;

    const COOKIE_NAME = 'cfoa_cookie_consent';
    const COOKIE_EXPIRY_DAYS = 365;

    // Check if consent already given
    function getConsent() {
      try {
        const cookie = document.cookie
          .split('; ')
          .find(row => row.startsWith(`${COOKIE_NAME}=`));
        return cookie ? JSON.parse(decodeURIComponent(cookie.split('=')[1])) : null;
      } catch {
        return null;
      }
    }

    function setConsent(consent) {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + COOKIE_EXPIRY_DAYS);
      document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(consent))};expires=${expiry.toUTCString()};path=/;SameSite=Lax`;
    }

    function showBanner() {
      banner.classList.add('show');
    }

    function hideBanner() {
      banner.classList.remove('show');
    }

    function showPrefs() {
      prefs.classList.add('show');
    }

    function hidePrefs() {
      prefs.classList.remove('show');
    }

    function applyConsent(consent) {
      // Apply analytics consent
      if (consent.analytics) {
        analyticsToggle.classList.add('on');
        analyticsToggle.setAttribute('aria-pressed', 'true');
        // Enable analytics (e.g., Google Analytics)
        enableAnalytics();
      } else {
        analyticsToggle.classList.remove('on');
        analyticsToggle.setAttribute('aria-pressed', 'false');
        disableAnalytics();
      }

      // Apply marketing consent
      if (consent.marketing) {
        marketingToggle.classList.add('on');
        marketingToggle.setAttribute('aria-pressed', 'true');
        // Enable marketing cookies
      } else {
        marketingToggle.classList.remove('on');
        marketingToggle.setAttribute('aria-pressed', 'false');
        // Disable marketing cookies
      }
    }

    function enableAnalytics() {
      // Placeholder: Initialize Google Analytics, Plausible, etc.
      console.log('[Cookie Consent] Analytics enabled');
    }

    function disableAnalytics() {
      // Placeholder: Disable analytics
      console.log('[Cookie Consent] Analytics disabled');
    }

    // Load existing consent
    const existingConsent = getConsent();
    if (existingConsent) {
      applyConsent(existingConsent);
    } else {
      // Show banner after a short delay
      setTimeout(showBanner, 1000);
    }

    // Event listeners
    acceptBtn?.addEventListener('click', () => {
      const consent = { necessary: true, analytics: true, marketing: true, timestamp: Date.now() };
      setConsent(consent);
      applyConsent(consent);
      hideBanner();
    });

    rejectBtn?.addEventListener('click', () => {
      const consent = { necessary: true, analytics: false, marketing: false, timestamp: Date.now() };
      setConsent(consent);
      applyConsent(consent);
      hideBanner();
    });

    saveBtn?.addEventListener('click', () => {
      const consent = {
        necessary: true,
        analytics: analyticsToggle.classList.contains('on'),
        marketing: marketingToggle.classList.contains('on'),
        timestamp: Date.now()
      };
      setConsent(consent);
      applyConsent(consent);
      hidePrefs();
    });

    closeBtn?.addEventListener('click', hidePrefs);

    analyticsToggle?.addEventListener('click', () => {
      analyticsToggle.classList.toggle('on');
      analyticsToggle.setAttribute('aria-pressed', analyticsToggle.classList.contains('on'));
    });

    marketingToggle?.addEventListener('click', () => {
      marketingToggle.classList.toggle('on');
      marketingToggle.setAttribute('aria-pressed', marketingToggle.classList.contains('on'));
    });

    // Open preferences from banner link
    $$('.kyc-body a[href*="cookie-policy"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        hideBanner();
        showPrefs();
      });
    });
  }

  // ============================================================
  // TESTIMONIAL CAROUSEL
  // ============================================================
  function initTestimonialCarousel() {
    const cardsContainer = $('#coCards');
    const prevBtn = $('#coPrev');
    const nextBtn = $('#coNext');
    const dots = $$('#coDots .co-dot');

    if (!cardsContainer || !prevBtn || !nextBtn) return;

    const cards = $$('.co-card', cardsContainer);
    const cardCount = cards.length;
    let currentIndex = 0;
    let cardsPerView = 1;

    function updateCardsPerView() {
      if (window.innerWidth >= 768) {
        cardsPerView = 2;
      } else {
        cardsPerView = 1;
      }
    }

    function getMaxIndex() {
      return Math.max(0, cardCount - cardsPerView);
    }

    function updateCarousel() {
      const maxIndex = getMaxIndex();
      currentIndex = Math.min(currentIndex, maxIndex);

      const cardWidth = cards[0]?.offsetWidth || 0;
      const gap = 24; // CSS gap
      const offset = -(currentIndex * (cardWidth + gap));
      cardsContainer.style.transform = `translateX(${offset}px)`;

      // Update buttons
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= maxIndex;

      // Update dots
      dots.forEach((dot, i) => {
        const isActive = i === currentIndex;
        dot.classList.toggle('co-dot-active', isActive);
        dot.setAttribute('aria-selected', isActive);
      });
    }

    window.coNav = (direction) => {
      const maxIndex = getMaxIndex();
      currentIndex = Math.max(0, Math.min(maxIndex, currentIndex + direction));
      updateCarousel();
    };

    window.coGo = (index) => {
      const maxIndex = getMaxIndex();
      currentIndex = Math.max(0, Math.min(maxIndex, index));
      updateCarousel();
    };

    // Initialize
    updateCardsPerView();
    updateCarousel();

    // Handle resize
    window.addEventListener('resize', debounce(() => {
      updateCardsPerView();
      updateCarousel();
    }, 250));

    // Keyboard navigation
    cardsContainer.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        window.coNav(-1);
      } else if (e.key === 'ArrowRight') {
        window.coNav(1);
      }
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    cardsContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    cardsContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          window.coNav(1); // Swipe left -> next
        } else {
          window.coNav(-1); // Swipe right -> previous
        }
      }
    }

    // Auto-advance (optional - commented out by default)
    // let autoAdvance = setInterval(() => window.coNav(1), 5000);
    // cardsContainer.addEventListener('mouseenter', () => clearInterval(autoAdvance));
    // cardsContainer.addEventListener('mouseleave', () => autoAdvance = setInterval(() => window.coNav(1), 5000));
  }

  // ============================================================
  // LOGO MARQUEE PAUSE ON HOVER
  // ============================================================
  function initLogoMarquee() {
    const track = $('#logosTrack');
    if (!track) return;

    track.addEventListener('mouseenter', () => {
      track.style.animationPlayState = 'paused';
    });

    track.addEventListener('mouseleave', () => {
      track.style.animationPlayState = 'running';
    });

    // Pause on focus (accessibility)
    track.addEventListener('focusin', () => {
      track.style.animationPlayState = 'paused';
    });

    track.addEventListener('focusout', () => {
      track.style.animationPlayState = 'running';
    });
  }

  // ============================================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================================
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerHeight = 72; // var(--header-h)
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Focus target for accessibility
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  }

  // ============================================================
  // SCROLL ANIMATIONS (Intersection Observer)
  // ============================================================
  function initScrollAnimations() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const animateSelectors = [
      '.problem-callout',
      '.why-card',
      '.icp-card',
      '.team-card',
      '.co-card',
      '.case-card',
      '.service-card',
      '.ab-stat',
      '.ow-card',
      '.car-val-card',
      '.car-role-card',
      '.ins-card',
      '.contact-info-card',
      '.contact-faq-card',
      '.section-header',
      '.final-cta-inner'
    ];

    animateSelectors.forEach(selector => {
      $$(selector).forEach((el, i) => {
        if (!el.hasAttribute('data-animate') && !el.classList.contains('reveal')) {
          el.setAttribute('data-animate', 'fade-up');
          // Stagger grid items gracefully
          el.style.transitionDelay = `${(i % 3) * 90}ms`;
        }
      });
    });

    const animatedElements = $$('[data-animate], .reveal');
    if (!animatedElements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
  }

  // ============================================================
  // ANIMATED NUMBER COUNTERS
  // ============================================================
  function initNumberCounters() {
    const counters = $$('.stat-counter, [data-counter]');
    if (!counters.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      counters.forEach(c => {
        c.textContent = c.getAttribute('data-target') || c.textContent;
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-target') || el.textContent);
          const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
          const duration = 1600;
          const startTime = performance.now();

          function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic formula
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = ease * target;
            el.textContent = current.toFixed(decimals);

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              el.textContent = target.toFixed(decimals);
            }
          }

          requestAnimationFrame(updateCount);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.25 });

    counters.forEach(c => observer.observe(c));
  }

  // ============================================================
  // ACTIVE NAV HIGHLIGHT ON SCROLL
  // ============================================================
  function initActiveNavHighlight() {
    const sections = $$('section[id]');
    const navLinks = $$('.nav-desktop a, .nav-mobile a');

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === `/#${id}` || href === `#${id}` || href === `/${id}/`);
          });
        }
      });
    }, {
      threshold: 0.4,
      rootMargin: '-100px 0px -60% 0px'
    });

    sections.forEach(section => observer.observe(section));
  }

  // ============================================================
  // HEADER SCROLL EFFECT
  // ============================================================
  function initHeaderScrollEffect() {
    const header = $('.site-header');
    if (!header) return;

    const handleScroll = throttle(() => {
      if (window.scrollY > 20) {
        header.style.boxShadow = '0 1px 3px rgba(14,14,14,0.08)';
        header.style.borderBottomColor = 'var(--border)';
      } else {
        header.style.boxShadow = 'none';
        header.style.borderBottomColor = 'var(--border)';
      }
    }, 100);

    window.addEventListener('scroll', handleScroll);
  }

  // ============================================================
  // FORM HANDLING (Contact/Newsletter forms)
  // ============================================================
  function initForms() {
    const forms = $$('form[data-ajax]');
    forms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn?.textContent;
        const formData = new FormData(form);

        try {
          submitBtn && (submitBtn.disabled = true);
          submitBtn && (submitBtn.textContent = 'Sending...');

          const response = await fetch(form.action || '/api/submit', {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json'
            }
          });

          if (response.ok) {
            form.reset();
            showToast('Thank you! We\'ll be in touch soon.', 'success');
          } else {
            throw new Error('Submission failed');
          }
        } catch (error) {
          console.error('Form submission error:', error);
          showToast('Something went wrong. Please try again.', 'error');
        } finally {
          submitBtn && (submitBtn.disabled = false);
          submitBtn && (submitBtn.textContent = originalText);
        }
      });
    });
  }

  // Simple toast notification
  function showToast(message, type = 'info') {
    const existing = document.querySelector('.cfoa-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `cfoa-toast cfoa-toast--${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = message;

    // Styles
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%) translateY(100px)',
      padding: '14px 24px',
      borderRadius: '8px',
      background: type === 'success' ? '#059669' : type === 'error' ? '#DC2626' : '#1E40AF',
      color: '#fff',
      fontSize: '14px',
      fontWeight: '600',
      boxShadow: '0 10px 40px rgba(14,14,14,0.2)',
      zIndex: '10000',
      opacity: '0',
      transition: 'transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 300ms'
    });

    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(-50%) translateY(0)';
      toast.style.opacity = '1';
    });

    // Remove after delay
    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(100px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ============================================================
  // LAZY LOAD IMAGES (Native + fallback)
  // ============================================================
  function initLazyLoad() {
    // Native lazy loading is handled by loading="lazy" attribute
    // This adds fade-in effect when images load
    const lazyImages = $$('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.complete) {
              img.style.opacity = '1';
            } else {
              img.addEventListener('load', () => {
                img.style.opacity = '1';
              }, { once: true });
              img.style.opacity = '0';
              img.style.transition = 'opacity 400ms ease';
            }
            imageObserver.unobserve(img);
          }
        });
      }, { rootMargin: '50px' });

      lazyImages.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for browsers without IntersectionObserver
      lazyImages.forEach(img => img.style.opacity = '1');
    }
  }

  // ============================================================
  // INITIALIZATION
  // ============================================================
  function init() {
    // Core functionality
    initMobileNav();
    initCookieConsent();
    initTestimonialCarousel();
    initLogoMarquee();
    initSmoothScroll();
    initScrollAnimations();
    initNumberCounters();
    initActiveNavHighlight();
    initHeaderScrollEffect();
    initForms();
    initLazyLoad();
    initInteractiveBackgrounds();
    initHeroCanvas();

    console.log('[CFOAssociates] Initialized successfully');
  }

  // ============================================================
  // HERO ANIMATED FINANCIAL GRID & TRAJECTORY PATH
  // ============================================================
  function initHeroCanvas() {
    const canvases = $$('.hero-canvas, #heroCanvas');
    if (!canvases.length) return;

    canvases.forEach(canvas => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const hero = canvas.closest('.hero, .page-hero, .ab-hero, .ow-hero, .wd-opener, .ww-hero, .fit-hero, .contact-hero, .ins-hero, .car-hero') || canvas.parentElement;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      let width = 0;
      let height = 0;
      let animId = null;
      let isVisible = true;
      const mouse = { x: -1000, y: -1000, active: false };

      function resize() {
        const rect = hero ? hero.getBoundingClientRect() : canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = rect.width;
        height = rect.height;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
        ctx.scale(dpr, dpr);
      }
      resize();
      window.addEventListener('resize', resize, { passive: true });

      if (hero) {
        hero.addEventListener('mousemove', (e) => {
          const rect = hero.getBoundingClientRect();
          mouse.x = e.clientX - rect.left;
          mouse.y = e.clientY - rect.top;
          mouse.active = true;
        }, { passive: true });

        hero.addEventListener('mouseleave', () => {
          mouse.active = false;
          mouse.x = -1000;
          mouse.y = -1000;
        }, { passive: true });
      }

      // Detect content theme based on hero class or data-theme
      const theme = canvas.getAttribute('data-theme') || (
        hero.classList.contains('ab-hero') ? 'pillars' :
        hero.classList.contains('wd-opener') ? 'steps' :
        hero.classList.contains('ww-hero') ? 'brackets' :
        hero.classList.contains('ow-hero') ? 'outcomes' :
        hero.classList.contains('fit-hero') ? 'matrix' :
        hero.classList.contains('ins-hero') ? 'frameworks' :
        hero.classList.contains('car-hero') ? 'network' :
        hero.classList.contains('contact-hero') ? 'direct' :
        hero.classList.contains('page-hero') ? 'shield' : 'growth'
      );

      const startTime = performance.now();

      function render() {
        if (!isVisible) return;

        ctx.clearRect(0, 0, width, height);

        const elapsed = (performance.now() - startTime) / 1000;
        const entranceRaw = Math.min(1, elapsed / 2.0);
        const entrance = prefersReducedMotion ? 1 : (1 - Math.pow(1 - entranceRaw, 3));

        // 1. Subtle Institutional Financial Grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
        ctx.lineWidth = 1;
        const hSteps = 5;
        for (let i = 1; i < hSteps; i++) {
          const y = (height / hSteps) * i;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
        const vSteps = 8;
        for (let i = 1; i < vSteps; i++) {
          const x = (width / vSteps) * i;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }

        // ========================================================
        // THEME 1: GROWTH (Home Page — Ascending Growth Polyline)
        // ========================================================
        if (theme === 'growth') {
          const milestoneCount = 14;
          function getMilestoneY(i, h) {
            const p = i / milestoneCount;
            const baseY = h * 0.78 - p * (h * 0.58);
            const fiscalPattern = Math.sin(i * 1.85) * 16 - Math.cos(i * 0.95) * 12;
            return Math.max(h * 0.12, Math.min(h * 0.9, baseY + fiscalPattern));
          }
          function getLinearY(x, w, h) {
            const p = Math.max(0, Math.min(1, x / w));
            const u = p * milestoneCount;
            const k = Math.min(Math.floor(u), milestoneCount - 1);
            const f = u - k;
            return getMilestoneY(k, h) + f * (getMilestoneY(k + 1, h) - getMilestoneY(k, h));
          }

          const maxX = entrance * width;
          if (maxX > 0) {
            // Area fill
            const areaGradient = ctx.createLinearGradient(0, height * 0.15, 0, height);
            areaGradient.addColorStop(0, 'rgba(37, 99, 235, 0.22)');
            areaGradient.addColorStop(0.5, 'rgba(29, 78, 216, 0.08)');
            areaGradient.addColorStop(1, 'rgba(11, 15, 25, 0)');

            ctx.beginPath();
            ctx.moveTo(0, height);
            ctx.lineTo(0, getLinearY(0, width, height));
            for (let i = 1; i <= milestoneCount; i++) {
              const mx = (width / milestoneCount) * i;
              if (mx < maxX) ctx.lineTo(mx, getMilestoneY(i, height));
              else break;
            }
            ctx.lineTo(maxX, getLinearY(maxX, width, height));
            ctx.lineTo(maxX, height);
            ctx.closePath();
            ctx.fillStyle = areaGradient;
            ctx.fill();

            // Benchmark line
            ctx.beginPath();
            ctx.setLineDash([4, 6]);
            ctx.moveTo(0, getLinearY(0, width, height) - 28);
            for (let i = 1; i <= milestoneCount; i++) {
              const mx = (width / milestoneCount) * i;
              if (mx < maxX) ctx.lineTo(mx, getMilestoneY(i, height) - 28);
              else break;
            }
            ctx.lineTo(maxX, getLinearY(maxX, width, height) - 28);
            ctx.strokeStyle = 'rgba(96, 165, 250, 0.30)';
            ctx.lineWidth = 1.2;
            ctx.stroke();
            ctx.setLineDash([]);

            // Primary line
            ctx.beginPath();
            ctx.moveTo(0, getLinearY(0, width, height));
            for (let i = 1; i <= milestoneCount; i++) {
              const mx = (width / milestoneCount) * i;
              if (mx < maxX) ctx.lineTo(mx, getMilestoneY(i, height));
              else break;
            }
            ctx.lineTo(maxX, getLinearY(maxX, width, height));
            ctx.strokeStyle = 'rgba(96, 165, 250, 0.85)';
            ctx.lineWidth = 2.4;
            ctx.shadowColor = 'rgba(37, 99, 235, 0.85)';
            ctx.shadowBlur = 12;
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Milestone vertices
            for (let i = 0; i <= milestoneCount; i++) {
              const mx = (width / milestoneCount) * i;
              if (mx <= maxX) {
                const my = getMilestoneY(i, height);
                ctx.beginPath();
                ctx.arc(mx, my, 4, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(37, 99, 235, 0.5)';
                ctx.fill();
                ctx.beginPath();
                ctx.arc(mx, my, 2.2, 0, Math.PI * 2);
                ctx.fillStyle = '#FFFFFF';
                ctx.fill();
              }
            }
          }

          // Active tracer
          if (entrance >= 1 && !prefersReducedMotion) {
            const loopDuration = 3.6;
            const cycle = ((elapsed - 2.0) % loopDuration) / loopDuration;
            const beamLen = Math.max(120, width * 0.18);
            const headX = cycle * (width + beamLen * 1.5) - beamLen * 0.5;
            const tailX = headX - beamLen;
            const cTail = Math.max(0, tailX);
            const cHead = Math.min(width, headX);

            if (cHead > cTail) {
              const tGrad = ctx.createLinearGradient(cTail, 0, cHead, 0);
              tGrad.addColorStop(0, 'rgba(96, 165, 250, 0)');
              tGrad.addColorStop(0.7, 'rgba(96, 165, 250, 0.8)');
              tGrad.addColorStop(1, '#FFFFFF');

              ctx.beginPath();
              ctx.moveTo(cTail, getLinearY(cTail, width, height));
              for (let i = 1; i <= milestoneCount; i++) {
                const mx = (width / milestoneCount) * i;
                if (mx > cTail && mx < cHead) ctx.lineTo(mx, getMilestoneY(i, height));
              }
              ctx.lineTo(cHead, getLinearY(cHead, width, height));
              ctx.strokeStyle = tGrad;
              ctx.lineWidth = 3.2;
              ctx.shadowColor = '#60A5FA';
              ctx.shadowBlur = 14;
              ctx.stroke();
              ctx.shadowBlur = 0;
            }

            // Radar pulse at peak
            const peakY = getMilestoneY(milestoneCount, height);
            const rad = 4 + ((elapsed * 12) % 20);
            ctx.beginPath();
            ctx.arc(width, peakY, rad, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(96, 165, 250, ${(1 - (rad - 4) / 20) * 0.75})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }

          // Crosshairs
          if (mouse.active && mouse.x >= 0 && mouse.x <= width) {
            const ty = getLinearY(mouse.x, width, height);
            ctx.beginPath();
            ctx.setLineDash([3, 4]);
            ctx.moveTo(mouse.x, 0);
            ctx.lineTo(mouse.x, height);
            ctx.strokeStyle = 'rgba(96, 165, 250, 0.3)';
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.arc(mouse.x, ty, 5.5, 0, Math.PI * 2);
            ctx.fillStyle = '#60A5FA';
            ctx.shadowColor = '#3B82F6';
            ctx.shadowBlur = 12;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }

        // ========================================================
        // THEME 2: PILLARS (About — 4 Institutional Capital Pillars)
        // ========================================================
        else if (theme === 'pillars') {
          const pillarX = [0.20, 0.42, 0.64, 0.86];
          const pillarH = [0.38, 0.28, 0.34, 0.24]; // summit Y ratio
          const baseLineY = height * 0.86;

          // Foundation baseline
          ctx.beginPath();
          ctx.moveTo(0, baseLineY);
          ctx.lineTo(width * entrance, baseLineY);
          ctx.strokeStyle = 'rgba(96, 165, 250, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // 4 Vertical Pillars
          const colWidth = Math.min(48, width * 0.05);
          const summits = [];

          pillarX.forEach((pxRatio, idx) => {
            const cx = width * pxRatio;
            const targetY = height * pillarH[idx];
            const currentY = baseLineY - (baseLineY - targetY) * entrance;
            summits.push({ x: cx, y: currentY });

            // Pillar column area fill
            const colGrad = ctx.createLinearGradient(0, currentY, 0, baseLineY);
            colGrad.addColorStop(0, 'rgba(37, 99, 235, 0.18)');
            colGrad.addColorStop(1, 'rgba(11, 15, 25, 0.02)');
            ctx.fillStyle = colGrad;
            ctx.fillRect(cx - colWidth / 2, currentY, colWidth, baseLineY - currentY);

            // Pillar column vertical rails
            ctx.beginPath();
            ctx.moveTo(cx - colWidth / 2, baseLineY);
            ctx.lineTo(cx - colWidth / 2, currentY);
            ctx.moveTo(cx + colWidth / 2, baseLineY);
            ctx.lineTo(cx + colWidth / 2, currentY);
            ctx.strokeStyle = 'rgba(96, 165, 250, 0.35)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Pillar summit cross-bracket
            ctx.beginPath();
            ctx.moveTo(cx - colWidth / 2 - 6, currentY);
            ctx.lineTo(cx + colWidth / 2 + 6, currentY);
            ctx.strokeStyle = 'rgba(96, 165, 250, 0.85)';
            ctx.lineWidth = 2.4;
            ctx.stroke();

            // Summit beacon dot
            ctx.beginPath();
            ctx.arc(cx, currentY - 5, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.shadowColor = '#60A5FA';
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
          });

          // Capital arch connecting summits
          if (summits.length > 1) {
            ctx.beginPath();
            ctx.setLineDash([4, 6]);
            ctx.moveTo(summits[0].x, summits[0].y);
            for (let i = 1; i < summits.length; i++) {
              ctx.lineTo(summits[i].x, summits[i].y);
            }
            ctx.strokeStyle = 'rgba(96, 165, 250, 0.35)';
            ctx.lineWidth = 1.2;
            ctx.stroke();
            ctx.setLineDash([]);
          }

          // Interactive hover highlight on nearest pillar
          if (mouse.active && mouse.x >= 0 && mouse.x <= width) {
            let closest = summits[0];
            let minDist = Math.abs(mouse.x - closest.x);
            summits.forEach(s => {
              const d = Math.abs(mouse.x - s.x);
              if (d < minDist) { minDist = d; closest = s; }
            });

            ctx.beginPath();
            ctx.arc(closest.x, closest.y - 5, 8, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(96, 165, 250, 0.8)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }

        // ========================================================
        // THEME: STEPS / WHAT WE DO — 5 Increasing Bar Chart Steps with Jumping Ball
        // ========================================================
        else if (theme === 'steps' || theme === 'pathways') {
          const stepCount = 5;
          const baseY = height; // Anchored directly to the bottom of the hero section
          const maxBarH = Math.min(height * 0.70, 460);
          const stepRatios = [0.22, 0.40, 0.58, 0.76, 0.94]; // 5 increasing bar chart steps

          // Calculate bar positions and widths
          const paddingX = Math.max(width * 0.05, 28);
          const totalUsableWidth = width - 2 * paddingX;
          const stepWidth = Math.min(Math.max(54, width * 0.12), 108);
          const stepGap = (totalUsableWidth - stepCount * stepWidth) / (stepCount - 1);

          const steps = [];
          for (let i = 0; i < stepCount; i++) {
            const x = paddingX + i * (stepWidth + stepGap) + stepWidth / 2;
            const targetH = maxBarH * stepRatios[i];
            const currentH = targetH * entrance;
            const y = baseY - currentH;
            steps.push({
              index: i,
              x,
              y,
              height: currentH,
              targetY: baseY - targetH,
              width: stepWidth,
              left: x - stepWidth / 2,
              right: x + stepWidth / 2
            });
          }

          // 1. Draw Baseline at Bottom
          ctx.beginPath();
          ctx.moveTo(0, baseY);
          ctx.lineTo(width, baseY);
          ctx.strokeStyle = 'rgba(203, 213, 225, 0.85)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // 2. Draw 5 Increasing Bar Chart Columns
          steps.forEach((step, idx) => {
            // Column body gradient fill (high-contrast for pure white background)
            const barGrad = ctx.createLinearGradient(0, step.y, 0, baseY);
            barGrad.addColorStop(0, 'rgba(29, 78, 216, 0.22)');
            barGrad.addColorStop(0.4, 'rgba(37, 99, 235, 0.12)');
            barGrad.addColorStop(1, 'rgba(219, 234, 254, 0.03)');
            ctx.fillStyle = barGrad;
            ctx.fillRect(step.left, step.y, step.width, step.height);

            // Vertical side outlines
            ctx.beginPath();
            ctx.moveTo(step.left, baseY);
            ctx.lineTo(step.left, step.y);
            ctx.moveTo(step.right, baseY);
            ctx.lineTo(step.right, step.y);
            ctx.strokeStyle = 'rgba(29, 78, 216, 0.45)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Top landing surface shelf (where ball lands)
            ctx.beginPath();
            ctx.moveTo(step.left - 5, step.y);
            ctx.lineTo(step.right + 5, step.y);
            ctx.strokeStyle = 'rgba(29, 78, 216, 0.95)';
            ctx.lineWidth = 3;
            ctx.shadowColor = 'rgba(29, 78, 216, 0.35)';
            ctx.shadowBlur = 8;
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Step number watermark (01, 02, 03, 04, 05)
            ctx.fillStyle = 'rgba(29, 78, 216, 0.30)';
            ctx.font = '700 13px system-ui, -apple-system, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(`0${idx + 1}`, step.x, baseY - 16);
          });

          // 3. Draw Dashed Parabolic Lines for the Path of the Ball
          const jumpApex = Math.max(38, height * 0.11);
          ctx.beginPath();
          ctx.setLineDash([6, 6]);
          ctx.strokeStyle = 'rgba(29, 78, 216, 0.75)';
          ctx.lineWidth = 2.2;

          for (let j = 0; j < stepCount - 1; j++) {
            const s1 = steps[j];
            const s2 = steps[j + 1];
            ctx.moveTo(s1.x, s1.y);

            // Curve through parabolic arc
            const segments = 24;
            for (let k = 1; k <= segments; k++) {
              const u = k / segments;
              const px = s1.x + u * (s2.x - s1.x);
              const chordY = s1.y + u * (s2.y - s1.y);
              const py = chordY - 4 * jumpApex * u * (1 - u);
              ctx.lineTo(px, py);
            }
          }
          ctx.stroke();
          ctx.setLineDash([]); // reset dash

          // 4. Animated Ball Jumping Along the Steps (No reverse animation)
          if (entrance >= 1 && !prefersReducedMotion) {
            const jumpDuration = 0.65; // seconds per jump
            const totalJumps = stepCount - 1; // 4 jumps
            const totalJumpTime = totalJumps * jumpDuration; // 2.6s
            const pauseAtPeak = 0.85; // seconds resting at peak step
            const cycleDuration = totalJumpTime + pauseAtPeak;

            const timeInCycle = (elapsed % cycleDuration);

            let ballX = steps[0].x;
            let ballY = steps[0].y;
            let ballAlpha = 1.0;
            const ballRadius = 8;
            let currentLandingStep = -1;

            if (timeInCycle < totalJumpTime) {
              // Active jumping between steps (only moves forward)
              const currentJump = Math.floor(timeInCycle / jumpDuration);
              const jumpProgress = (timeInCycle % jumpDuration) / jumpDuration;

              const s1 = steps[currentJump];
              const s2 = steps[currentJump + 1];

              ballX = s1.x + jumpProgress * (s2.x - s1.x);
              const chordY = s1.y + jumpProgress * (s2.y - s1.y);
              ballY = chordY - 4 * jumpApex * jumpProgress * (1 - jumpProgress);
              
              // Gentle fade-in at the very start of the cycle on Step 0
              ballAlpha = timeInCycle < 0.15 ? timeInCycle / 0.15 : 1.0;

              // Landing impact trigger near contact
              if (jumpProgress < 0.12) currentLandingStep = currentJump;
              else if (jumpProgress > 0.88) currentLandingStep = currentJump + 1;
            } else {
              // Ball rests at the top of Step 5 (highest step) with celebratory rings
              const peakStep = steps[stepCount - 1];
              ballX = peakStep.x;
              ballY = peakStep.y;
              currentLandingStep = stepCount - 1;

              const peakT = timeInCycle - totalJumpTime;

              // Soft dissolve at end of peak pause before next cycle starts at Step 0
              if (peakT < 0.55) {
                ballAlpha = 1.0;
              } else {
                ballAlpha = Math.max(0, 1.0 - (peakT - 0.55) / (pauseAtPeak - 0.55));
              }

              // Breakout celebration rings expanding from peak
              const rRadius = 8 + peakT * 36;
              const rAlpha = Math.max(0, 1 - peakT / pauseAtPeak);
              ctx.beginPath();
              ctx.arc(peakStep.x, peakStep.y - 8, rRadius, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(29, 78, 216, ${rAlpha * 0.75})`;
              ctx.lineWidth = 2;
              ctx.stroke();
            }

            // Draw Landing Surface Contact Pulse
            if (currentLandingStep >= 0 && currentLandingStep < stepCount) {
              const ls = steps[currentLandingStep];
              ctx.beginPath();
              ctx.ellipse(ls.x, ls.y, 20, 6, 0, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(29, 78, 216, ${0.28 * ballAlpha})`;
              ctx.fill();
            }

            // Draw Ball Shadow / Ground Reflection
            ctx.beginPath();
            ctx.ellipse(ballX, baseY - 2, 10, 3, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(15, 23, 42, ${0.12 * ballAlpha})`;
            ctx.fill();

            // Draw Jumping Ball (Solid circle with smooth alpha)
            ctx.beginPath();
            ctx.arc(ballX, ballY - ballRadius, ballRadius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(29, 78, 216, ${ballAlpha})`;
            ctx.fill();
          }

          // Interactive crosshair on hover
          if (mouse.active && mouse.x >= 0 && mouse.x <= width) {
            let closestStep = steps[0];
            let minDist = Math.abs(mouse.x - steps[0].x);
            steps.forEach(s => {
              const d = Math.abs(mouse.x - s.x);
              if (d < minDist) { minDist = d; closestStep = s; }
            });
            ctx.beginPath();
            ctx.rect(closestStep.left, closestStep.y, closestStep.width, closestStep.height);
            ctx.strokeStyle = 'rgba(29, 78, 216, 0.65)';
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }

        // ========================================================
        // THEME 4: BRACKETS (Who We Work With — $2M-$50M Revenue Corridor at Bottom)
        // ========================================================
        else if (theme === 'brackets') {
          const baseY = height - 14; // Base line anchored near the bottom
          const paddingX = Math.max(width * 0.05, 24);

          // Center corridor to match max-width 1100px of .ww-hero-inner
          const maxInnerW = 1100;
          const innerW = Math.min(width - 2 * paddingX, maxInnerW);
          const x1 = (width - innerW) / 2; // Left bracket ($2M threshold)
          const x2 = x1 + innerW;          // Right bracket ($50M threshold)
          const corridorW = x2 - x1;

          // Confine height to bottom ~420px (double the previous height)
          const corridorH = Math.min(420, height * 0.55) * entrance;
          const topY = baseY - corridorH;

          // 4 milestone points along the corridor
          const xm1 = x1 + 16;
          const xm2 = x1 + corridorW * 0.30;
          const xm3 = x1 + corridorW * 0.68;
          const xm4 = x2 - 16;

          // Trajectory Y heights
          const ym1 = baseY - corridorH * 0.22;
          const ym2 = baseY - corridorH * 0.48;
          const ym3 = baseY - corridorH * 0.72;
          const ym4 = baseY - corridorH * 0.90;

          // 1. Draw Baseline
          ctx.beginPath();
          ctx.moveTo(0, baseY);
          ctx.lineTo(width, baseY);
          ctx.strokeStyle = 'rgba(203, 213, 225, 0.85)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // 2. Out-of-Scope Exclusion Zone Hints
          ctx.fillStyle = 'rgba(100, 116, 139, 0.35)';
          ctx.font = '700 10px system-ui, -apple-system, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          if (x1 > 120) {
            ctx.fillText('<$2M PRE-REVENUE (OUT OF SCOPE)', x1 / 2, baseY - 8);
          }
          if (width - x2 > 120) {
            ctx.fillText('>$50M CONGLOMERATES (OUT OF SCOPE)', x2 + (width - x2) / 2, baseY - 8);
          }

          // 3. Highlighted Operational Sweet Spot Corridor ($2M to $50M)
          const corridorGrad = ctx.createLinearGradient(0, topY, 0, baseY);
          corridorGrad.addColorStop(0, 'rgba(29, 78, 216, 0.12)');
          corridorGrad.addColorStop(0.5, 'rgba(37, 99, 235, 0.05)');
          corridorGrad.addColorStop(1, 'rgba(219, 234, 254, 0.02)');
          ctx.fillStyle = corridorGrad;
          ctx.fillRect(x1, topY, corridorW, corridorH);

          // Interior milestone vertical dashed grid lines
          ctx.beginPath();
          ctx.setLineDash([4, 6]);
          ctx.strokeStyle = 'rgba(29, 78, 216, 0.20)';
          ctx.lineWidth = 1.2;
          ctx.moveTo(xm2, baseY); ctx.lineTo(xm2, topY + 8);
          ctx.moveTo(xm3, baseY); ctx.lineTo(xm3, topY + 8);
          ctx.stroke();
          ctx.setLineDash([]);

          // 4. Bounding Brackets [ $2M to $50M ]
          // Left Bracket: $2M Threshold
          ctx.beginPath();
          ctx.moveTo(x1 + 18, topY);
          ctx.lineTo(x1, topY);
          ctx.lineTo(x1, baseY);
          ctx.strokeStyle = 'rgba(29, 78, 216, 0.90)';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Right Bracket: $50M Threshold
          ctx.beginPath();
          ctx.moveTo(x2 - 18, topY);
          ctx.lineTo(x2, topY);
          ctx.lineTo(x2, baseY);
          ctx.strokeStyle = 'rgba(29, 78, 216, 0.90)';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Pill Labels on Brackets
          // Left Pill: $2M ENTRY
          ctx.fillStyle = 'rgba(29, 78, 216, 0.95)';
          ctx.beginPath();
          ctx.roundRect(x1 - 32, topY - 24, 68, 18, 4);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '700 9px system-ui, -apple-system, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('$2M ENTRY', x1 + 2, topY - 15);

          // Right Pill: $50M MAX
          ctx.fillStyle = 'rgba(29, 78, 216, 0.95)';
          ctx.beginPath();
          ctx.roundRect(x2 - 36, topY - 24, 68, 18, 4);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '700 9px system-ui, -apple-system, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('$50M CEILING', x2 - 2, topY - 15);

          // Corridor Center Watermark
          ctx.fillStyle = 'rgba(29, 78, 216, 0.38)';
          ctx.font = '800 11px system-ui, -apple-system, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText('OPERATIONAL SWEET SPOT ($2M - $50M REVENUE)', (x1 + x2) / 2, baseY - 8);

          // 5. Dynamic Growth Trajectory Curve through Corridor
          ctx.beginPath();
          ctx.moveTo(xm1, ym1);
          ctx.bezierCurveTo(
            xm1 + (xm2 - xm1) * 0.5, ym1,
            xm2 - (xm2 - xm1) * 0.5, ym2,
            xm2, ym2
          );
          ctx.bezierCurveTo(
            xm2 + (xm3 - xm2) * 0.5, ym2,
            xm3 - (xm3 - xm2) * 0.5, ym3,
            xm3, ym3
          );
          ctx.bezierCurveTo(
            xm3 + (xm4 - xm3) * 0.5, ym3,
            xm4 - (xm4 - xm3) * 0.5, ym4,
            xm4, ym4
          );
          ctx.strokeStyle = 'rgba(29, 78, 216, 0.70)';
          ctx.lineWidth = 2.2;
          ctx.stroke();

          // Milestone Points along the Curve
          const milestones = [
            { x: xm1, y: ym1, label: '$2M ARR' },
            { x: xm2, y: ym2, label: '$10M ARR' },
            { x: xm3, y: ym3, label: '$25M REV' },
            { x: xm4, y: ym4, label: '$50M VAL' }
          ];

          milestones.forEach((m, idx) => {
            // Milestone node
            ctx.beginPath();
            ctx.arc(m.x, m.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#1D4ED8';
            ctx.fill();
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Label text above node
            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            ctx.font = '700 10px system-ui, -apple-system, sans-serif';
            ctx.textAlign = idx === 0 ? 'left' : (idx === 3 ? 'right' : 'center');
            ctx.textBaseline = 'bottom';
            ctx.fillText(m.label, m.x + (idx === 0 ? 8 : (idx === 3 ? -8 : 0)), m.y - 7);
          });

          // 6. Interactive Crosshair & Curve Intersection Dot on Hover
          if (mouse.active && mouse.x >= x1 && mouse.x <= x2) {
            // Calculate exact Y intersection on the cubic bezier graph curve at mouse.x
            let curveY = ym1;
            const curX = Math.max(xm1, Math.min(mouse.x, xm4));
            if (curX <= xm1) {
              curveY = ym1;
            } else if (curX >= xm4) {
              curveY = ym4;
            } else if (curX < xm2) {
              const u = (curX - xm1) / (xm2 - xm1);
              const easeU = u * u * (3 - 2 * u);
              curveY = ym1 + easeU * (ym2 - ym1);
            } else if (curX < xm3) {
              const u = (curX - xm2) / (xm3 - xm2);
              const easeU = u * u * (3 - 2 * u);
              curveY = ym2 + easeU * (ym3 - ym2);
            } else {
              const u = (curX - xm3) / (xm4 - xm3);
              const easeU = u * u * (3 - 2 * u);
              curveY = ym3 + easeU * (ym4 - ym3);
            }

            // Vertical hairline tracking line from baseY up to topY
            ctx.beginPath();
            ctx.moveTo(mouse.x, baseY);
            ctx.lineTo(mouse.x, topY);
            ctx.strokeStyle = 'rgba(29, 78, 216, 0.45)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Horizontal tangent guide line across from left bracket to the dot (subtle blueprint detail)
            ctx.beginPath();
            ctx.setLineDash([3, 5]);
            ctx.moveTo(x1, curveY);
            ctx.lineTo(mouse.x, curveY);
            ctx.strokeStyle = 'rgba(29, 78, 216, 0.25)';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.setLineDash([]);

            // Dot at the exact intersection of the graph and the vertical line
            // Outer glowing ambient ring
            ctx.beginPath();
            ctx.arc(mouse.x, curveY, 12, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(29, 78, 216, 0.20)';
            ctx.fill();

            // Solid sapphire circle at the intersection
            ctx.beginPath();
            ctx.arc(mouse.x, curveY, 7, 0, Math.PI * 2);
            ctx.fillStyle = '#1D4ED8';
            ctx.fill();

            // Crisp white rim
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2.5;
            ctx.stroke();

            // Inner specular highlight
            ctx.beginPath();
            ctx.arc(mouse.x - 2, curveY - 2, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();

            // Calculate revenue readout badge
            const revEst = Math.round(2 + ((mouse.x - x1) / corridorW) * 48);
            const statusText = `$${revEst}M REVENUE · INSIDE SWEET SPOT`;

            ctx.font = '700 10px system-ui, -apple-system, sans-serif';
            const badgeW = ctx.measureText(statusText).width + 16;
            const badgeX = Math.min(Math.max(mouse.x - badgeW / 2, x1), x2 - badgeW);
            const badgeY = topY - 24;

            ctx.fillStyle = '#1D4ED8';
            ctx.beginPath();
            ctx.roundRect(badgeX, badgeY, badgeW, 20, 3);
            ctx.fill();

            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(statusText, badgeX + badgeW / 2, badgeY + 10);
          }
        }

        // ========================================================
        // THEME 5: OUTCOMES (Our Work — Variance Delta Bars)
        // ========================================================
        else if (theme === 'outcomes') {
          const baseY = height * 0.82;
          const barCount = 7;
          const barRatios = [0.42, 0.65, 0.35, 0.78, 0.52, 0.88, 0.60];
          const barWidth = Math.min(32, width * 0.045);
          const stepX = (width * 0.78) / (barCount - 1);
          const startX = width * 0.12;
          const summits = [];

          // Baseline
          ctx.beginPath();
          ctx.moveTo(0, baseY);
          ctx.lineTo(width * entrance, baseY);
          ctx.strokeStyle = 'rgba(96, 165, 250, 0.35)';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          for (let i = 0; i < barCount; i++) {
            const bx = startX + i * stepX;
            const targetH = height * barRatios[i] * 0.72;
            const currentH = targetH * entrance;
            const by = baseY - currentH;
            summits.push({ x: bx, y: by });

            // Bar column gradient
            const bGrad = ctx.createLinearGradient(0, by, 0, baseY);
            bGrad.addColorStop(0, 'rgba(37, 99, 235, 0.28)');
            bGrad.addColorStop(1, 'rgba(11, 15, 25, 0.02)');
            ctx.fillStyle = bGrad;
            ctx.fillRect(bx - barWidth / 2, by, barWidth, currentH);

            // Bar outline
            ctx.beginPath();
            ctx.moveTo(bx - barWidth / 2, baseY);
            ctx.lineTo(bx - barWidth / 2, by);
            ctx.lineTo(bx + barWidth / 2, by);
            ctx.lineTo(bx + barWidth / 2, baseY);
            ctx.strokeStyle = 'rgba(96, 165, 250, 0.55)';
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // Crown vertex dot
            ctx.beginPath();
            ctx.arc(bx, by, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.shadowColor = '#60A5FA';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
          }

          // Connecting trend benchmark line
          ctx.beginPath();
          ctx.setLineDash([4, 6]);
          ctx.moveTo(summits[0].x, summits[0].y);
          for (let i = 1; i < summits.length; i++) ctx.lineTo(summits[i].x, summits[i].y);
          ctx.strokeStyle = 'rgba(96, 165, 250, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // ========================================================
        // THEME 6: MATRIX (See If We're a Fit — Qualification Radar)
        // ========================================================
        else if (theme === 'matrix') {
          const cx = width * 0.72;
          const cy = height * 0.50;
          const maxR = Math.min(height * 0.40, width * 0.22);
          const axes = 5;

          // Concentric polygon threshold rings (40%, 75%, 100%)
          [0.4, 0.75, 1.0].forEach((ringRatio, rIdx) => {
            const r = maxR * ringRatio * entrance;
            ctx.beginPath();
            for (let i = 0; i < axes; i++) {
              const angle = -Math.PI / 2 + (i * Math.PI * 2) / axes;
              const x = cx + Math.cos(angle) * r;
              const y = cy + Math.sin(angle) * r;
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.strokeStyle = rIdx === 2 ? 'rgba(96, 165, 250, 0.45)' : 'rgba(96, 165, 250, 0.20)';
            ctx.lineWidth = rIdx === 2 ? 1.5 : 1;
            ctx.stroke();
          });

          // Radial axis rays
          for (let i = 0; i < axes; i++) {
            const angle = -Math.PI / 2 + (i * Math.PI * 2) / axes;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(angle) * maxR * entrance, cy + Math.sin(angle) * maxR * entrance);
            ctx.strokeStyle = 'rgba(96, 165, 250, 0.25)';
            ctx.stroke();
          }

          // Active "Ideal Fit" evaluation polygon
          const fitValues = [0.85, 0.95, 0.78, 0.90, 0.82];
          ctx.beginPath();
          fitValues.forEach((val, i) => {
            const angle = -Math.PI / 2 + (i * Math.PI * 2) / axes;
            const r = maxR * val * entrance;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.closePath();
          ctx.fillStyle = 'rgba(37, 99, 235, 0.16)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(96, 165, 250, 0.85)';
          ctx.lineWidth = 2;
          ctx.shadowColor = '#3B82F6';
          ctx.shadowBlur = 10;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        // ========================================================
        // THEME 7: FRAMEWORKS (Insights — Playbook Modeling Grid)
        // ========================================================
        else if (theme === 'frameworks') {
          const startY = height * 0.22;
          const endY = height * 0.82;
          const rows = 6;
          const cols = 8;
          const rowH = (endY - startY) / (rows - 1);
          const colW = width / cols;

          // Ledger horizontal lines with alternating data pulses
          for (let r = 0; r < rows; r++) {
            const y = startY + r * rowH;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width * entrance, y);
            ctx.strokeStyle = 'rgba(96, 165, 250, 0.25)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Cascading pulse beam along row
            if (entrance >= 1 && !prefersReducedMotion) {
              const pX = ((elapsed * (0.2 + r * 0.05)) % 1) * width;
              ctx.beginPath();
              ctx.arc(pX, y, 3, 0, Math.PI * 2);
              ctx.fillStyle = '#60A5FA';
              ctx.shadowColor = '#3B82F6';
              ctx.shadowBlur = 10;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }

          // Diagonal analytical trend vector
          ctx.beginPath();
          ctx.setLineDash([4, 6]);
          ctx.moveTo(width * 0.15, endY);
          ctx.lineTo(width * 0.85 * entrance, startY);
          ctx.strokeStyle = 'rgba(96, 165, 250, 0.45)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // ========================================================
        // THEME 8: NETWORK (Careers — Partner Constellation Bench)
        // ========================================================
        else if (theme === 'network') {
          const hubs = [
            { x: 0.25, y: 0.35, label: 'BOM' },
            { x: 0.45, y: 0.65, label: 'BLR' },
            { x: 0.68, y: 0.30, label: 'DEL' },
            { x: 0.82, y: 0.60, label: 'SIN' },
            { x: 0.55, y: 0.42, label: 'HQ' }
          ];

          // Draw inter-hub communication links
          ctx.lineWidth = 1;
          for (let i = 0; i < hubs.length; i++) {
            for (let j = i + 1; j < hubs.length; j++) {
              ctx.beginPath();
              ctx.moveTo(width * hubs[i].x, height * hubs[i].y);
              ctx.lineTo(width * hubs[j].x * entrance, height * hubs[j].y * entrance);
              ctx.strokeStyle = 'rgba(96, 165, 250, 0.22)';
              ctx.stroke();
            }
          }

          // Hub nodes with pulses
          hubs.forEach((hub, idx) => {
            const hx = width * hub.x;
            const hy = height * hub.y;
            ctx.beginPath();
            ctx.arc(hx, hy, idx === 4 ? 6 : 4.5, 0, Math.PI * 2);
            ctx.fillStyle = idx === 4 ? '#60A5FA' : '#FFFFFF';
            ctx.shadowColor = '#3B82F6';
            ctx.shadowBlur = 12;
            ctx.fill();
            ctx.shadowBlur = 0;

            // Concentric orbit ripple
            if (entrance >= 1 && !prefersReducedMotion) {
              const r = 5 + ((elapsed * 8 + idx * 4) % 18);
              ctx.beginPath();
              ctx.arc(hx, hy, r, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(96, 165, 250, ${(1 - (r - 5) / 18) * 0.5})`;
              ctx.stroke();
            }
          });
        }

        // ========================================================
        // THEME 9: DIRECT (Contact — Converging Partner Transmission)
        // ========================================================
        else if (theme === 'direct') {
          const focusX = width * 0.72;
          const focusY = height * 0.50;

          // Focal beam lines converging into direct partner beacon
          const rayAngles = [-0.65, -0.35, 0, 0.35, 0.65, Math.PI - 0.4, Math.PI + 0.4];
          rayAngles.forEach(ang => {
            const len = Math.max(width * 0.45, height * 0.65) * entrance;
            ctx.beginPath();
            ctx.moveTo(focusX + Math.cos(ang) * len, focusY + Math.sin(ang) * len);
            ctx.lineTo(focusX, focusY);
            ctx.strokeStyle = 'rgba(96, 165, 250, 0.22)';
            ctx.lineWidth = 1;
            ctx.stroke();
          });

          // Concentric transmission beacon rings
          const ringRadii = [25, 55, 95, 140];
          ringRadii.forEach(r => {
            ctx.beginPath();
            ctx.arc(focusX, focusY, r * entrance, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(96, 165, 250, 0.25)';
            ctx.lineWidth = 1;
            ctx.stroke();
          });

          // Central core beacon
          ctx.beginPath();
          ctx.arc(focusX, focusY, 6, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = '#60A5FA';
          ctx.shadowBlur = 14;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Interactive focus beam to cursor
          if (mouse.active && mouse.x >= 0 && mouse.x <= width) {
            ctx.beginPath();
            ctx.moveTo(focusX, focusY);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = 'rgba(96, 165, 250, 0.55)';
            ctx.lineWidth = 1.8;
            ctx.stroke();
          }
        }

        // ========================================================
        // THEME 10: SHIELD (Legal / Policies — Governance Grid)
        // ========================================================
        else if (theme === 'shield') {
          const cx = width * 0.50;
          const cy = height * 0.50;
          const sR = Math.min(height * 0.38, 160) * entrance;

          // Hexagonal integrity shield
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const ang = (i * Math.PI) / 3;
            const x = cx + Math.cos(ang) * sR;
            const y = cy + Math.sin(ang) * sR;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.strokeStyle = 'rgba(96, 165, 250, 0.35)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Horizontal security divider
          ctx.beginPath();
          ctx.moveTo(cx - sR * 1.5, cy);
          ctx.lineTo(cx + sR * 1.5, cy);
          ctx.strokeStyle = 'rgba(96, 165, 250, 0.20)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        if (!prefersReducedMotion) {
          animId = requestAnimationFrame(render);
        }
      }

      if ('IntersectionObserver' in window && hero) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            isVisible = entry.isIntersecting;
            if (isVisible && !prefersReducedMotion) {
              cancelAnimationFrame(animId);
              animId = requestAnimationFrame(render);
            } else {
              cancelAnimationFrame(animId);
            }
          });
        }, { threshold: 0.05 });
        observer.observe(hero);
      }

      render();
    });
  }

  // ============================================================
  // INTERACTIVE SPOTLIGHT BACKGROUNDS (Cursor-reactive)
  // ============================================================
  function initInteractiveBackgrounds() {
    // Skip on touch-only mobile devices to save battery
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const interactiveElements = $$(
      '.hero, .why-c, .final-cta, .ab-phil, .ab-cta, .ow-cta, .wd-cta, ' +
      '.page-hero, .ab-hero, .ow-hero, .wd-opener, .ww-hero, .fit-hero, .contact-hero, .ins-hero, .car-hero, ' +
      '.problem-section, .icp, .team, .co, .ab-team, .ab-diff, .ow-case-list, .service-detail, ' +
      '.ww-archetype, .ww-mirror, .ww-proof, .fit-main-section, .ins-main-wrap, .car-values-section, .car-roles-section, .contact-main-section, ' +
      '.why-card, .icp-card, .team-card, .ow-card, .case-card, .ins-card, .car-val-card, .car-role-card, ' +
      '.contact-info-card, .contact-faq-card, .fit-card, .wd-sit-card, .ab-card, .ab-tile'
    );

    if (!interactiveElements.length) return;

    interactiveElements.forEach(el => {
      let isMoving = false;
      el.addEventListener('mousemove', (e) => {
        if (isMoving) return;
        isMoving = true;
        requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          el.style.setProperty('--mouse-x', `${x}px`);
          el.style.setProperty('--mouse-y', `${y}px`);
          isMoving = false;
        });
      }, { passive: true });
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose utilities globally for debugging
  window.CFOA = {
    showToast,
    initTestimonialCarousel,
    initMobileNav
  };
})();