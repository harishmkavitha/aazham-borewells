/* =============================================================================
   Aazham Borewells — main.js  (V1)
   Progressive enhancement only. Every page stays readable and navigable with
   JavaScript disabled: menus fall back to hover/focus, links all resolve.
   ============================================================================= */
(function () {
  'use strict';

  var mq = window.matchMedia('(max-width: 1180px)');

  /* ---- mobile nav open/close ---- */
  var toggle = document.querySelector('.site-nav__toggle');
  var list = document.querySelector('.nav-list');


  /* Compact off-canvas drawer helpers for tablet/mobile. */
  var backdrop = null;
  var drawerClose = null;
  if (list) {
    var closeItem = document.createElement('li');
    closeItem.className = 'nav-drawer__close-item';
    closeItem.innerHTML = '<button class="nav-drawer__close" type="button"><span>← View webpage</span><span class="nav-drawer__close-symbol" aria-hidden="true">×</span></button>';
    list.insertBefore(closeItem, list.firstChild);
    drawerClose = closeItem.querySelector('.nav-drawer__close');

    backdrop = document.createElement('div');
    backdrop.className = 'nav-drawer-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(backdrop);
  }

  /* Keep dropdowns exactly below the sticky header on every viewport. */
  var nav = document.querySelector('.site-nav');
  var navMetricRaf = 0;
  function updateNavMenuTop() {
    if (!nav) return;
    var bottom = Math.max(0, Math.round(nav.getBoundingClientRect().bottom));
    document.documentElement.style.setProperty('--nav-menu-top', bottom + 'px');
  }
  function scheduleNavMetricUpdate() {
    if (navMetricRaf) return;
    navMetricRaf = window.requestAnimationFrame(function () {
      navMetricRaf = 0;
      updateNavMenuTop();
    });
  }
  updateNavMenuTop();
  window.addEventListener('resize', scheduleNavMetricUpdate, { passive: true });
  window.addEventListener('scroll', scheduleNavMetricUpdate, { passive: true });

  function closeMenu() {
    if (!list) return;
    list.classList.remove('is-open');
    document.body.classList.remove('nav-drawer-open');
    if (backdrop) backdrop.setAttribute('aria-hidden', 'true');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    document.querySelectorAll('.mega.is-open').forEach(function (m) {
      m.classList.remove('is-open');
      var b = m.previousElementSibling;
      if (b && b.classList.contains('nav-list__btn')) b.setAttribute('aria-expanded', 'false');
    });
  }

  if (toggle && list) {
    toggle.addEventListener('click', function () {
      updateNavMenuTop();
      var open = list.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('nav-drawer-open', open && mq.matches);
      if (backdrop) backdrop.setAttribute('aria-hidden', String(!(open && mq.matches)));
      if (!open) closeMenu();
    });
  }
  if (drawerClose) drawerClose.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  /* ---- dropdown buttons (accordion on mobile, click-toggle on desktop) ---- */
  document.querySelectorAll('.nav-list__btn').forEach(function (btn) {
    var mega = btn.nextElementSibling;
    if (!mega || !mega.classList.contains('mega')) return;

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      updateNavMenuTop();
      var isOpen = mega.classList.contains('is-open');
      // close siblings
      document.querySelectorAll('.mega.is-open').forEach(function (m) {
        if (m !== mega) {
          m.classList.remove('is-open');
          var b = m.previousElementSibling;
          if (b) b.setAttribute('aria-expanded', 'false');
        }
      });
      mega.classList.toggle('is-open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ---- close on outside click / escape ---- */
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.site-nav')) {
      document.querySelectorAll('.mega.is-open').forEach(function (m) {
        m.classList.remove('is-open');
        var b = m.previousElementSibling;
        if (b) b.setAttribute('aria-expanded', 'false');
      });
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMenu();
      if (toggle && list && !list.classList.contains('is-open')) toggle.focus();
    }
  });

  // Close navigation after choosing a submenu/menu link on compact layouts.
  document.querySelectorAll('.nav-list a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (mq.matches) closeMenu();
    });
  });

  // MatchMedia change listener with Safari fallback.
  if (mq.addEventListener) mq.addEventListener('change', closeMenu);
  else if (mq.addListener) mq.addListener(closeMenu);

  /* ---- depth-ruler reveal (home hero) ---- */
  var ruler = document.querySelector('.ruler');
  if (ruler) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ruler.classList.add('is-drawn');
    } else {
      window.requestAnimationFrame(function () {
        window.setTimeout(function () { ruler.classList.add('is-drawn'); }, 120);
      });
    }
  }

  /* ---- footer year ---- */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  /* ---- enquiry form ----
     Set the form's action to a form-service endpoint (Formspree, Basin, etc.)
     before launch. Until then this handler shows an inline success state and
     still directs people to phone / WhatsApp as the reliable fallback. */
  var form = document.querySelector('[data-ajax-form]');
  if (form) {
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var button = form.querySelector('[type="submit"]');
      var endpoint = form.getAttribute('action') || '';
      if (button) button.disabled = true;
      if (status) { status.removeAttribute('data-state'); status.textContent = 'Sending your enquiry…'; }

      if (!endpoint || endpoint.indexOf('example') !== -1) {
        // No live endpoint wired yet — acknowledge locally.
        window.setTimeout(function () {
          form.reset();
          if (status) { status.setAttribute('data-state', 'ok'); status.textContent = 'Thanks — your enquiry is noted. For a fast response, please also call or WhatsApp us.'; }
          if (button) button.disabled = false;
        }, 500);
        return;
      }

      fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (res) { if (!res.ok) throw new Error('bad'); form.reset();
          if (status) { status.setAttribute('data-state', 'ok'); status.textContent = 'Thanks — we have your enquiry and will call you back shortly.'; } })
        .catch(function () {
          if (status) { status.setAttribute('data-state', 'error'); status.textContent = 'That did not go through. Please call or WhatsApp us instead.'; } })
        .finally(function () { if (button) button.disabled = false; });
    });
  }
})();
