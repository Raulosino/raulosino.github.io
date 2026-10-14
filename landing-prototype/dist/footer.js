(() => {
  const button = document.querySelector('.back-to-top');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function updateButton() {
    const nearTop = window.scrollY < 300;
    if (!nearTop || document.activeElement !== button) button.hidden = nearTop;
  }
  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    document.querySelector('.brand').focus({ preventScroll: true });
  });
  button.addEventListener('blur', updateButton);
  window.addEventListener('scroll', updateButton, { passive: true });
  updateButton();
})();
