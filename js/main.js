
(() => {
  // Active nav highlighting
  const page = document.body.getAttribute('data-page');
  document.querySelectorAll('.nav-link').forEach(a => {
    if (a.dataset.nav === page) a.classList.add('active');
  });

  // Mobile nav
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Close menu on link click (mobile)
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.16 });
  revealEls.forEach(el => io.observe(el));

  // Page transitions (only for internal links)
  const overlay = document.querySelector('.page-transition');
  const isInternal = (href) => href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:');

  document.addEventListener('click', (ev) => {
    const a = ev.target.closest('a');
    if (!a) return;

    const href = a.getAttribute('href');
    if (!href || href.startsWith('#')) return;
    if (!isInternal(href)) return;

    // allow downloads / resume placeholder to pass (if you add later)
    if (a.hasAttribute('download')) return;

    // if same-page anchor link in other page: let it navigate with transition too
    ev.preventDefault();
    if (overlay) overlay.classList.add('on');
    window.setTimeout(() => { window.location.href = href; }, 220);
  });

  // Tilt effect
  const tiltEls = document.querySelectorAll('.tilt');
  tiltEls.forEach(el => {
    let rect;
    const max = 10;
    const onMove = (e) => {
      rect = rect || el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rx = (max/2 - y*max);
      const ry = (x*max - max/2);
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
    };
    const onLeave = () => {
      rect = null;
      el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
  });

  // Magnetic buttons (subtle)
  const mags = document.querySelectorAll('.magnetic');
  mags.forEach(btn => {
    let rect;
    const strength = 14;
    btn.addEventListener('mousemove', (e) => {
      rect = rect || btn.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width/2)) / rect.width;
      const dy = (e.clientY - (rect.top + rect.height/2)) / rect.height;
      btn.style.transform = `translate(${dx*strength}px, ${dy*strength}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      rect = null;
      btn.style.transform = 'translate(0,0)';
    });
  });

  // Toast helper
  window.toast = (msg) => {
    let t = document.querySelector('.toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._to);
    t._to = setTimeout(() => t.classList.remove('show'), 1800);
  };

  // Contact form demo
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.reset();
      window.toast('Sent ✓ (demo)');
    });
  }
})();



// --- V4: insert elegant section dividers (pink wash) BETWEEN sections ---
(function insertWashSplits(){
  try{
    const sections = Array.from(document.querySelectorAll('main .section'));
    if(!sections.length) return;
    sections.forEach((sec, idx) => {
      // Don't add after last section (footer handles its own glow)
      if(idx === sections.length - 1) return;
      // Avoid duplicates
      const next = sec.nextElementSibling;
      if(next && next.classList && next.classList.contains('wash-split')) return;
      const split = document.createElement('div');
      split.className = 'wash-split';
      sec.insertAdjacentElement('afterend', split);
    });
  }catch(e){ /* noop */ }
})();

