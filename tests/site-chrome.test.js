const assert = require("node:assert/strict");
const test = require("node:test");
const { applyToSource, PAGES, TRADEMARK } = require("../scripts/apply-site-chrome");

const SHELL = `<!doctype html>
<html lang="en">
<body>
  <div class="page">
    <nav class="nav-outer" aria-label="Primary navigation">
      <div class="nav-pill" id="navPill">old</div>
    </nav>
    <div class="mobile-nav-overlay" id="mobileNav"></div>
    <main>content</main>
    <footer class="footer content-wrap">old</footer>
  </div>
</body>
</html>
`;

test("applyToSource is idempotent and wraps chrome in markers", () => {
  const first = applyToSource(SHELL, PAGES["index.html"]);
  const second = applyToSource(first, PAGES["index.html"]);
  assert.equal(first, second);
  assert.match(first, /^    <!-- site-nav -->$/m);
  assert.match(first, /<!-- \/site-nav -->/);
  assert.match(first, /<!-- site-overlay -->/);
  assert.match(first, /<!-- site-footer -->/);
  assert.match(first, /id="hamburgerBtn"/);
  assert.match(first, /id="mobileNavClose"/);
  assert.match(first, /aria-current="page">Home</);
  assert.match(first, /^    <nav class="nav-outer"/m);
});

test("standard chrome keeps marketing links and omits trademark", () => {
  const html = applyToSource(SHELL, PAGES["index.html"]);
  assert.match(html, /href="locations.html"/);
  assert.doesNotMatch(html, /QuickBooks Integration/);
  assert.doesNotMatch(html, new RegExp(TRADEMARK));
});

test("privacy footer marks the current page and includes the trademark", () => {
  const html = applyToSource(SHELL, PAGES["privacy.html"]);
  assert.match(html, new RegExp(TRADEMARK));
  assert.match(html, /aria-current="page">Privacy Policy</);
});

test("connect chrome uses the QuickBooks nav and connect footer", () => {
  const html = applyToSource(SHELL, PAGES["quickbooks-connect.html"]);
  assert.match(html, /QuickBooks Integration/);
  assert.doesNotMatch(html, /href="locations.html"/);
  assert.match(html, /href="privacy.html">Privacy Policy</);
  assert.doesNotMatch(html, /Connect or reconnect/);
});

test("disconnect footer links to the existing connect page", () => {
  const html = applyToSource(SHELL, PAGES["quickbooks-disconnect.html"]);
  assert.match(html, /href="quickbooks-connect.html">Connect or reconnect</);
  assert.match(html, new RegExp(TRADEMARK));
});
