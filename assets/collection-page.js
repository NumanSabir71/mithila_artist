(function () {
  if (!window.COLLECTION) return;

  var cfg = window.COLLECTION;
  var params = new URLSearchParams(window.location.search);
  var activeFilter = params.get('f') || 'all';
  var filterIds = cfg.filters.map(function (x) { return x.id; });
  var rawF = params.get('f');
  if (rawF && filterIds.indexOf(rawF) === -1) {
    activeFilter = 'all';
    var clean = new URL(window.location.href);
    clean.searchParams.delete('f');
    history.replaceState(null, '', clean.pathname + clean.search);
  } else if (filterIds.indexOf(activeFilter) === -1) {
    activeFilter = 'all';
  }

  var grid = document.getElementById('productGrid');
  var filterRoot = document.getElementById('filterChips');
  if (!grid || !filterRoot) return;

  cfg.filters.forEach(function (f) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'filter-chip';
    btn.setAttribute('data-f', f.id);
    btn.textContent = f.label;
    var isAll = f.id === 'all' && activeFilter === 'all';
    if (isAll || f.id === activeFilter) btn.classList.add('active');
    btn.addEventListener('click', function () {
      activeFilter = f.id;
      filterRoot.querySelectorAll('.filter-chip').forEach(function (b) {
        b.classList.toggle('active', b.getAttribute('data-f') === activeFilter);
      });
      render();
      var u = new URL(window.location.href);
      if (activeFilter === 'all') u.searchParams.delete('f');
      else u.searchParams.set('f', activeFilter);
      history.replaceState(null, '', u.pathname + u.search);
    });
    filterRoot.appendChild(btn);
  });

  function render() {
    grid.innerHTML = '';
    var list = cfg.products.filter(function (p) {
      if (activeFilter === 'all') return true;
      if (Array.isArray(p.f)) return p.f.indexOf(activeFilter) !== -1;
      return p.f === activeFilter;
    });
    if (!list.length) {
      grid.innerHTML = '<p class="empty-msg">No pieces in this filter yet. Try &ldquo;All&rdquo; or another category.</p>';
      return;
    }
    list.forEach(function (p, i) {
      var a = document.createElement('a');
      a.href = p.href || 'productdetail.html';
      a.className = 'prod-card-shop rv d' + ((i % 4) + 1);
      a.innerHTML =
        '<div class="thumb"><img src="' +
        p.img +
        '" alt="" onerror="this.onerror=null;this.src=\'' +
        (p.fb || '') +
        '\'"></div><div class="meta"><div class="tag">' +
        (p.tag || '') +
        '</div><div class="name">' +
        p.name +
        '</div><div class="price">' +
        p.price +
        '</div></div>';
      grid.appendChild(a);
    });
    requestAnimationFrame(function () {
      grid.querySelectorAll('.rv').forEach(function (el, j) {
        setTimeout(function () {
          el.classList.add('on');
        }, j * 40);
      });
    });
  }

  render();
})();
