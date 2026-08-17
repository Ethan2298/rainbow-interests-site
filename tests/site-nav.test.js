const assert = require("node:assert/strict");
const test = require("node:test");
const { initSiteNav } = require("../site.js");

class TokenList {
  constructor() {
    this._items = new Set();
  }

  add(name) {
    this._items.add(name);
  }

  remove(name) {
    this._items.delete(name);
  }

  contains(name) {
    return this._items.has(name);
  }

  toggle(name, force) {
    if (force === undefined) {
      if (this._items.has(name)) {
        this._items.delete(name);
        return false;
      }
      this._items.add(name);
      return true;
    }
    if (force) this._items.add(name);
    else this._items.delete(name);
    return Boolean(force);
  }
}

function matches(el, selector) {
  const parts = selector.split(",").map((part) => part.trim());
  if (parts.length > 1) return parts.some((part) => matches(el, part));
  if (selector.startsWith(".")) return el.classList.contains(selector.slice(1));
  if (selector.startsWith("#")) return el.id === selector.slice(1);
  if (selector === "a") return el.tagName === "A";
  if (selector === "a[href]") return el.tagName === "A" && el.hasAttribute("href");
  if (selector === "button:not([disabled])") {
    return el.tagName === "BUTTON" && !el.hasAttribute("disabled");
  }
  if (selector.startsWith("[") && selector.endsWith("]")) {
    return el.hasAttribute(selector.slice(1, -1));
  }
  return el.tagName === selector.toUpperCase();
}

function walk(el, out) {
  el.children.forEach((child) => {
    out.push(child);
    walk(child, out);
  });
}

function createEl(document, tag) {
  const el = {
    tagName: tag.toUpperCase(),
    ownerDocument: document,
    children: [],
    parentNode: null,
    attributes: new Map(),
    classList: new TokenList(),
    id: "",
    href: "",
    listeners: Object.create(null),
    focus() {
      document.activeElement = el;
    },
    appendChild(child) {
      child.parentNode = el;
      el.children.push(child);
      if (child.id) document.byId.set(child.id, child);
      return child;
    },
    getAttribute(name) {
      return el.attributes.has(name) ? el.attributes.get(name) : null;
    },
    setAttribute(name, value) {
      el.attributes.set(name, String(value));
      if (name === "id") {
        el.id = String(value);
        document.byId.set(el.id, el);
      }
      if (name === "href") el.href = String(value);
    },
    hasAttribute(name) {
      return el.attributes.has(name);
    },
    removeAttribute(name) {
      el.attributes.delete(name);
    },
    querySelector(selector) {
      return el.querySelectorAll(selector)[0] || null;
    },
    querySelectorAll(selector) {
      const found = [];
      walk(el, found);
      return found.filter((node) => matches(node, selector));
    },
    addEventListener(type, fn) {
      (el.listeners[type] ||= []).push(fn);
    },
    removeEventListener(type, fn) {
      el.listeners[type] = (el.listeners[type] || []).filter((item) => item !== fn);
    },
    click() {
      (el.listeners.click || []).forEach((fn) => fn({ type: "click" }));
    },
  };
  return el;
}

function createDocument() {
  const document = {
    byId: new Map(),
    listeners: Object.create(null),
    activeElement: null,
    getElementById(id) {
      return document.byId.get(id) || null;
    },
    querySelector(selector) {
      return document.body.querySelector(selector);
    },
    addEventListener(type, fn) {
      (document.listeners[type] ||= []).push(fn);
    },
    removeEventListener(type, fn) {
      document.listeners[type] = (document.listeners[type] || []).filter((item) => item !== fn);
    },
    dispatchKey(key, shiftKey) {
      let prevented = false;
      const event = {
        key,
        shiftKey: Boolean(shiftKey),
        preventDefault() {
          prevented = true;
        },
      };
      (document.listeners.keydown || []).forEach((fn) => fn(event));
      return prevented;
    },
  };

  const body = createEl(document, "body");
  body.classList = new TokenList();
  document.body = body;

  const page = createEl(document, "div");
  page.classList.add("page");
  body.appendChild(page);

  const nav = createEl(document, "nav");
  const pill = createEl(document, "div");
  pill.setAttribute("id", "navPill");
  const home = createEl(document, "a");
  home.setAttribute("href", "index.html");
  const hamburger = createEl(document, "button");
  hamburger.setAttribute("id", "hamburgerBtn");
  hamburger.setAttribute("type", "button");
  hamburger.setAttribute("aria-expanded", "false");
  pill.appendChild(home);
  pill.appendChild(hamburger);
  nav.appendChild(pill);
  page.appendChild(nav);

  const overlay = createEl(document, "div");
  overlay.setAttribute("id", "mobileNav");
  overlay.setAttribute("aria-hidden", "true");
  const overlayHome = createEl(document, "a");
  overlayHome.setAttribute("href", "index.html");
  const overlayContact = createEl(document, "a");
  overlayContact.setAttribute("href", "contact.html");
  const closeBtn = createEl(document, "button");
  closeBtn.setAttribute("id", "mobileNavClose");
  overlay.appendChild(overlayHome);
  overlay.appendChild(overlayContact);
  overlay.appendChild(closeBtn);
  page.appendChild(overlay);

  const main = createEl(document, "main");
  const card = createEl(document, "a");
  card.setAttribute("href", "locations.html");
  main.appendChild(card);
  page.appendChild(main);

  const footer = createEl(document, "footer");
  const privacy = createEl(document, "a");
  privacy.setAttribute("href", "privacy.html");
  footer.appendChild(privacy);
  page.appendChild(footer);

  const windowObj = {
    scrollY: 0,
    addEventListener() {},
    requestAnimationFrame(fn) {
      fn();
    },
  };

  return {
    document,
    window: windowObj,
    page,
    nav,
    hamburger,
    overlay,
    overlayHome,
    closeBtn,
    home,
    card,
    privacy,
  };
}

test("open menu takes background links out of the tab order without inert", () => {
  const env = createDocument();
  initSiteNav(env.document, env.window);
  env.hamburger.focus();
  env.hamburger.click();

  assert.equal(env.overlay.classList.contains("active"), true);
  assert.equal(env.hamburger.getAttribute("aria-expanded"), "true");
  assert.equal(env.overlay.hasAttribute("aria-hidden"), false);
  assert.equal(env.document.body.classList.contains("nav-open"), true);
  assert.equal(env.document.activeElement, env.overlayHome);

  assert.equal(env.home.getAttribute("tabindex"), "-1");
  assert.equal(env.card.getAttribute("tabindex"), "-1");
  assert.equal(env.privacy.getAttribute("tabindex"), "-1");
  assert.equal(env.hamburger.getAttribute("tabindex"), "-1");
  assert.equal(env.overlayHome.hasAttribute("tabindex"), false);
  assert.equal(env.closeBtn.hasAttribute("tabindex"), false);
});

test("escape restores focus and background tab stops", () => {
  const env = createDocument();
  initSiteNav(env.document, env.window);
  env.hamburger.focus();
  env.hamburger.click();
  assert.equal(env.document.dispatchKey("Escape"), true);

  assert.equal(env.overlay.classList.contains("active"), false);
  assert.equal(env.hamburger.getAttribute("aria-expanded"), "false");
  assert.equal(env.overlay.getAttribute("aria-hidden"), "true");
  assert.equal(env.document.body.classList.contains("nav-open"), false);
  assert.equal(env.document.activeElement, env.hamburger);
  assert.equal(env.home.hasAttribute("tabindex"), false);
  assert.equal(env.card.hasAttribute("tabindex"), false);
  assert.equal(env.privacy.hasAttribute("tabindex"), false);
  assert.equal(env.home.hasAttribute("data-nav-tabindex"), false);
});

test("tab wraps inside the overlay", () => {
  const env = createDocument();
  initSiteNav(env.document, env.window);
  env.hamburger.click();
  env.closeBtn.focus();
  assert.equal(env.document.dispatchKey("Tab"), true);
  assert.equal(env.document.activeElement, env.overlayHome);

  env.overlayHome.focus();
  assert.equal(env.document.dispatchKey("Tab", true), true);
  assert.equal(env.document.activeElement, env.closeBtn);
});

test("inert-capable roots skip the tabindex fallback", () => {
  const env = createDocument();
  env.nav.inert = false;
  env.document.querySelector("main").inert = false;
  env.document.querySelector("footer").inert = false;
  initSiteNav(env.document, env.window);
  env.hamburger.click();

  assert.equal(env.nav.inert, true);
  assert.equal(env.document.querySelector("main").inert, true);
  assert.equal(env.home.hasAttribute("tabindex"), false);
});
