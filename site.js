(function () {
  const page = document.querySelector('.page');
  const navPill = document.getElementById('navPill');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavClose = document.getElementById('mobileNavClose');

  if (navPill) {
    let ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        navPill.classList.toggle('scrolled', window.scrollY > 50);
        ticking = false;
      });
    }, { passive: true });
  }

  if (!hamburgerBtn || !mobileNav) return;

  const focusableSelector = 'a[href], button:not([disabled])';
  let lastFocus = null;

  function overlayFocusable() {
    return Array.prototype.slice.call(mobileNav.querySelectorAll(focusableSelector));
  }

  function setBackgroundInert(open) {
    if (!page) return;
    Array.prototype.forEach.call(page.children, function (child) {
      if (child === mobileNav) return;
      if ('inert' in child) {
        child.inert = open;
      } else if (open) {
        child.setAttribute('aria-hidden', 'true');
      } else {
        child.removeAttribute('aria-hidden');
      }
    });
  }

  function closeMenu() {
    if (!mobileNav.classList.contains('active')) return;
    mobileNav.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    hamburgerBtn.setAttribute('aria-label', 'Open menu');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('nav-open');
    setBackgroundInert(false);
    document.removeEventListener('keydown', onKeydown);
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  function openMenu() {
    lastFocus = document.activeElement;
    mobileNav.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    hamburgerBtn.setAttribute('aria-label', 'Close menu');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.classList.add('nav-open');
    setBackgroundInert(true);
    document.addEventListener('keydown', onKeydown);
    const items = overlayFocusable();
    (items[0] || mobileNavClose || hamburgerBtn).focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeMenu();
      return;
    }
    if (e.key !== 'Tab') return;
    const items = overlayFocusable();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  hamburgerBtn.addEventListener('click', function () {
    if (mobileNav.classList.contains('active')) closeMenu();
    else openMenu();
  });
  if (mobileNavClose) mobileNavClose.addEventListener('click', closeMenu);
  Array.prototype.forEach.call(mobileNav.querySelectorAll('a'), function (link) {
    link.addEventListener('click', closeMenu);
  });
})();
