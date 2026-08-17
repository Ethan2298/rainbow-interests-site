#!/usr/bin/env node
"use strict";

/**
 * Writes shared nav / overlay / footer into each HTML page from one template.
 * Vercel serves committed HTML (no build), so this script is the source of
 * truth: run it, then commit the generated files. Use --check to fail if HTML
 * has drifted from the template.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const PAGES = {
  "index.html": { nav: "standard", footer: "standard", current: "home" },
  "locations.html": { nav: "standard", footer: "standard", current: "locations" },
  "vision.html": { nav: "standard", footer: "standard", current: null },
  "contact.html": { nav: "standard", footer: "standard", current: "contact" },
  "privacy.html": {
    nav: "standard",
    footer: "standard",
    current: "privacy",
    trademark: true,
  },
  "terms.html": {
    nav: "standard",
    footer: "standard",
    current: "terms",
    trademark: true,
  },
  "quickbooks.html": {
    nav: "standard",
    footer: "standard",
    current: null,
    trademark: true,
  },
  "quickbooks-connect.html": {
    nav: "qb",
    footer: "connect",
    current: "qb",
    trademark: true,
  },
  "quickbooks-disconnect.html": {
    nav: "qb",
    footer: "disconnect",
    current: "qb",
    trademark: true,
  },
};

const TRADEMARK =
  "Intuit and QuickBooks are registered trademarks of Intuit Inc. Used with permission.";

const RAINBOW_PATHS = [
  '<path d="M 20 120 L 20 60 A 80 80 0 0 1 180 60 L 180 120" fill="none" stroke="#387FEF" stroke-width="16" stroke-linecap="square"/>',
  '<path d="M 44 120 L 44 60 A 56 56 0 0 1 156 60 L 156 120" fill="none" stroke="#FFE154" stroke-width="16" stroke-linecap="square"/>',
  '<path d="M 68 120 L 68 60 A 32 32 0 0 1 132 60 L 132 120" fill="none" stroke="#FF3F5A" stroke-width="16" stroke-linecap="square"/>',
];

function currentAttr(isCurrent) {
  return isCurrent ? ' aria-current="page"' : "";
}

function detectIndent(html) {
  const nav = html.match(/\n([ \t]*)<nav class="nav-outer"/);
  if (nav) return nav[1];
  const page = html.match(/\n([ \t]*)<div class="page">/);
  if (page) return page[1] + "  ";
  return "    ";
}

function line(indent, depth, text) {
  return indent + "  ".repeat(depth) + text;
}

function navLink(indent, depth, href, label, isCurrent) {
  return line(indent, depth, `<a href="${href}"${currentAttr(isCurrent)}>${label}</a>`);
}

function navMarkup(spec, indent) {
  const home = spec.current === "home";
  const locations = spec.current === "locations";
  const contact = spec.current === "contact";
  const qb = spec.current === "qb";
  const innerLinks =
    spec.nav === "qb"
      ? [navLink(indent, 3, "quickbooks.html", "QuickBooks Integration", qb)]
      : [
          navLink(indent, 3, "index.html", "Home", home),
          navLink(indent, 3, "locations.html", "Locations", locations),
        ];
  const overlayLinks =
    spec.nav === "qb"
      ? [
          navLink(indent, 1, "quickbooks.html", "QuickBooks Integration", qb),
          navLink(indent, 1, "contact.html", "Contact Us", contact),
        ]
      : [
          navLink(indent, 1, "index.html", "Home", home),
          navLink(indent, 1, "locations.html", "Locations", locations),
          navLink(indent, 1, "contact.html", "Contact Us", contact),
        ];

  const nav = [
    line(indent, 0, "<!-- site-nav -->"),
    line(indent, 0, '<nav class="nav-outer" aria-label="Primary navigation">'),
    line(indent, 1, '<div class="nav-pill" id="navPill">'),
    line(indent, 2, '<a href="index.html" class="nav-logo-group">'),
    line(indent, 3, '<img src="logo-dark.svg" alt="Rainbow Interests logo" class="nav-logo-img">'),
    line(indent, 3, '<span class="nav-brand">Rainbow Interests</span>'),
    line(indent, 2, "</a>"),
    line(indent, 2, '<div class="nav-links">'),
    ...innerLinks,
    line(indent, 2, "</div>"),
    line(
      indent,
      2,
      `<a href="contact.html" class="nav-get-started"${currentAttr(contact)}>Contact Us</a>`
    ),
    line(
      indent,
      2,
      '<button type="button" class="nav-hamburger" id="hamburgerBtn" aria-label="Open menu" aria-expanded="false" aria-controls="mobileNav">'
    ),
    line(indent, 3, "<span></span>"),
    line(indent, 2, "</button>"),
    line(indent, 1, "</div>"),
    line(indent, 0, "</nav>"),
    line(indent, 0, "<!-- /site-nav -->"),
  ].join("\n");

  const overlay = [
    line(indent, 0, "<!-- site-overlay -->"),
    line(
      indent,
      0,
      '<div class="mobile-nav-overlay" id="mobileNav" role="dialog" aria-modal="true" aria-label="Menu" aria-hidden="true">'
    ),
    ...overlayLinks,
    line(
      indent,
      1,
      '<button type="button" class="mobile-nav-close" id="mobileNavClose" aria-label="Close menu"></button>'
    ),
    line(indent, 0, "</div>"),
    line(indent, 0, "<!-- /site-overlay -->"),
  ].join("\n");

  return { nav, overlay };
}

function footerLinks(spec, indent) {
  const d = 3;
  if (spec.footer === "connect") {
    return [
      navLink(indent, d, "quickbooks.html", "QuickBooks Integration", spec.current === "qb"),
      navLink(indent, d, "privacy.html", "Privacy Policy", spec.current === "privacy"),
      navLink(indent, d, "terms.html", "Terms of Service", spec.current === "terms"),
    ];
  }
  if (spec.footer === "disconnect") {
    return [
      navLink(indent, d, "quickbooks.html", "QuickBooks Integration", spec.current === "qb"),
      navLink(indent, d, "quickbooks-connect.html", "Connect or reconnect", false),
      navLink(indent, d, "privacy.html", "Privacy Policy", spec.current === "privacy"),
      navLink(indent, d, "terms.html", "Terms of Service", spec.current === "terms"),
    ];
  }
  return [
    navLink(indent, d, "index.html", "Home", spec.current === "home"),
    navLink(indent, d, "locations.html", "Locations", spec.current === "locations"),
    navLink(indent, d, "contact.html", "Contact Us", spec.current === "contact"),
    navLink(indent, d, "privacy.html", "Privacy Policy", spec.current === "privacy"),
    navLink(indent, d, "terms.html", "Terms of Service", spec.current === "terms"),
  ];
}

function footerMarkup(spec, indent) {
  const trademark = spec.trademark
    ? "\n" + line(indent, 2, `<p class="trademark-notice">${TRADEMARK}</p>`)
    : "";
  return [
    line(indent, 0, "<!-- site-footer -->"),
    line(indent, 0, '<footer class="footer content-wrap">'),
    line(indent, 1, '<div class="footer-left">'),
    line(indent, 2, '<a href="index.html" class="footer-logo">'),
    line(indent, 3, '<svg viewBox="-20 -40 240 170" xmlns="http://www.w3.org/2000/svg">'),
    ...RAINBOW_PATHS.map((pathEl) => line(indent, 4, pathEl)),
    line(indent, 3, "</svg>"),
    line(indent, 3, "<span>Rainbow Interests</span>"),
    line(indent, 2, "</a>"),
    line(
      indent,
      2,
      '<p class="footer-desc">Rainbow Interests, LLC is a holding company supporting franchise operations where culture, autonomy, and performance converge.</p>'
    ),
    line(
      indent,
      2,
      '<address class="footer-address">Rainbow Interests, LLC<br>815 N. E. 2nd Ave<br>Suite #410<br>Fort Lauderdale, FL 33304<br><a href="tel:+17862239529">(786) 223-9529</a><br><a href="mailto:danny.figueroa@thenowmassage.com">danny.figueroa@thenowmassage.com</a></address>'
    ) + trademark,
    line(indent, 1, "</div>"),
    line(indent, 1, '<div class="footer-right">'),
    line(indent, 2, '<span class="footer-right-heading">Navigation</span>'),
    line(indent, 2, '<nav class="footer-nav" aria-label="Footer navigation">'),
    ...footerLinks(spec, indent),
    line(indent, 2, "</nav>"),
    line(indent, 1, "</div>"),
    line(indent, 0, "</footer>"),
    line(indent, 0, "<!-- /site-footer -->"),
  ].join("\n");
}

function replaceRegion(html, startMarker, endMarker, replacement) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker);
  if (start === -1 || end === -1 || end < start) {
    throw new Error(`Missing markers ${startMarker} / ${endMarker}`);
  }
  const lineStart = html.lastIndexOf("\n", start - 1) + 1;
  return html.slice(0, lineStart) + replacement + html.slice(end + endMarker.length);
}

function ensureMarkers(html) {
  if (html.includes("<!-- site-nav -->")) return html;
  html = html.replace(
    /([ \t]*)<nav class="nav-outer"[\s\S]*?<\/nav>/,
    (block, indent) => `${indent}<!-- site-nav -->\n${block}\n${indent}<!-- /site-nav -->`
  );
  html = html.replace(
    /([ \t]*)<div class="mobile-nav-overlay"[\s\S]*?<\/div>/,
    (block, indent) => `${indent}<!-- site-overlay -->\n${block}\n${indent}<!-- /site-overlay -->`
  );
  html = html.replace(
    /([ \t]*)<footer class="footer content-wrap">[\s\S]*?<\/footer>/,
    (block, indent) => `${indent}<!-- site-footer -->\n${block}\n${indent}<!-- /site-footer -->`
  );
  return html;
}

function applyToSource(html, spec) {
  const withMarkers = ensureMarkers(html);
  const indent = detectIndent(withMarkers);
  const { nav, overlay } = navMarkup(spec, indent);
  let next = withMarkers;
  next = replaceRegion(next, "<!-- site-nav -->", "<!-- /site-nav -->", nav);
  next = replaceRegion(next, "<!-- site-overlay -->", "<!-- /site-overlay -->", overlay);
  next = replaceRegion(next, "<!-- site-footer -->", "<!-- /site-footer -->", footerMarkup(spec, indent));
  return next;
}

function processFile(filename, checkOnly) {
  const spec = PAGES[filename];
  const filePath = path.join(ROOT, filename);
  const original = fs.readFileSync(filePath, "utf8");
  const updated = applyToSource(original, spec);
  if (original === updated) return false;
  if (!checkOnly) fs.writeFileSync(filePath, updated);
  return true;
}

function main() {
  const checkOnly = process.argv.includes("--check");
  const changed = [];
  for (const filename of Object.keys(PAGES)) {
    try {
      if (processFile(filename, checkOnly)) changed.push(filename);
    } catch (error) {
      console.error(`${filename}: ${error.message}`);
      process.exit(1);
    }
  }
  if (checkOnly) {
    if (changed.length) {
      console.error("Site chrome is out of date. Run: node scripts/apply-site-chrome.js");
      console.error(changed.join("\n"));
      process.exit(1);
    }
    console.log("Site chrome matches scripts/apply-site-chrome.js");
    return;
  }
  if (changed.length) console.log("Updated chrome in:\n" + changed.join("\n"));
  else console.log("Site chrome already up to date.");
}

module.exports = { PAGES, TRADEMARK, applyToSource, ensureMarkers };

if (require.main === module) {
  main();
}
