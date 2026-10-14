(() => {
  const carousel = document.querySelector('.product-carousel');
  const viewport = carousel.querySelector('.carousel-viewport');
  const track = carousel.querySelector('.carousel-track');
  const dots = carousel.querySelector('.carousel-dots');
  const status = carousel.querySelector('.carousel-status');
  const products = window.carouselProducts;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let page = 0;
  let visible = 4;
  let pages = 3;
  let visualPage = 0;
  let animating = false;
  let settleTimer;
  let paused = reducedMotion.matches;
  let timer;
  let hovered = false;
  let focused = false;
  let saved;
  try { saved = new Set(JSON.parse(localStorage.getItem('fruityweed-prototype-wishlist') || '[]')); }
  catch { saved = new Set(); }
  const heart = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg>';
  const escapeHtml = (text) => String(text).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  function createCard(product, index) {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.productUrl = product.url;
    card.setAttribute('aria-label', `${index + 1} von ${products.length}: ${product.name}`);
    card.innerHTML = `
      <div class="product-image-panel">
        <a class="product-image-link" href="${escapeHtml(product.url)}" tabindex="-1" aria-hidden="true"><img src="${escapeHtml(product.image)}" alt="" width="800" height="800" loading="${index < 4 ? 'eager' : 'lazy'}"></a>
        <div class="product-overlay">
          <div class="product-description">
            <h2><a href="${escapeHtml(product.url)}">${escapeHtml(product.name)}</a></h2>
            <p class="product-price">${product.oldPrice ? `<del>${escapeHtml(product.oldPrice)} €</del>` : ''}<strong>${escapeHtml(product.price)} €</strong></p>
            <p class="product-tax">Enthält 7% red. MwSt.</p>
          </div>
          <div class="product-actions"><a href="${escapeHtml(product.url)}">Weiterlesen</a><a href="${escapeHtml(product.url)}">Details anzeigen</a></div>
        </div>
        ${product.oldPrice ? '<span class="product-sale">Angebot!</span>' : ''}
      </div>
      <button class="wishlist-button" type="button" aria-pressed="false">${heart}<span>Zur Wunschliste hinzufügen</span></button>`;
    const wish = card.querySelector('.wishlist-button');
    function updateWish() {
      const selected = saved.has(product.url);
      const matching = [card, ...Array.from(track.children)].filter((item) => item.dataset.productUrl === product.url);
      matching.forEach((item) => {
        const button = item.querySelector('.wishlist-button');
        button.setAttribute('aria-pressed', String(selected));
        button.querySelector('span').textContent = selected ? 'Auf deiner Wunschliste' : 'Zur Wunschliste hinzufügen';
      });
    }
    wish.addEventListener('click', () => {
      saved.has(product.url) ? saved.delete(product.url) : saved.add(product.url);
      try { localStorage.setItem('fruityweed-prototype-wishlist', JSON.stringify([...saved])); } catch { /* Browser storage may be unavailable. */ }
      updateWish();
    });
    updateWish();
    return card;
  }
  const originalCards = products.map(createCard);
  track.append(...originalCards);
  function render(announce = false) {
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const step = track.firstElementChild.getBoundingClientRect().width + gap;
    track.style.transform = `translateX(${-(visualPage + 1) * visible * step}px)`;
    const first = page * visible;
    const displayedFirst = (visualPage + 1) * visible;
    Array.from(track.children).forEach((card, index) => {
      const shown = index >= displayedFirst && index < displayedFirst + visible;
      card.inert = !shown;
      card.setAttribute('aria-hidden', String(!shown));
    });
    dots.querySelectorAll('button').forEach((dot, index) => {
      dot.classList.toggle('is-active', index === page);
      dot.setAttribute('aria-current', index === page ? 'true' : 'false');
    });
    if (announce) status.textContent = `Produkte ${first + 1} bis ${Math.min(first + visible, products.length)} von ${products.length}`;
  }
  function restartTimer() {
    clearInterval(timer);
    if (!paused && !hovered && !focused && !document.hidden) timer = setInterval(() => {
      goTo(page + 1, false);
    }, 6000);
  }
  function snapToRealPage() {
    clearTimeout(settleTimer);
    if (visualPage !== page) {
      track.style.transition = 'none';
      visualPage = page;
      render();
      void track.offsetWidth;
      track.style.transition = '';
    }
    animating = false;
  }
  track.addEventListener('transitionend', (event) => {
    if (event.target === track && event.propertyName === 'transform') snapToRealPage();
  });
  function goTo(next, announce = true) {
    if (animating) return;
    const previous = page;
    page = ((next % pages) + pages) % pages;
    if (previous === pages - 1 && (next === pages || next === 0)) visualPage = pages;
    else if (previous === 0 && (next === -1 || next === pages - 1)) visualPage = -1;
    else visualPage = page;
    animating = !reducedMotion.matches;
    render(announce);
    if (animating) settleTimer = setTimeout(snapToRealPage, 650);
    else snapToRealPage();
    restartTimer();
  }
  function layout() {
    const previousFirst = page * visible;
    const configuredVisible = Number(getComputedStyle(viewport).getPropertyValue('--visible-products'));
    visible = [1, 2, 4].includes(configuredVisible) ? configuredVisible : (window.innerWidth < 576 ? 1 : window.innerWidth < 1200 ? 2 : 4);
    pages = Math.ceil(products.length / visible);
    page = Math.min(Math.floor(previousFirst / visible), pages - 1);
    clearTimeout(settleTimer);
    animating = false;
    visualPage = page;
    const before = products.slice(-visible).map((product, index) => createCard(product, products.length - visible + index));
    const after = products.slice(0, visible).map(createCard);
    before.concat(after).forEach((card) => {
      card.querySelectorAll('img').forEach((image) => { image.loading = 'eager'; });
    });
    track.replaceChildren(...before, ...originalCards, ...after);
    dots.replaceChildren();
    for (let index = 0; index < pages; index++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Produktgruppe ${index + 1} von ${pages}`);
      dot.addEventListener('click', () => goTo(index));
      dots.append(dot);
    }
    track.style.transition = 'none';
    render();
    void track.offsetWidth;
    track.style.transition = '';
    restartTimer();
  }
  carousel.querySelector('.carousel-prev').addEventListener('click', () => goTo(page - 1));
  carousel.querySelector('.carousel-next').addEventListener('click', () => goTo(page + 1));
  carousel.addEventListener('mouseenter', () => { hovered = true; restartTimer(); });
  carousel.addEventListener('mouseleave', () => { hovered = false; restartTimer(); });
  carousel.addEventListener('focusin', () => { focused = true; restartTimer(); });
  carousel.addEventListener('focusout', (event) => { focused = carousel.contains(event.relatedTarget); restartTimer(); });
  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(page + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  let touchStart;
  viewport.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    touchStart = { x: touch.clientX, y: touch.clientY };
    clearInterval(timer);
  }, { passive: true });
  viewport.addEventListener('touchend', (event) => {
    if (!touchStart) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      event.preventDefault();
      goTo(page + (dx < 0 ? 1 : -1));
    }
    touchStart = null;
    restartTimer();
  }, { passive: false });
  viewport.addEventListener('touchcancel', () => { touchStart = null; restartTimer(); });
  document.addEventListener('visibilitychange', restartTimer);
  reducedMotion.addEventListener('change', (event) => { paused = event.matches; restartTimer(); });
  new ResizeObserver(layout).observe(viewport);
  layout();
})();
