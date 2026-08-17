(function () {
  function initSiteNav(document, window) {
    const page = document.querySelector('.page');
    const navPill = document.getElementById('navPill');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const TABINDEX_MARK = 'data-nav-tabindex';
    const focusableSelector = 'a[href], button:not([disabled])';

    if (navPill && window) {
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

    if (!hamburgerBtn || !mobileNav) {
      return null;
    }

    let lastFocus = null;

    function overlayFocusable() {
      return Array.prototype.slice.call(mobileNav.querySelectorAll(focusableSelector));
    }

    function backgroundRoots() {
      if (!page) return [];
      return Array.prototype.filter.call(page.children, function (child) {
        return child !== mobileNav;
      });
    }

    function supportsInert(node) {
      return node != null && 'inert' in node;
    }

    function focusableIn(root) {
      return Array.prototype.slice.call(root.querySelectorAll(focusableSelector));
    }

    function applyLegacyInert(root, open) {
      if (open) {
        root.setAttribute('aria-hidden', 'true');
        focusableIn(root).forEach(function (el) {
          if (!el.hasAttribute(TABINDEX_MARK)) {
            el.setAttribute(
              TABINDEX_MARK,
              el.hasAttribute('tabindex') ? el.getAttribute('tabindex') : '',
            );
          }
          el.setAttribute('tabindex', '-1');
        });
        return;
      }
      root.removeAttribute('aria-hidden');
      focusableIn(root).concat(
        Array.prototype.slice.call(root.querySelectorAll('[' + TABINDEX_MARK + ']')),
      ).forEach(function (el) {
        if (!el.hasAttribute(TABINDEX_MARK)) return;
        const previous = el.getAttribute(TABINDEX_MARK);
        if (previous === '') el.removeAttribute('tabindex');
        else el.setAttribute('tabindex', previous);
        el.removeAttribute(TABINDEX_MARK);
      });
    }

    function setBackgroundInert(open) {
      backgroundRoots().forEach(function (child) {
        if (supportsInert(child)) {
          child.inert = open;
          return;
        }
        applyLegacyInert(child, open);
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
      mobileNav.removeAttribute('aria-hidden');
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

    return {
      openMenu: openMenu,
      closeMenu: closeMenu,
      onKeydown: onKeydown,
    };
  }

  const hasDocument = typeof document !== 'undefined' && document.querySelector;
  if (hasDocument) {
    initSiteNav(document, window);
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initSiteNav: initSiteNav };
  }
})();
