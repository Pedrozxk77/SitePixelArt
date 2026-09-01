/* ==========================================================================
   CELESTE LANDING PAGE — Main JavaScript
   Handles: Header scroll, Mobile menu, Scroll reveal, Parallax, Nav dots
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  document.body.classList.add('loading');

  const loaderScreen = document.getElementById('loader-screen');
  const loaderPercent = document.getElementById('loader-percent');
  const loaderBarFill = document.getElementById('loader-bar-fill');
  const loaderArt = document.querySelector('.loader-art-wrap');

  if (loaderScreen && loaderPercent && loaderBarFill) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 12 + 8;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }

      loaderPercent.textContent = `${Math.round(progress)}%`;
      loaderBarFill.style.width = `${progress}%`;
      if (loaderArt) {
        const fillValue = Math.min(100, Math.max(0, progress));
        loaderArt.style.setProperty('--loader-fill', fillValue.toFixed(1));
        loaderArt.style.filter = `grayscale(${Math.max(0, 1 - fillValue / 100)}) brightness(${0.38 + fillValue / 160}) saturate(${0.25 + fillValue / 100})`;
      }

      if (progress >= 100) {
        setTimeout(() => {
          document.body.classList.remove('loading');
          document.body.classList.add('loaded');
          loaderScreen.classList.add('hidden');
          gsap.to('#app-shell', {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out'
          });
        }, 500);
      }
    }, 120);
  }

  gsap.registerPlugin(ScrollTrigger);

  // ==================== GSAP INITIAL LOAD ANIMATIONS ====================
  gsap.from('.nav-item', {
    opacity: 0,
    y: -14,
    duration: 0.7,
    stagger: 0.08,
    ease: 'power2.out',
    delay: 0.1
  });

  gsap.from('.hero-content > *', {
    opacity: 0,
    y: 32,
    duration: 0.9,
    stagger: 0.12,
    ease: 'power3.out',
    delay: 0.2
  });

  gsap.from('.hero-scene-img, .hero-scene-overlay', {
    opacity: 0,
    scale: 1.18,
    x: 18,
    duration: 1.3,
    ease: 'power2.out',
    delay: 0.25
  });

  gsap.to('.hero-scene-img', {
    yPercent: 8,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  gsap.utils.toArray('.section-header, .about-content, .about-visual, .feature-mini, .feature-card, .chapter-card, .review-card, .cta-content, .cta-strawberry, .floating-stat').forEach((el) => {
    gsap.fromTo(el, {
      opacity: 0,
      y: 28
    }, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 82%',
        once: true
      }
    });
  });

  gsap.utils.toArray('.frame').forEach((frame) => {
    frame.addEventListener('mouseenter', () => {
      gsap.to(frame, { y: -10, scale: 1.03, duration: 0.25, ease: 'power2.out' });
    });

    frame.addEventListener('mouseleave', () => {
      gsap.to(frame, { y: 0, scale: 1, duration: 0.25, ease: 'power2.out' });
    });
  });

  // ==================== HEADER SCROLL EFFECT ====================
  const header = document.getElementById('main-header');
  let lastScroll = 0;

  const handleScroll = () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ==================== MOBILE MENU TOGGLE ====================
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when clicking nav links
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ==================== NAVIGATION DOTS ====================
  const navDots = document.querySelectorAll('.nav-dot');
  const sections = document.querySelectorAll('section[id]');

  // Update active dot on scroll
  const updateActiveDot = () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navDots.forEach(dot => {
      dot.classList.remove('active');
      const href = dot.getAttribute('href');
      if (href === `#${current}`) {
        dot.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', updateActiveDot, { passive: true });

  // ==================== SCROLL REVEAL ANIMATIONS ====================
  const revealElements = () => {
    const elements = document.querySelectorAll(
      '.about-visual, .about-content, .feature-card, .chapter-card, ' +
      '.review-card, .award-badge, .summit-content, .cta-strawberry, ' +
      '.cta-content, .section-header, .feature-mini, .about-features-grid'
    );

    elements.forEach(el => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
      }
    });
  };

  revealElements();

  // Intersection Observer for reveal
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        let siblingIndex = Array.from(siblings).indexOf(entry.target);

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, siblingIndex * 80);

        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==================== PARALLAX EFFECT ON HERO ====================
  const heroScene = document.querySelector('.hero-scene-img');

  if (heroScene) {
    const handleParallax = () => {
      const scrolled = window.scrollY;
      const rate = scrolled * 0.3;

      if (scrolled < window.innerHeight) {
        heroScene.style.transform = `translateY(${rate}px) scale(1.05)`;
      }
    };

    window.addEventListener('scroll', handleParallax, { passive: true });
  }

  // ==================== FEATURE CARDS 3D TILT & GLOW ====================
  const featureCards = document.querySelectorAll('.feature-card');

  featureCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      card.style.setProperty('--glow-x', `${x}%`);
      card.style.setProperty('--glow-y', `${y}%`);

      const tiltX = (e.clientX - rect.left) / rect.width - 0.5;
      const tiltY = (e.clientY - rect.top) / rect.height - 0.5;

      card.style.transform = `translateY(-12px) scale(1.02) perspective(1000px) rotateX(${tiltY * -8}deg) rotateY(${tiltX * 8}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ==================== CHARACTER CAROUSEL ====================
  const characterFrames = document.querySelectorAll('.frame');
  const characterMainImage = document.getElementById('character-main-image');
  const characterMain = document.querySelector('.character-main');
  const characterName = document.getElementById('character-name');
  const characterRole = document.getElementById('character-role');
  const characterDescription = document.getElementById('character-description');

  characterFrames.forEach(frame => {
    frame.addEventListener('click', () => {
      characterFrames.forEach(item => item.classList.remove('is-active'));
      frame.classList.add('is-active');

      const image = frame.dataset.image;
      const name = frame.dataset.name;
      const role = frame.dataset.role;
      const description = frame.dataset.description;

      if (characterMainImage) characterMainImage.src = image;
      if (characterMainImage) characterMainImage.alt = name;
      if (characterName) characterName.textContent = name;
      if (characterRole) characterRole.textContent = role;
      if (characterDescription) characterDescription.textContent = description;
      // Marcar o card principal quando Mr. Oshiro for selecionado
      if (characterMain) {
        if (name === 'Mr. Oshiro') {
          characterMain.classList.add('mr-oshiro');
        } else {
          characterMain.classList.remove('mr-oshiro');
        }
      }
    });
  });

  // ==================== CHAPTER CARD HOVER GLOW & STACKED SCROLL ====================
  const chapterCards = document.querySelectorAll('.chapter-card');
  const chaptersSection = document.getElementById('chapters');

  chapterCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      card.style.setProperty('--glow-x', `${x}%`);
      card.style.setProperty('--glow-y', `${y}%`);
    });
  });

  const updateChapterStack = () => {
    if (!chaptersSection) return;

    const sectionRect = chaptersSection.getBoundingClientRect();
    const sectionStart = sectionRect.top + window.scrollY;
    const scrollOffset = window.scrollY + window.innerHeight * 0.8;

    chapterCards.forEach((card, index) => {
      const progress = (scrollOffset - (sectionStart + index * 120)) / 360;
      const lift = Math.max(0, Math.min(60, progress * 40 + index * 18));
      const rotation = index % 2 === 0 ? -1.2 : 1.2;

      card.style.transform = `translateY(${lift}px) rotate(${rotation}deg)`;
      card.style.zIndex = String(40 + index);
    });
  };

  updateChapterStack();
  window.addEventListener('scroll', updateChapterStack, { passive: true });
  window.addEventListener('resize', updateChapterStack);

  // ==================== TYPING / COUNTER ANIMATION ====================
  const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
      if (counter.dataset.animated) return;

      const text = counter.textContent;
      const hasPlus = text.includes('+');
      const target = parseInt(text.replace(/[^\d]/g, ''));

      if (isNaN(target)) return;

      counter.dataset.animated = 'true';
      let current = 0;
      const increment = target / 40;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = Math.floor(current) + (hasPlus ? '+' : '');
      }, 30);
    });
  };

  // Observe stats for counter animation
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.floating-stat').forEach(stat => {
    statObserver.observe(stat);
  });

  // ==================== SNOWFLAKE RANDOMIZATION ====================
  const snowflakes = document.querySelectorAll('.snowflake');
  snowflakes.forEach(flake => {
    const randomLeft = Math.random() * 100;
    const randomDuration = 8 + Math.random() * 8;
    const randomDelay = Math.random() * 6;
    const randomSize = 6 + Math.random() * 10;

    flake.style.left = `${randomLeft}%`;
    flake.style.animationDuration = `${randomDuration}s`;
    flake.style.animationDelay = `${randomDelay}s`;
    flake.style.fontSize = `${randomSize}px`;
  });

});
