(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     1. COUNTDOWN TIMER
     ────────────────────────────────────────────── */
  function initCountdown() {
    var banner = document.getElementById('countdown-banner');
    if (!banner) return;

    var targetDate = new Date(banner.dataset.targetDate).getTime();
    var timerEl = document.getElementById('countdown-timer');
    if (!timerEl || isNaN(targetDate)) return;

    function update() {
      var diff = Math.max(0, targetDate - Date.now());
      if (diff <= 0) {
        banner.style.display = 'none';
        return;
      }
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff / 3600000) % 24);
      var m = Math.floor((diff / 60000) % 60);
      var s = Math.floor((diff / 1000) % 60);
      timerEl.textContent = d > 0
        ? d + 'd ' + h + 'h ' + m + 'm ' + s + 's'
        : h + 'h ' + m + 'm ' + s + 's';
    }

    update();
    setInterval(update, 1000);
  }

  /* ─────────────────────────────────────────────
     2. FAQ ACCORDION
     ────────────────────────────────────────────── */
  function initFaq() {
    var toggles = document.querySelectorAll('.faq-toggle');
    toggles.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var parent = btn.parentElement;
        var answer = parent.querySelector('.faq-answer');
        var iconDown = btn.querySelector('.faq-icon-down');
        var iconUp = btn.querySelector('.faq-icon-up');
        var isOpen = btn.getAttribute('aria-expanded') === 'true';

        // Close all others
        toggles.forEach(function (other) {
          if (other === btn) return;
          other.setAttribute('aria-expanded', 'false');
          var otherAnswer = other.parentElement.querySelector('.faq-answer');
          var otherDown = other.querySelector('.faq-icon-down');
          var otherUp = other.querySelector('.faq-icon-up');
          if (otherAnswer) { otherAnswer.style.maxHeight = '0'; otherAnswer.style.opacity = '0'; }
          if (otherDown) otherDown.classList.remove('hidden');
          if (otherUp) otherUp.classList.add('hidden');
        });

        if (isOpen) {
          btn.setAttribute('aria-expanded', 'false');
          answer.style.maxHeight = '0';
          answer.style.opacity = '0';
          if (iconDown) iconDown.classList.remove('hidden');
          if (iconUp) iconUp.classList.add('hidden');
        } else {
          btn.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          answer.style.opacity = '1';
          if (iconDown) iconDown.classList.add('hidden');
          if (iconUp) iconUp.classList.remove('hidden');
        }
      });
    });
  }

  /* ─────────────────────────────────────────────
     3. PRODUCT TABS
     ────────────────────────────────────────────── */
  function initProductTabs() {
    var tabContainer = document.getElementById('product-tabs');
    var panelContainer = document.getElementById('product-tab-panels');
    if (!tabContainer || !panelContainer) return;

    var tabs = tabContainer.querySelectorAll('.product-tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var id = tab.dataset.tab;

        tabs.forEach(function (t) {
          t.classList.remove('border-b-2', 'border-[#66261E]');
        });
        tab.classList.add('border-b-2', 'border-[#66261E]');

        panelContainer.querySelectorAll('[data-tab-panel]').forEach(function (p) {
          p.classList.toggle('hidden', p.dataset.tabPanel !== id);
        });
      });
    });
  }

  /* ─────────────────────────────────────────────
     4. PLAN SELECTION (subscribe / one-time)
     ────────────────────────────────────────────── */
  var selectedPlan = 'subscribe';

  function initPlanSelection() {
    var planSubscribe = document.getElementById('plan-subscribe');
    var planOnetime = document.getElementById('plan-onetime');
    var subscribeExpand = document.getElementById('subscribe-expand');
    if (!planOnetime) return;

    function selectPlan(plan) {
      selectedPlan = plan;
      var isSubscribe = plan === 'subscribe';

      if (planSubscribe) {
        planSubscribe.classList.toggle('border-[#66261E]', isSubscribe);
        planSubscribe.classList.toggle('bg-[#F3E1DE]', isSubscribe);
        planSubscribe.classList.toggle('border-gray-200', !isSubscribe);
        planSubscribe.classList.toggle('bg-white', !isSubscribe);
        var sRadio = planSubscribe.querySelector('.plan-radio');
        var sDot = planSubscribe.querySelector('.plan-radio-dot');
        if (sRadio) {
          sRadio.classList.toggle('border-[#66261E]', isSubscribe);
          sRadio.classList.toggle('border-gray-400', !isSubscribe);
        }
        if (sDot) sDot.style.display = isSubscribe ? '' : 'none';
        if (subscribeExpand) subscribeExpand.style.display = isSubscribe ? '' : 'none';
      }

      planOnetime.classList.toggle('border-[#66261E]', !isSubscribe);
      planOnetime.classList.toggle('bg-[#F3E1DE]', !isSubscribe);
      planOnetime.classList.toggle('border-gray-200', isSubscribe);
      planOnetime.classList.toggle('bg-white', isSubscribe);
      var oRadio = planOnetime.querySelector('.plan-radio');
      var oDot = planOnetime.querySelector('.plan-radio-dot');
      if (oRadio) {
        oRadio.classList.toggle('border-[#66261E]', !isSubscribe);
        oRadio.classList.toggle('border-gray-400', isSubscribe);
      }
      if (oDot) {
        oDot.style.display = !isSubscribe ? '' : 'none';
      } else if (!isSubscribe) {
        var dot = document.createElement('span');
        dot.className = 'plan-radio-dot w-2.5 h-2.5 rounded-full bg-[#66261E]';
        if (oRadio) oRadio.appendChild(dot);
      }
    }

    if (planSubscribe) {
      planSubscribe.addEventListener('click', function () { selectPlan('subscribe'); });
    }
    planOnetime.addEventListener('click', function () { selectPlan('one-time'); });

    selectPlan(planSubscribe ? 'subscribe' : 'one-time');
  }

  /* ─────────────────────────────────────────────
     5. QUANTITY SELECTOR
     ────────────────────────────────────────────── */
  var qty = 1;

  function initQuantity() {
    var minus = document.getElementById('qty-minus');
    var plus = document.getElementById('qty-plus');
    var display = document.getElementById('qty-display');
    if (!minus || !plus || !display) return;

    if (display.dataset.qtyInit === 'true') {
      display.textContent = qty;
      return;
    }
    display.dataset.qtyInit = 'true';

    minus.addEventListener('click', function () {
      qty = Math.max(1, qty - 1);
      display.textContent = qty;
    });
    plus.addEventListener('click', function () {
      qty += 1;
      display.textContent = qty;
    });
  }

  /* ─────────────────────────────────────────────
     6. BUY NOW → Shopify Cart API → Checkout
     ────────────────────────────────────────────── */
  function initBuyNow() {
    var btn = document.getElementById('buy-now-btn');
    var errorEl = document.getElementById('product-error');
    if (!btn) return;

    if (btn.dataset.buyNowInit === 'true') return;
    btn.dataset.buyNowInit = 'true';

    btn.addEventListener('click', function () {
      btn.disabled = true;
      btn.textContent = 'Processing…';
      if (errorEl) { errorEl.textContent = ''; errorEl.classList.add('hidden'); }

      var activePlan = document.querySelector('.plan-option[data-plan="' + selectedPlan + '"]');
      if (!activePlan) {
        activePlan = document.querySelector('.plan-option');
      }
      var variantId = activePlan ? activePlan.dataset.variantId : null;

      if (!variantId) {
        showError('Product not found. Please refresh.');
        return;
      }

      var body = {
        items: [{
          id: parseInt(variantId, 10),
          quantity: qty
        }]
      };

      if (selectedPlan === 'subscribe') {
        var spSelect = document.getElementById('selling-plan-select');
        var sellingPlanId = activePlan.dataset.sellingPlanId;
        if (spSelect) sellingPlanId = spSelect.value;
        if (sellingPlanId) body.items[0].selling_plan = parseInt(sellingPlanId, 10);
      }

      fetch('/cart/clear.js', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
        .then(function () {
          return fetch('/cart/add.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });
        })
        .then(function (res) {
          if (!res.ok) return res.json().then(function (d) { throw new Error(d.description || 'Failed to add to cart'); });
          window.location.href = '/checkout';
        })
        .catch(function (err) {
          showError(err.message || 'Something went wrong');
        });

      function showError(msg) {
        btn.disabled = false;
        btn.textContent = 'Buy now';
        if (errorEl) {
          errorEl.textContent = msg;
          errorEl.classList.remove('hidden');
        }
      }
    });
  }

  /* ─────────────────────────────────────────────
     7. REVIEW CAROUSEL (dequeue / circular rotation)
     ────────────────────────────────────────────── */
  var _carouselAutoplayId = null;

  function initReviewCarousel() {
    var track = document.getElementById('review-carousel-track');
    var prevBtn = document.getElementById('review-carousel-prev');
    var nextBtn = document.getElementById('review-carousel-next');
    if (!track || !prevBtn || !nextBtn) return;

    // Clear any previous autoplay
    if (_carouselAutoplayId) {
      clearInterval(_carouselAutoplayId);
      _carouselAutoplayId = null;
    }

    // Image URLs passed from Liquid via window.__reviewImages
    var imgs = (window.__reviewImages || []).slice();
    if (imgs.length === 0) return;

    function render() {
      track.innerHTML = '';
      imgs.forEach(function (src) {
        var img = document.createElement('img');
        img.src = src;
        img.alt = 'Customer review';
        img.className = 'w-[380px] h-[480px] shrink-0 transition-all duration-300 hover:scale-[1.04] object-contain';
        track.appendChild(img);
      });
    }

    function moveLeft() {
      var first = imgs.shift();
      if (first !== undefined) imgs.push(first);
      render();
    }

    function moveRight() {
      var last = imgs.pop();
      if (last !== undefined) imgs.unshift(last);
      render();
    }

    function startAutoplay() {
      _carouselAutoplayId = setInterval(function () {
        moveRight();
      }, 3000);
    }

    function resetAutoplay() {
      clearInterval(_carouselAutoplayId);
      startAutoplay();
    }

    // Only bind click handlers once (use data attribute guard)
    if (!track.dataset.carouselInit) {
      track.dataset.carouselInit = 'true';
      prevBtn.addEventListener('click', function () {
        moveLeft();
        resetAutoplay();
      });
      nextBtn.addEventListener('click', function () {
        moveRight();
        resetAutoplay();
      });
    }

    // Initial render & start
    render();
    startAutoplay();
  }

  /* ─────────────────────────────────────────────
     INIT
     ────────────────────────────────────────────── */
  function initAll() {
    initCountdown();
    initFaq();
    initProductTabs();
    initPlanSelection();
    initQuantity();
    initBuyNow();
    initReviewCarousel();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll, { once: true });
  } else {
    initAll();
  }

  // Re-init when Shopify theme editor / dev server hot-reloads a section
  document.addEventListener('shopify:section:load', initAll);
})();
