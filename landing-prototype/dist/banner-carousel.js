(() => {
  const carousel = document.querySelector('.banner-carousel');
  const stage = carousel.querySelector('.banner-stage');
  const dots = carousel.querySelector('.banner-dots');
  const status = carousel.querySelector('.banner-status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const data = window.bannerSlides;
  let current = 0;
  let hovered = false;
  let focused = false;
  let timer;
  const slides = data.map((item, index) => {
    const slide = document.createElement('figure');
    slide.className = 'banner-slide';
    slide.setAttribute('aria-label', `${index + 1} von ${data.length}`);
    if (item.src) {
      const image = document.createElement('img');
      image.src = item.src;
      image.alt = item.alt;
      slide.append(image);
    } else {
      const placeholder = document.createElement('div');
      placeholder.className = 'banner-placeholder';
      placeholder.innerHTML = '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="8" y="10" width="48" height="44" rx="4"/><circle cx="23" cy="24" r="5"/><path d="m9 46 14-12 10 8 10-14 13 18"/></svg>';
      const label = document.createElement('strong');
      label.textContent = item.label;
      const note = document.createElement('span');
      note.textContent = 'Platzhalter für dein Bild';
      placeholder.append(label, note);
      slide.append(placeholder);
    }
    stage.append(slide);
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Bild ${index + 1} anzeigen`);
    dot.addEventListener('click', () => show(index, true));
    dots.append(dot);
    return slide;
  });
  function restartTimer() {
    clearInterval(timer);
    if (slides.length > 1 && !reducedMotion.matches && !hovered && !focused && !document.hidden) timer = setInterval(() => show(current + 1), 6000);
  }
  function show(index, announce = false) {
    current = ((index % slides.length) + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === current);
      slide.setAttribute('aria-hidden', String(i !== current));
      slide.inert = i !== current;
      dots.children[i].classList.toggle('is-active', i === current);
      dots.children[i].setAttribute('aria-current', i === current ? 'true' : 'false');
    });
    if (announce) status.textContent = `Bild ${current + 1} von ${slides.length}`;
    restartTimer();
  }
  carousel.querySelector('.banner-prev').addEventListener('click', () => show(current - 1, true));
  carousel.querySelector('.banner-next').addEventListener('click', () => show(current + 1, true));
  carousel.addEventListener('mouseenter', () => { hovered = true; restartTimer(); });
  carousel.addEventListener('mouseleave', () => { hovered = false; restartTimer(); });
  carousel.addEventListener('focusin', () => { focused = true; restartTimer(); });
  carousel.addEventListener('focusout', (event) => { focused = carousel.contains(event.relatedTarget); restartTimer(); });
  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(current + (event.key === 'ArrowRight' ? 1 : -1), true);
    }
  });
  let start;
  stage.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    start = { x: touch.clientX, y: touch.clientY };
    clearInterval(timer);
  }, { passive: true });
  stage.addEventListener('touchend', (event) => {
    if (!start) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) show(current + (dx < 0 ? 1 : -1), true);
    start = null;
    restartTimer();
  }, { passive: true });
  stage.addEventListener('touchcancel', () => { start = null; restartTimer(); });
  document.addEventListener('visibilitychange', restartTimer);
  reducedMotion.addEventListener('change', restartTimer);
  show(0);
})();
