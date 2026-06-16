// src/js/pricing.js
// Toggle mensual / anual con descuento 20%
// Para cambiar precios, editá el objeto PRICES abajo

const PRICES = [
  {
    id: 'p0',
    monthly: '$15.000 <small>ARS</small>',
    annual:  '$144.000 <small>ARS</small>',
    periodMonthly: 'por mes',
    periodAnnual:  'por año · equiv. $12.000/mes',
  },
  {
    id: 'p1',
    monthly: '$28.000 <small>ARS</small>',
    annual:  '$268.800 <small>ARS</small>',
    periodMonthly: 'por mes',
    periodAnnual:  'por año · equiv. $22.400/mes',
  },
  {
    id: 'p2',
    monthly: '$35.000 <small>ARS</small>',
    annual:  '$336.000 <small>ARS</small>',
    periodMonthly: 'por mes',
    periodAnnual:  'por año · equiv. $28.000/mes',
  },
];

(function initPricing() {
  let annual = false;

  const toggleBtn = document.getElementById('toggleBtn');
  const thumb     = document.getElementById('thumb');
  const note      = document.getElementById('annualNote');

  if (!toggleBtn) return;

  function apply() {
    thumb.classList.toggle('on', annual);
    toggleBtn.setAttribute('aria-checked', annual);
    note.style.display = annual ? 'block' : 'none';

    PRICES.forEach(p => {
      const priceEl  = document.getElementById(p.id);
      const periodEl = document.getElementById(p.id.replace('p', 'pp'));
      if (priceEl)  priceEl.innerHTML   = annual ? p.annual  : p.monthly;
      if (periodEl) periodEl.textContent = annual ? p.periodAnnual : p.periodMonthly;
    });
  }

  toggleBtn.addEventListener('click', () => {
    annual = !annual;
    apply();
  });

  toggleBtn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      annual = !annual;
      apply();
    }
  });
})();
