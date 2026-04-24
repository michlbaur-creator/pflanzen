/* Filter-Logik: Farbe, Lebensraum, Blühmonat.
   Läuft vollständig im Browser. Keine Server-Abfragen.
*/
(function () {
  const state = {
    farben: new Set(),
    bereiche: new Set(),
    monate: new Set(),
  };

  function toggleSet(set, value) {
    if (set.has(value)) set.delete(value); else set.add(value);
  }

  function matches(art) {
    if (state.farben.size > 0) {
      const hit = (art.farben || []).some(f => state.farben.has(f));
      if (!hit) return false;
    }
    if (state.bereiche.size > 0) {
      if (!state.bereiche.has(art.habitat)) return false;
    }
    if (state.monate.size > 0) {
      const hit = (art.monate || []).some(m => state.monate.has(m));
      if (!hit) return false;
    }
    return true;
  }

  function refresh() {
    const cards = document.querySelectorAll('.card');
    let shown = 0;
    cards.forEach(card => {
      const a = JSON.parse(card.dataset.art);
      if (matches(a)) {
        card.style.display = '';
        shown++;
      } else {
        card.style.display = 'none';
      }
    });
    document.getElementById('zaehler').textContent =
      shown === cards.length
        ? `Alle ${cards.length} Arten angezeigt`
        : `${shown} von ${cards.length} Arten passen zu Ihrer Auswahl`;
    document.getElementById('leer').style.display = shown === 0 ? '' : 'none';
  }

  function bindChips(selector, set, valueAttr, typeAttr) {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('click', () => {
        let v = el.dataset[valueAttr];
        if (typeAttr === 'number') v = parseInt(v, 10);
        toggleSet(set, v);
        el.classList.toggle('aktiv');
        refresh();
      });
    });
  }

  function reset() {
    state.farben.clear();
    state.bereiche.clear();
    state.monate.clear();
    document.querySelectorAll('.chip.aktiv').forEach(c => c.classList.remove('aktiv'));
    refresh();
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindChips('.chip.farbe',    state.farben,   'farbe',   'string');
    bindChips('.chip.bereich',  state.bereiche, 'bereich', 'string');
    bindChips('.chip.monat',    state.monate,   'monat',   'number');
    document.getElementById('reset').addEventListener('click', reset);
    refresh();
  });
})();
