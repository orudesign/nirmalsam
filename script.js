/* =========================================================
   NIRMAL SAM — "HEAVEN" PORTFOLIO — script.js
   ========================================================= */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(max-width:900px)').matches || 'ontouchstart' in window;

  /* ---------------------------------------------------------
     PRELOADER
  --------------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  const preFill = document.getElementById('preloader-fill');
  const prePct = document.getElementById('preloader-pct');

  function runPreloader(){
    let p = 0;
    const step = () => {
      p += Math.random() * 14 + 6;
      if (p >= 100){
        p = 100;
        preFill.style.width = '100%';
        prePct.textContent = '100%';
        setTimeout(() => {
          preloader.classList.add('done');
          document.body.style.overflow = '';
          initAfterLoad();
        }, 350);
        return;
      }
      preFill.style.width = p + '%';
      prePct.textContent = Math.floor(p) + '%';
      setTimeout(step, 140 + Math.random() * 120);
    };
    document.body.style.overflow = 'hidden';
    step();
  }

  // Preloader ambient canvas
  const preCanvas = document.getElementById('preloader-canvas');
  if (preCanvas){
    const pctx = preCanvas.getContext('2d');
    let pw, ph, pparticles = [];
    function resizePre(){
      pw = preCanvas.width = window.innerWidth;
      ph = preCanvas.height = window.innerHeight;
    }
    resizePre();
    for (let i=0;i<60;i++){
      pparticles.push({x:Math.random()*pw,y:Math.random()*ph,r:Math.random()*1.6+.4,s:Math.random()*.3+.05});
    }
    let preAnimId;
    function drawPre(){
      pctx.clearRect(0,0,pw,ph);
      pctx.fillStyle = 'rgba(242,200,121,0.7)';
      pparticles.forEach(pt => {
        pt.y -= pt.s;
        if (pt.y < 0) pt.y = ph;
        pctx.globalAlpha = 0.5;
        pctx.beginPath();
        pctx.arc(pt.x, pt.y, pt.r, 0, Math.PI*2);
        pctx.fill();
      });
      preAnimId = requestAnimationFrame(drawPre);
    }
    if (!reduceMotion) drawPre();
    window.addEventListener('resize', resizePre);
    // stop drawing once preloader is gone to save cycles
    const stopObserver = new MutationObserver(() => {
      if (preloader.classList.contains('done')){
        cancelAnimationFrame(preAnimId);
        stopObserver.disconnect();
      }
    });
    stopObserver.observe(preloader, {attributes:true});
  }

  /* ---------------------------------------------------------
     SKY / AURORA BACKGROUND CANVAS (persistent)
  --------------------------------------------------------- */
  const skyCanvas = document.getElementById('sky-canvas');
  const sctx = skyCanvas.getContext('2d');
  let sw, sh, stars = [];

  function resizeSky(){
    sw = skyCanvas.width = window.innerWidth;
    sh = skyCanvas.height = window.innerHeight;
  }
  resizeSky();

  function buildStars(){
    stars = [];
    const count = Math.min(140, Math.floor((sw*sh)/9000));
    for (let i=0;i<count;i++){
      stars.push({
        x:Math.random()*sw,
        y:Math.random()*sh,
        r:Math.random()*1.3+.3,
        tw:Math.random()*Math.PI*2,
        speed:Math.random()*0.4+0.15,
        drift:Math.random()*0.15+0.02
      });
    }
  }
  buildStars();

  let skyAnimId;
  function drawSky(t){
    sctx.clearRect(0,0,sw,sh);
    stars.forEach(s => {
      const twinkle = Math.sin(t*0.001*s.speed + s.tw) * 0.4 + 0.6;
      sctx.globalAlpha = twinkle * 0.8;
      sctx.fillStyle = '#f6f4ee';
      sctx.beginPath();
      sctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      sctx.fill();
      s.y -= s.drift;
      if (s.y < -5) s.y = sh + 5;
    });
    sctx.globalAlpha = 1;
    skyAnimId = requestAnimationFrame(drawSky);
  }
  if (!reduceMotion){
    requestAnimationFrame(drawSky);
  } else {
    drawSky(0);
  }
  window.addEventListener('resize', () => { resizeSky(); buildStars(); });

  /* ---------------------------------------------------------
     CUSTOM CURSOR
  --------------------------------------------------------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let mouseX = window.innerWidth/2, mouseY = window.innerHeight/2;
  let ringX = mouseX, ringY = mouseY;

  if (!isTouch){
    window.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    function animateRing(){
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.addEventListener('mousedown', () => {
      cursorRing.style.transform = 'translate(-50%,-50%) scale(0.8)';
    });
    document.addEventListener('mouseup', () => {
      cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
    });

    document.addEventListener('mouseover', e => {
      if (e.target.closest('a, button, .magnetic, input, textarea')){
        cursorRing.classList.add('active');
      }
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest('a, button, .magnetic, input, textarea')){
        cursorRing.classList.remove('active');
      }
    });

    // Ripple on click
    document.addEventListener('click', e => {
      const ripple = document.createElement('div');
      ripple.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:8px;height:8px;
        border:1px solid rgba(242,200,121,.8);border-radius:50%;transform:translate(-50%,-50%);
        pointer-events:none;z-index:9998;animation:rippleOut .6s ease-out forwards;`;
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `@keyframes rippleOut{to{width:70px;height:70px;opacity:0;}}`;
    document.head.appendChild(rippleStyle);
  } else {
    cursorDot.style.display = 'none';
    cursorRing.style.display = 'none';
  }

  /* ---------------------------------------------------------
     MAGNETIC HOVER EFFECT
  --------------------------------------------------------- */
  if (!isTouch){
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width/2;
        const y = e.clientY - r.top - r.height/2;
        el.style.transform = `translate(${x*0.25}px, ${y*0.35}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0,0)';
      });
    });
  }

  /* ---------------------------------------------------------
     ROUTER (SPA page switching)
  --------------------------------------------------------- */
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('[data-nav]');
  const navUnderline = document.getElementById('navUnderline');
  const navLinksWrap = document.getElementById('navLinks');
  const mobileMenu = document.getElementById('mobileMenu');
  const navBurger = document.getElementById('navBurger');

  function getPageFromHash(){
    const h = (location.hash || '#home').replace('#','');
    return ['home','about','experience','contact'].includes(h) ? h : 'home';
  }

  function moveUnderline(page){
    const target = navLinksWrap.querySelector(`.nav-link[data-page="${page}"]`);
    if (!target) return;
    const targetRect = target.getBoundingClientRect();
    const wrapRect = navLinksWrap.getBoundingClientRect();
    navUnderline.style.width = targetRect.width + 'px';
    navUnderline.style.transform = `translateX(${targetRect.left - wrapRect.left}px)`;
  }

  function setActiveLinks(page){
    document.querySelectorAll('[data-nav]').forEach(a => {
      a.classList.toggle('active-link', a.dataset.page === page);
    });
    moveUnderline(page);
  }

  let currentPage = null;
  function showPage(page, {scroll=true} = {}){
    if (page === currentPage) { if(scroll) window.scrollTo({top:0}); return; }
    const incoming = document.getElementById('page-' + page);
    const outgoing = currentPage ? document.getElementById('page-' + currentPage) : null;

    if (outgoing){
      outgoing.classList.remove('active-page');
      outgoing.classList.add('leaving-page');
      setTimeout(() => {
        outgoing.classList.remove('leaving-page');
      }, 460);
    }

    incoming.classList.add('active-page');
    if (scroll) window.scrollTo({top:0, behavior:'auto'});

    currentPage = page;
    setActiveLinks(page);
    mobileMenu.classList.remove('open');
    document.body.classList.remove('menu-open');

    // re-run reveal check + timeline draw for the new page
    requestAnimationFrame(() => {
      checkReveals();
      if (page === 'experience') drawTimeline();
    });
  }

  navLinks.forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const page = a.dataset.page || (a.getAttribute('href') || '').replace('#','');
      location.hash = page;
      showPage(page);
    });
  });
  window.addEventListener('hashchange', () => showPage(getPageFromHash()));

  /* ---------------------------------------------------------
     NAVBAR SHOW/HIDE ON SCROLL + SCROLL PROGRESS
  --------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scrollProgress');
  let lastScroll = 0;

  function onScroll(){
    const y = window.scrollY;
    if (y > 40) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');

    if (y > lastScroll && y > 140){
      navbar.classList.add('hide-nav');
    } else {
      navbar.classList.remove('hide-nav');
    }
    lastScroll = y;

    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const pct = max > 0 ? (y / max) * 100 : 0;
    scrollProgress.style.width = pct + '%';

    checkReveals();
  }
  window.addEventListener('scroll', onScroll, {passive:true});

  /* ---------------------------------------------------------
     MOBILE MENU
  --------------------------------------------------------- */
  navBurger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    navBurger.classList.toggle('active');
  });

  /* ---------------------------------------------------------
     REVEAL ON SCROLL (IntersectionObserver-free simple check,
     works across the SPA where scroll container is window)
  --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal-up');
  function checkReveals(){
    const vh = window.innerHeight;
    revealEls.forEach(el => {
      if (el.classList.contains('in-view')) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < vh * 0.9 && rect.bottom > 0){
        el.classList.add('in-view');
        if (el.classList.contains('stat-card') || el.querySelector('.stat-number')){
          animateCounters(el);
        }
      }
    });
  }

  /* ---------------------------------------------------------
     COUNTER ANIMATION
  --------------------------------------------------------- */
  const countedSet = new WeakSet();
  function animateCounters(scope){
    const numbers = scope.matches && scope.matches('[data-count]') ? [scope] : scope.querySelectorAll('[data-count]');
    numbers.forEach(numEl => {
      if (countedSet.has(numEl)) return;
      countedSet.add(numEl);
      const target = parseFloat(numEl.dataset.count);
      const prefix = numEl.dataset.prefix || '';
      const suffix = numEl.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();
      function tick(now){
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.floor(eased * target);
        numEl.textContent = prefix + val + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else numEl.textContent = prefix + target + suffix;
      }
      requestAnimationFrame(tick);
    });
  }

  /* ---------------------------------------------------------
     HERO TILT + PARALLAX ON MOUSE MOVE
  --------------------------------------------------------- */
  const portraitTilt = document.getElementById('portraitTilt');
  if (portraitTilt && !isTouch){
    window.addEventListener('mousemove', e => {
      const cx = window.innerWidth/2, cy = window.innerHeight/2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      portraitTilt.style.transform = `rotateY(${dx*10}deg) rotateX(${-dy*10}deg)`;
    });
  }

  /* ---------------------------------------------------------
     PORTRAIT PARTICLES (gold dust around hero image)
  --------------------------------------------------------- */
  const portraitParticles = document.getElementById('portraitParticles');
  if (portraitParticles){
    const n = 24;
    for (let i=0;i<n;i++){
      const d = document.createElement('span');
      const size = Math.random()*3+1;
      const angle = Math.random()*360;
      const dist = 140 + Math.random()*90;
      const dur = 4 + Math.random()*4;
      d.style.cssText = `position:absolute;top:50%;left:50%;width:${size}px;height:${size}px;
        border-radius:50%;background:${Math.random()>0.5?'#f2c879':'#f8e3b3'};
        box-shadow:0 0 6px 1px rgba(242,200,121,.7);
        transform:rotate(${angle}deg) translateX(${dist}px);
        animation:dustfloat ${dur}s ease-in-out infinite;
        animation-delay:-${Math.random()*dur}s;
        opacity:${Math.random()*.6+.3};`;
      portraitParticles.appendChild(d);
    }
    const dustStyle = document.createElement('style');
    dustStyle.textContent = `@keyframes dustfloat{
      0%,100%{opacity:.3;}
      50%{opacity:.9;}
    }`;
    document.head.appendChild(dustStyle);
  }

  /* ---------------------------------------------------------
     SERVICE CARD TILT (3D on hover)
  --------------------------------------------------------- */
  if (!isTouch){
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateY(${x*8}deg) rotateX(${-y*8}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(700px) rotateY(0) rotateX(0) translateY(0)';
      });
    });
  }

  /* ---------------------------------------------------------
     CASE STUDIES SLIDER — dots + click-drag
  --------------------------------------------------------- */
  const casesTrack = document.getElementById('casesTrack');
  const sliderDots = document.getElementById('sliderDots');
  if (casesTrack && sliderDots){
    const cards = casesTrack.querySelectorAll('.case-card');
    cards.forEach((_, i) => {
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        cards[i].scrollIntoView({behavior:'smooth', inline:'start', block:'nearest'});
      });
      sliderDots.appendChild(dot);
    });
    const dots = sliderDots.querySelectorAll('span');

    function updateDots(){
      let closestIdx = 0, closestDist = Infinity;
      cards.forEach((c, i) => {
        const dist = Math.abs(c.getBoundingClientRect().left - casesTrack.getBoundingClientRect().left);
        if (dist < closestDist){ closestDist = dist; closestIdx = i; }
      });
      dots.forEach((d,i) => d.classList.toggle('active', i === closestIdx));
    }
    casesTrack.addEventListener('scroll', () => {
      requestAnimationFrame(updateDots);
    }, {passive:true});

    // drag to scroll (desktop)
    let isDown = false, startX, scrollLeft;
    casesTrack.addEventListener('mousedown', e => {
      isDown = true;
      startX = e.pageX - casesTrack.offsetLeft;
      scrollLeft = casesTrack.scrollLeft;
      casesTrack.style.cursor = 'grabbing';
    });
    window.addEventListener('mouseup', () => { isDown = false; casesTrack.style.cursor = ''; });
    casesTrack.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - casesTrack.offsetLeft;
      casesTrack.scrollLeft = scrollLeft - (x - startX) * 1.4;
    });
  }

  /* ---------------------------------------------------------
     SKILL PILL RANDOM FLOAT DELAY
  --------------------------------------------------------- */
  document.querySelectorAll('.skill-pill').forEach(p => {
    p.style.setProperty('--r', Math.random()*5);
  });

  /* ---------------------------------------------------------
     TIMELINE SVG LINE DRAW
  --------------------------------------------------------- */
  function drawTimeline(){
    const wrap = document.getElementById('timelineWrap');
    if (!wrap) return;
    const line = wrap.querySelector('.timeline-line');
    const rect = wrap.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.6){
      line.classList.add('drawn');
    }
  }
  window.addEventListener('scroll', drawTimeline, {passive:true});

  /* ---------------------------------------------------------
     CONTACT FORM (front-end only, no backend)
  --------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  if (contactForm){
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      formStatus.textContent = 'Sending…';
      setTimeout(() => {
        formStatus.textContent = "Message received — I'll reply within 24 hours.";
        contactForm.reset();
      }, 900);
    });
  }

  /* ---------------------------------------------------------
     BACK TO TOP
  --------------------------------------------------------- */
  document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({top:0, behavior:'smooth'});
  });

  /* ---------------------------------------------------------
     FOOTER YEAR
  --------------------------------------------------------- */
 document.getElementById('footerCopy').innerHTML =
  `&copy; ${new Date().getFullYear()} Designed and Developed by 
  <a href="https://www.orudesign.in/" target="_blank" rel="noopener noreferrer">
    Oru Design Creative Studio
  </a>.`;

  /* ---------------------------------------------------------
     INIT (after preloader completes)
  --------------------------------------------------------- */
  function initAfterLoad(){
    const initialPage = getPageFromHash();
    if (!location.hash) history.replaceState(null, '', '#home');
    showPage(initialPage, {scroll:false});
    checkReveals();
    window.addEventListener('resize', () => moveUnderline(currentPage));
  }

  // kick off
  if (document.readyState === 'complete') runPreloader();
  else window.addEventListener('load', runPreloader);

})();
