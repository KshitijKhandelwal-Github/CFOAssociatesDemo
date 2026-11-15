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

    const animatedElements = $$('[data-animate]');
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
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
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
            img.addEventListener('load', () => {
              img.style.opacity = '1';
            });
            img.style.opacity = '0';
            img.style.transition = 'opacity 400ms ease';
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
    initActiveNavHighlight();
    initHeaderScrollEffect();
    initForms();
    initLazyLoad();

    // Add animation classes to elements that should animate on scroll
    // This can be expanded based on specific needs
    const animateSelectors = [
      '.problem-content',
      '.problem-callout',
      '.why-card',
      '.icp-card',
      '.co-card',
      '.team-card',
      '.final-cta-inner',
      '.kfoot-brand',
      '.kfoot-column'
    ];

    animateSelectors.forEach(selector => {
      $$(selector).forEach((el, i) => {
        el.setAttribute('data-animate', 'fade-up');
        el.style.transitionDelay = `${i * 100}ms`;
      });
    });

    console.log('[CFOAssociates] Initialized successfully');
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