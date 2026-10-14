(() => {
  const categories = [
    { name: 'Stecklinge', count: 60, slug: 'stecklinge', image: 'assets/cuttings.png' },
    { name: 'Sämlinge', count: 48, slug: 'saemlinge', image: 'assets/images/product-3.png' },
    { name: 'Samen', count: 77, slug: 'samen', image: 'assets/seeds.png' },
    { name: 'Merchandise', count: 27, slug: 'merchandise', icon: '<path d="M18 18h28l4 36H14Z"/><path d="M24 20v-5a8 8 0 0 1 16 0v5"/>' },
    { name: 'Grow Sphere Kit', count: 3, slug: 'sphere-starter-kit', icon: '<circle cx="32" cy="32" r="23"/><path d="M32 48V29M32 33c-14 0-14-14-14-14 14 0 14 14 14 14Zm0-5c0-13 13-13 13-13 0 13-13 13-13 13Z"/>' },
  ];
  const section = document.querySelector('.category-carousel');
  const viewport = section.querySelector('.category-viewport');
  const track = section.querySelector('.category-track');
  const dots = section.querySelector('.category-dots');
  const status = section.querySelector('.category-status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0, position = 0, visible = 4, busy = false, timer, settleTimer;
  let hovered = false, focused = false;
  function createCard(category) {
    const card = document.createElement('article');
    card.className = 'category-card';
    card.innerHTML = `<div class="category-picture">${category.image ? `<img src="${category.image}" alt="${category.name}" width="640" height="243">` : `<svg viewBox="0 0 64 64" aria-hidden="true">${category.icon}</svg>`}</div><h3>${category.name} (${category.count})</h3><a class="category-shop-link" href="https://www.fruityweed.de/shop/produkt-kategorie/${category.slug}/">Shop Now<span class="visually-hidden">: ${category.name}</span></a>`;
    return card;
  }
  function render() {
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const step = track.firstElementChild.getBoundingClientRect().width + gap;
    track.style.transform = `translateX(${-(position + visible) * step}px)`;
    Array.from(track.children).forEach((card, i) => {
      const shown = i >= position + visible && i < position + visible * 2;
      card.inert = !shown;
      card.setAttribute('aria-hidden', String(!shown));
    });
    Array.from(dots.children).forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
      dot.setAttribute('aria-current', i === index ? 'true' : 'false');
    });
  }
  function settle() {
    clearTimeout(settleTimer);
    if (position !== index) {
      track.style.transition = 'none';
      position = index;
      render();
      void track.offsetWidth;
      track.style.transition = '';
    }
    busy = false;
  }
  function restartTimer() {
    clearInterval(timer);
    if (!hovered && !focused && !document.hidden && !reducedMotion.matches) timer = setInterval(() => go(index + 1), 6000);
  }
  function go(next, announce = false) {
    if (busy) return;
    const previous = index;
    index = ((next % categories.length) + categories.length) % categories.length;
    position = previous === categories.length - 1 && (next === categories.length || next === 0) ? categories.length : previous === 0 && (next === -1 || next === categories.length - 1) ? -1 : index;
    render();
    if (announce) status.textContent = `${categories[index].name}, Kategorie ${index + 1} von ${categories.length}`;
    busy = !reducedMotion.matches;
    if (busy) settleTimer = setTimeout(settle, 600);
    else settle();
    restartTimer();
  }
  function layout() {
    const configured = Number(getComputedStyle(viewport).getPropertyValue('--category-count'));
    visible = [1, 2, 4].includes(configured) ? configured : 1;
    clearTimeout(settleTimer);
    busy = false;
    position = index;
    const cards = [...categories.slice(-visible), ...categories, ...categories.slice(0, visible)].map(createCard);
    track.replaceChildren(...cards);
    track.style.transition = 'none';
    render();
    void track.offsetWidth;
    track.style.transition = '';
    restartTimer();
  }
  categories.forEach((category, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `${category.name} anzeigen`);
    dot.addEventListener('click', () => go(i, true));
    dots.append(dot);
  });
  track.addEventListener('transitionend', (event) => { if (event.target === track && event.propertyName === 'transform') settle(); });
  section.querySelector('.category-prev').addEventListener('click', () => go(index - 1, true));
  section.querySelector('.category-next').addEventListener('click', () => go(index + 1, true));
  section.addEventListener('mouseenter', () => { hovered = true; restartTimer(); });
  section.addEventListener('mouseleave', () => { hovered = false; restartTimer(); });
  section.addEventListener('focusin', () => { focused = true; restartTimer(); });
  section.addEventListener('focusout', (event) => { focused = section.contains(event.relatedTarget); restartTimer(); });
  section.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      go(index + (event.key === 'ArrowRight' ? 1 : -1), true);
    }
  });
  let start;
  viewport.addEventListener('touchstart', (event) => { const touch = event.touches[0]; start = { x: touch.clientX, y: touch.clientY }; clearInterval(timer); }, { passive: true });
  viewport.addEventListener('touchend', (event) => {
    if (!start) return;
    const touch = event.changedTouches[0], dx = touch.clientX - start.x, dy = touch.clientY - start.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) { event.preventDefault(); go(index + (dx < 0 ? 1 : -1), true); }
    start = null;
    restartTimer();
  }, { passive: false });
  viewport.addEventListener('touchcancel', () => { start = null; restartTimer(); });
  document.addEventListener('visibilitychange', restartTimer);
  reducedMotion.addEventListener('change', restartTimer);
  new ResizeObserver(layout).observe(viewport);
  layout();
})();
