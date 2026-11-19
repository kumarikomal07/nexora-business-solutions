/* Nexora Business Solutions — site interactions */
(function () {
  "use strict";

  /* ------------------------------------------------------------
     CONFIGURATION — fill these in before going live
     ------------------------------------------------------------ */
  var CONFIG = {
    // Google Analytics 4 measurement ID, e.g. "G-XXXXXXXXXX". Loads only after analytics consent.
    gaId: "",
    // POST endpoint for the enquiry form (e.g. Formspree "https://formspree.io/f/xxxx").
    // Leave empty to run in demo mode (validates and shows a success message, sends nothing).
    enquiryEndpoint: "",
    // POST endpoint for newsletter sign-ups (e.g. Mailchimp/Brevo form action or a Formspree form).
    newsletterEndpoint: ""
  };

  var CONSENT_KEY = "nexora_consent";
  var CONSENT_MAX_AGE = 365 * 24 * 60 * 60 * 1000;

  document.documentElement.classList.add("js");
  var $ = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };

  /* ---------- Header shadow + back-to-top ---------- */
  var header = $(".site-header");
  var toTop = $(".to-top");
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 10);
    if (toTop) toTop.classList.toggle("show", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  /* ---------- Mobile navigation ---------- */
  var toggle = $(".nav-toggle");
  var nav = $("#main-nav");
  function setNav(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("nav-open", open);
  }
  if (toggle) toggle.addEventListener("click", function () { setNav(!nav.classList.contains("open")); });
  if (nav) nav.addEventListener("click", function (e) { if (e.target.closest("a")) setNav(false); });

  /* ---------- Services dropdown ---------- */
  $$(".has-dd").forEach(function (li) {
    var btn = $(".dd-toggle", li);
    btn.addEventListener("click", function () {
      var open = !li.classList.contains("open");
      li.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", function (e) {
      if (!li.contains(e.target)) { li.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    setNav(false);
    $$(".has-dd.open").forEach(function (li) {
      li.classList.remove("open");
      $(".dd-toggle", li).setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Text + scroll choreography ---------- */
  var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1. Split headings into masked words that slide up when they enter the viewport
  function splitWords(el) {
    var i = 0;
    function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var parts = child.textContent.split(/(\s+)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var w = document.createElement("span"); w.className = "w";
            var wi = document.createElement("span"); wi.className = "wi"; wi.style.setProperty("--i", i++);
            wi.textContent = part; w.appendChild(wi); frag.appendChild(w);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && !child.classList.contains("w")) {
          var block = window.getComputedStyle(child).display === "block";
          var wrap = document.createElement("span"); wrap.className = "w" + (block ? " block" : "");
          child.classList.add("wi"); child.style.setProperty("--i", i++);
          node.replaceChild(wrap, child); wrap.appendChild(child);
        }
      });
    }
    el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    walk(el);
    Array.prototype.forEach.call(el.children, function (c) { c.setAttribute("aria-hidden", "true"); });
    el.classList.add("split-text");
  }

  // 2. Containers whose children enter one after another
  var staggerParents = [".section-head", ".services-intro", ".ind-intro", ".story-intro", ".about-copy",
    ".svc-head > div:not(.split-img)", ".case-head > div:not(.split-img)", ".split > div:not(.split-img)",
    ".cta-inner > div:first-child", ".contact-info", ".approach-panel", ".prose", ".newsletter-block",
    ".about-text", ".case-feature-text", ".ind-row-text", ".article-hero .container", ".ind-box"];
  var directAdd = [".process-step", ".ind-row-img", ".article-cover", ".article-share", ".article-aside", ".ind-box", ".about-visual", ".case-feature-img", ".center-cta", ".steps li", ".faq-list details", ".footer-grid > *", ".why-visual", ".facts > div",
    ".chips", ".insight-card > :not(img)", ".form-card", ".map-box", ".filter-bar", ".svc-nav"];

  if (!calm) {
    $$(".hero h1, .page-hero h1, .article-hero h1, main h2").forEach(splitWords);

    staggerParents.forEach(function (sel) {
      $$(sel).forEach(function (box) {
        box.classList.remove("reveal");
        Array.prototype.forEach.call(box.children, function (c) {
          if (c.classList.contains("split-text") || c.tagName === "OL" && c.classList.contains("steps")) return;
          c.classList.add("reveal");
        });
      });
    });
    directAdd.forEach(function (sel) { $$(sel).forEach(function (el) { el.classList.add("reveal"); }); });

    // directions
    $$(".split > .split-img, .svc-head > .split-img, .case-head > .split-img, .mv-card, .duo > *").forEach(function (el) {
      el.classList.add("reveal", el.previousElementSibling ? "from-right" : "from-left");
    });
    $$(".why-visual, .contact-info, .about-visual, .case-feature-img, .ind-row-grid:not(.flip) > .ind-row-img").forEach(function (el) { el.classList.add("from-left"); });
    $$(".form-card, .ind-row-grid.flip > .ind-row-img, .article-aside").forEach(function (el) { el.classList.add("from-right"); });
    $$(".svc-card, .ind-tile, .featured-post, .metric, .value-card, .process-step, .post-card").forEach(function (el) { el.classList.add("zoom"); });

    // stagger siblings
    $$(".reveal").forEach(function (el) {
      var idx = 0, sib = el.previousElementSibling;
      while (sib) { if (sib.classList.contains("reveal")) idx++; sib = sib.previousElementSibling; }
      if (idx) el.style.transitionDelay = Math.min(idx * 90, 630) + "ms";
    });
  }

  // 3. Count-up numbers
  function countUp(el) {
    var m = el.textContent.trim().match(/^(\D*)(\d+)(\D*)$/);
    if (!m) return;
    var end = parseInt(m[2], 10), start = end >= 1900 ? end - 25 : 0, t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var k = Math.min(1, (ts - t0) / 1600), e = 1 - Math.pow(1 - k, 3);
      el.textContent = m[1] + Math.round(start + (end - start) * e) + m[3];
      if (k < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window && !calm) {
    var textObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        if (el.classList.contains("split-text")) el.classList.add("in");
        else countUp(el);
        textObs.unobserve(el);
      });
    }, { threshold: 0.3 });
    $$(".split-text, .facts strong, .metric strong, .why-stamp strong").forEach(function (el) { textObs.observe(el); });
  } else {
    $$(".split-text").forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Reveal on scroll ---------- */
  if ("IntersectionObserver" in window) {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var t = entry.target;
          t.classList.add("in"); revealer.unobserve(t);
          // drop the stagger delay afterwards so hover effects respond instantly
          setTimeout(function () { t.style.transitionDelay = ""; }, 1600);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach(function (el) { revealer.observe(el); });
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Image motion: reveal wipe + hover zoom + parallax ---------- */
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var motionSel = ".ind-row-img, .why-img, .about-photo, .case-feature-img, .split-img, .ind-tile, .ind-card-img, .story-img, .post-img, .about-img, .map-box, .article-cover, .insight-card";
  var parallaxSel = ".ind-row-img, .about-photo, .case-feature-img, .about-img, .split-img:not(.framed), .insight-card, .map-box, .ind-card-img";
  $$(motionSel).forEach(function (el) { el.classList.add("img-motion"); });
  $$(parallaxSel).forEach(function (el) { el.setAttribute("data-parallax", ""); });
  var watchIn = $$(".img-motion, .cta-band, .steps, .process");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var imgObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); imgObs.unobserve(entry.target); }
      });
    }, { threshold: 0.15 });
    watchIn.forEach(function (el) { imgObs.observe(el); });
  } else {
    watchIn.forEach(function (el) { el.classList.add("in"); });
  }

  // Parallax: hero banners and large images drift gently as you scroll
  var parallaxImgs = $$(".hero-media img, .page-hero-media img, [data-parallax] img, .insight-card > img").map(function (img) {
    var box = img.closest(".hero-media, .page-hero-media, [data-parallax]");
    return { img: img, box: box || img.parentElement, banner: !!img.closest(".hero-media, .page-hero-media") };
  });
  var progressEl = $(".scroll-progress");
  var ticking = false;
  function onFrame() {
    ticking = false;
    var vh = window.innerHeight;
    if (progressEl) {
      var max = document.documentElement.scrollHeight - vh;
      progressEl.style.setProperty("--progress", max > 0 ? Math.min(1, window.scrollY / max) : 0);
    }
    if (reduceMotion) return;
    parallaxImgs.forEach(function (p) {
      var r = p.box.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      var shift = p.banner ? window.scrollY * 0.18 : ((r.top + r.height / 2) - vh / 2) * -0.06;
      p.img.style.translate = "0 " + shift.toFixed(1) + "px";
    });
  }
  function requestFrame() { if (!ticking) { ticking = true; window.requestAnimationFrame(onFrame); } }
  window.addEventListener("scroll", requestFrame, { passive: true });
  window.addEventListener("resize", requestFrame);
  onFrame();

  /* ---------- Mouse-follow spotlight on cards ---------- */
  document.addEventListener("pointermove", function (e) {
    var card = e.target.closest && e.target.closest(".svc-card.dark, .process-step, .why-item, .post-card");
    if (!card) return;
    var r = card.getBoundingClientRect();
    card.style.setProperty("--mx", (e.clientX - r.left) + "px");
    card.style.setProperty("--my", (e.clientY - r.top) + "px");
  }, { passive: true });

  /* ---------- Legal page: highlight current section in TOC ---------- */
  var tocLinks = $$(".toc a[href^='#'], .toc-card a[href^='#']");
  if (tocLinks.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        tocLinks.forEach(function (a) { a.classList.toggle("current", a.getAttribute("href") === "#" + entry.target.id); });
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    tocLinks.forEach(function (a) { var t = document.getElementById(a.getAttribute("href").slice(1)); if (t) spy.observe(t); });
  }

  /* ---------- FAQ: one open at a time ---------- */
  var faqs = $$(".faq-list details");
  faqs.forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (d.open) faqs.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ---------- Insights filter ---------- */
  var filterBtns = $$(".filter-bar [data-filter]");
  var posts = $$("#post-grid .post-card");
  var emptyMsg = $(".filter-empty");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var f = btn.getAttribute("data-filter");
      filterBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      var shown = 0;
      posts.forEach(function (p) {
        var match = f === "all" || p.getAttribute("data-cat") === f;
        p.hidden = !match;
        if (match) { shown++; p.classList.add("in"); }
      });
      if (emptyMsg) emptyMsg.hidden = shown > 0;
    });
  });

  /* ---------- Form helpers ---------- */
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function send(endpoint, form) {
    if (!endpoint) return new Promise(function (resolve) { setTimeout(resolve, 500); }); // demo mode
    return fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
      .then(function (r) { if (!r.ok) throw new Error("Request failed"); });
  }

  /* Newsletter */
  $$(".subscribe-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = $("input[type=email]", form);
      var msg = $(".form-msg", form);
      var btn = $("button[type=submit]", form);
      if (!emailPattern.test(input.value.trim())) {
        msg.textContent = "Please enter a valid email address.";
        msg.classList.add("error");
        input.setAttribute("aria-invalid", "true");
        input.focus();
        return;
      }
      input.removeAttribute("aria-invalid");
      msg.classList.remove("error");
      btn.disabled = true;
      send(CONFIG.newsletterEndpoint, form).then(function () {
        msg.textContent = "Thank you. You're subscribed to Nexora Insights.";
        form.reset();
      }).catch(function () {
        msg.textContent = "Sorry, something went wrong. Please try again.";
        msg.classList.add("error");
      }).then(function () { btn.disabled = false; });
    });
  });

  /* Enquiry form */
  var enquiry = $("#enquiry-form");
  if (enquiry) {
    var params = new URLSearchParams(window.location.search);
    var svc = params.get("service");
    var select = $("#f-service", enquiry);
    if (svc && select.querySelector("option[value='" + svc.replace(/[^a-z]/g, "") + "']")) select.value = svc;
    if (params.get("type") === "consultation") {
      $("input[name=enquiry_type]", enquiry).value = "Consultation request";
      $("#form-title").textContent = "Book a free consultation";
      $("#f-message").placeholder = "Tell us about your goals and suggest a few dates and times that suit you";
    }

    var fields = $$("input, select, textarea", enquiry).filter(function (el) {
      return el.type !== "hidden" && el.name !== "website";
    });

    function check(el) {
      var v = el.type === "checkbox" ? el.checked : el.value.trim();
      var ok = true;
      if (el.required && !v) ok = false;
      else if (el.type === "email" && v && !emailPattern.test(v)) ok = false;
      else if (el.pattern && v && !new RegExp(el.pattern).test(v)) ok = false;
      else if (el.minLength > 0 && v && v.length < el.minLength) ok = false;
      var wrap = el.closest(".check-field") || el.closest(".field");
      wrap.classList.toggle("invalid", !ok);
      if (el.type !== "checkbox") el.setAttribute("aria-invalid", String(!ok));
      return ok;
    }
    fields.forEach(function (el) {
      el.addEventListener("blur", function () { if (el.value || el.closest(".invalid")) check(el); });
      el.addEventListener("change", function () { if (el.closest(".invalid")) check(el); });
    });

    enquiry.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = $(".form-status", enquiry);
      status.className = "form-status";
      var firstBad = null;
      fields.forEach(function (el) { if (!check(el) && !firstBad) firstBad = el; });
      if (firstBad) { firstBad.focus(); return; }
      if ($("input[name=website]", enquiry).value) return; // spam bot
      var btn = $("button[type=submit]", enquiry);
      btn.disabled = true;
      send(CONFIG.enquiryEndpoint, enquiry).then(function () {
        status.className = "form-status ok";
        status.textContent = "Thank you — your enquiry has been received. A member of our team will reply within one working day.";
        enquiry.reset();
      }).catch(function () {
        status.className = "form-status fail";
        status.textContent = "Sorry, we couldn't send your enquiry. Please email hello@nexora.co.uk or call +44 20 7123 4567.";
      }).then(function () { btn.disabled = false; });
    });
  }

  /* ---------- Cookie consent ---------- */
  var banner = $("#cookie-banner");
  var modal = $("#cookie-modal");

  function readConsent() {
    try {
      var c = JSON.parse(localStorage.getItem(CONSENT_KEY));
      if (c && Date.now() - c.ts < CONSENT_MAX_AGE) return c;
    } catch (err) { /* storage unavailable */ }
    return null;
  }
  function saveConsent(c) {
    c.ts = Date.now();
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify(c)); } catch (err) { /* ignore */ }
    applyConsent(c);
  }
  function applyConsent(c) {
    if (banner) banner.hidden = true;
    $$("[data-consent-status]").forEach(function (el) {
      el.textContent = !c ? "Not yet set" :
        "Essential" + (c.analytics ? " + Analytics" : "") + (c.marketing ? " + Marketing" : "") + " cookies allowed";
    });
    if (c && c.analytics) loadAnalytics();
    if (window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: c && c.analytics ? "granted" : "denied",
        ad_storage: c && c.marketing ? "granted" : "denied",
        ad_user_data: c && c.marketing ? "granted" : "denied",
        ad_personalization: c && c.marketing ? "granted" : "denied"
      });
    }
  }
  var gaLoaded = false;
  function loadAnalytics() {
    if (gaLoaded || !CONFIG.gaId) return;
    gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    window.gtag("js", new Date());
    window.gtag("config", CONFIG.gaId, { anonymize_ip: true });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(CONFIG.gaId);
    document.head.appendChild(s);
  }
  function openPrefs() {
    if (!modal) return;
    var c = readConsent() || {};
    modal.querySelector("[name=analytics]").checked = !!c.analytics;
    modal.querySelector("[name=marketing]").checked = !!c.marketing;
    if (typeof modal.showModal === "function") modal.showModal(); else modal.setAttribute("open", "");
  }
  function closePrefs() {
    if (!modal) return;
    if (typeof modal.close === "function") modal.close(); else modal.removeAttribute("open");
  }

  var existing = readConsent();
  if (existing) applyConsent(existing);
  else if (banner) { banner.hidden = false; applyConsent(null); banner.hidden = false; }

  document.addEventListener("click", function (e) {
    var prefs = e.target.closest("[data-cookie-prefs]");
    if (prefs) { e.preventDefault(); openPrefs(); return; }
    var act = e.target.closest("[data-consent]");
    if (!act) return;
    var type = act.getAttribute("data-consent");
    if (type === "accept") saveConsent({ analytics: true, marketing: true });
    else if (type === "reject") saveConsent({ analytics: false, marketing: false });
    else if (type === "save") saveConsent({
      analytics: modal.querySelector("[name=analytics]").checked,
      marketing: modal.querySelector("[name=marketing]").checked
    });
    closePrefs();
  });

  /* ---------- Footer year ---------- */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
