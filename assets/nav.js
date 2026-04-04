/**
 * Primary nav: mega menus open on click (not hover).
 * Desktop: first click opens panel; second click on same label follows href to the collection page.
 * Mobile: tap toggles accordion; only one mega open at a time in the drawer.
 */
(function () {
  'use strict';

  var MQ_WIDE = '(min-width: 1101px)';

  function isWide() {
    return window.matchMedia(MQ_WIDE).matches;
  }

  function closeAllMegas() {
    document.querySelectorAll('.has-mega.mega-open').forEach(function (li) {
      li.classList.remove('mega-open');
      var t = li.querySelector(':scope > a');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }

  function initNav() {
    var burger = document.getElementById('navBurger');
    var nav = document.getElementById('navPrimary');
    if (!nav) return;

    if (burger) {
      burger.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (!open) closeAllMegas();
      });
    }

    document.querySelectorAll('.has-mega > a').forEach(function (link) {
      link.setAttribute('aria-haspopup', 'true');
      if (!link.getAttribute('aria-expanded')) link.setAttribute('aria-expanded', 'false');

      link.addEventListener('click', function (e) {
        var li = link.closest('.has-mega');
        if (!li) return;

        if (!isWide()) {
          e.preventDefault();
          var openThis = !li.classList.contains('mega-open');
          nav.querySelectorAll('.has-mega').forEach(function (other) {
            if (other !== li) {
              other.classList.remove('mega-open');
              var oa = other.querySelector(':scope > a');
              if (oa) oa.setAttribute('aria-expanded', 'false');
            }
          });
          if (openThis) li.classList.add('mega-open');
          else li.classList.remove('mega-open');
          link.setAttribute('aria-expanded', li.classList.contains('mega-open') ? 'true' : 'false');
          return;
        }

        if (li.classList.contains('mega-open')) {
          return;
        }
        e.preventDefault();
        closeAllMegas();
        li.classList.add('mega-open');
        link.setAttribute('aria-expanded', 'true');
      });
    });

    document.addEventListener('click', function (e) {
      if (!isWide()) return;
      if (e.target.closest('.site-header')) return;
      closeAllMegas();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      closeAllMegas();
      if (nav.classList.contains('is-open') && burger) {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });

    document.querySelectorAll('.mega a').forEach(function (a) {
      a.addEventListener('click', function () {
        closeAllMegas();
        nav.classList.remove('is-open');
        if (burger) burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();
