const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#main-menu');
const header = document.querySelector('.site-header');
const desktopLayout = window.matchMedia('(min-width: 1400px)');
function updateMenuHeight() {
  if (desktopLayout.matches || !menu.classList.contains('is-open')) return;
  const contentHeight = Array.from(menu.children).reduce((height, child) => height + child.getBoundingClientRect().height, 0);
  menu.style.setProperty('--menu-height', `${Math.ceil(contentHeight + 24)}px`);
}
function closeMenu() {
  menu.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Menü öffnen');
  menu.inert = !desktopLayout.matches;
  header.querySelectorAll('details').forEach((dropdown) => { dropdown.open = false; });
}
menuButton.addEventListener('click', () => {
  if (menu.classList.contains('is-open')) {
    closeMenu();
  } else {
    menu.classList.add('is-open');
    menu.inert = false;
    updateMenuHeight();
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Menü schließen');
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    const dropdown = header.querySelector('details[open]');
    if (dropdown) {
      dropdown.open = false;
      dropdown.querySelector('summary').focus();
      return;
    }
  }
  if (event.key === 'Escape' && menu.classList.contains('is-open')) {
    closeMenu();
    menuButton.focus();
  }
});
menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
desktopLayout.addEventListener('change', closeMenu);
window.addEventListener('resize', updateMenuHeight);
menu.querySelectorAll('details').forEach((dropdown) => dropdown.addEventListener('toggle', updateMenuHeight));
menu.inert = !desktopLayout.matches;
