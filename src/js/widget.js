// src/js/widget.js
// Asistente IA de Pronto POS
// Las llamadas a la API se hacen a /api/chat (serverless function en Vercel)
// Nunca expone la API key en el frontend

(function initWidget() {

  // ── TOUR CONFIG ──
  // Podés agregar, quitar o reordenar pasos acá
  const TOUR_STEPS = [
    {
      section: '#inicio',
      delay: 600,
      message: '👋 Empezamos por el inicio. Aquí está la propuesta principal: Pronto POS, un sistema pensado para bares y restaurantes argentinos. La idea es simple: tu bar, bajo control.',
    },
    {
      section: '#problemas',
      delay: 3500,
      message: '😤 Esta sección muestra los problemas típicos que tiene cualquier bar: comandas en papel, cierres manuales, sin datos reales y mozos que nadie puede llamar.',
    },
    {
      section: '#funciones',
      delay: 3500,
      message: '⚙️ Acá están las funciones del POS: mesas con drag & drop, arqueo inteligente, 4 métodos de pago, informes exportables y roles por usuario. Todo en español.',
    },
    {
      section: '#mesas',
      delay: 3500,
      message: '📱 Esta es la sección estrella: Mesas Inteligentes con QR. El cliente escanea y puede ver el menú, llamar al mozo, pedir más y pedir la cuenta, todo desde el celular. Sin app.',
    },
    {
      section: '#precios',
      delay: 3500,
      message: '💰 Tres planes: Starter ($15k/mes), Medium ($28k/mes) con IA que avisa, y Pro ($35k/mes) con IA que actúa. También podés ver precios anuales con 20% de descuento.',
    },
    {
      section: '#demo',
      delay: 3500,
      message: '🎯 Por último, la sección de demo. 30 minutos gratis, el sistema en vivo con tus productos reales. ¿Te quedó alguna duda o querés saber más sobre algún plan?',
    },
  ];

  // ── SUGGESTIONS ──
  const INITIAL_SUGGESTIONS = [
    '¿Qué incluye cada plan?',
    'Tour del sistema',
    '¿Qué son las Mesas QR?',
    '¿Cómo funciona el agente IA?',
  ];

  const FOLLOWUP_SUGGESTIONS = [
    '¿Cuál plan me conviene?',
    '¿Cómo es el onboarding?',
    'Quiero una demo',
    '¿Qué hace el agente IA Pro?',
  ];

  // ── STATE ──
  let isOpen    = false;
  let isLoading = false;
  const history = []; // { role: 'user'|'assistant', content: string }

  // ── DOM REFS ──
  const panel       = document.getElementById('ai-panel');
  const bubble      = document.getElementById('ai-bubble');
  const messagesEl  = document.getElementById('ai-messages');
  const inputEl     = document.getElementById('ai-input');
  const sendBtn     = document.getElementById('ai-send');
  const suggestionsEl = document.getElementById('ai-suggestions');

  if (!panel || !bubble) return; // Widget not in DOM

  // ── TOGGLE PANEL ──
  bubble.addEventListener('click', () => {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
    bubble.setAttribute('aria-expanded', isOpen);
    if (isOpen) inputEl.focus();
  });

  document.getElementById('ai-close')?.addEventListener('click', () => {
    isOpen = false;
    panel.classList.remove('open');
    bubble.setAttribute('aria-expanded', false);
    bubble.focus();
  });

  // ── MESSAGE HELPERS ──
  function addMsg(text, type) {
    const d = document.createElement('div');
    d.className = 'msg ' + type;
    d.innerHTML = text.replace(/\n/g, '<br>');
    messagesEl.appendChild(d);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return d;
  }

  function removeTyping() {
    messagesEl.querySelector('.typing')?.remove();
  }

  function setSuggestions(list) {
    suggestionsEl.innerHTML = '';
    suggestionsEl.style.display = 'flex';
    list.forEach(text => {
      const btn = document.createElement('button');
      btn.className = 'suggestion';
      btn.textContent = text;
      btn.addEventListener('click', () => handleSend(text));
      suggestionsEl.appendChild(btn);
    });
  }

  // ── SEND MESSAGE ──
  async function handleSend(text) {
    text = text.trim();
    if (!text || isLoading) return;

    // Hide suggestions while processing
    suggestionsEl.style.display = 'none';

    // Check for tour intent
    if (/tour/i.test(text)) {
      addMsg(text, 'user');
      inputEl.value = '';
      runTour();
      return;
    }

    isLoading = true;
    addMsg(text, 'user');
    inputEl.value = '';
    inputEl.style.height = 'auto';

    history.push({ role: 'user', content: text });

    const typing = addMsg('Escribiendo...', 'typing');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      removeTyping();

      if (!res.ok) {
        addMsg('Hubo un error de conexión. Intentá de nuevo o escribinos por WhatsApp.', 'bot');
      } else {
        const data = await res.json();
        const reply = data.reply || 'No pude procesar eso. Intentá de nuevo.';
        history.push({ role: 'assistant', content: reply });
        addMsg(reply, 'bot');
      }
    } catch (err) {
      removeTyping();
      addMsg('Sin conexión. Revisá tu internet o escribinos por WhatsApp.', 'bot');
    }

    setSuggestions(FOLLOWUP_SUGGESTIONS);
    isLoading = false;
  }

  // ── GUIDED TOUR ──
  function runTour() {
    addMsg('¡Vamos a hacer un tour por Pronto POS! Te llevo por cada sección. 🚀', 'bot');
    let step = 0;

    function next() {
      if (step >= TOUR_STEPS.length) {
        addMsg('¡Tour completado! ¿Tenés alguna pregunta sobre alguna sección o querés ver los precios?', 'bot');
        setSuggestions(FOLLOWUP_SUGGESTIONS);
        return;
      }

      const s = TOUR_STEPS[step];
      step++;

      setTimeout(() => {
        document.querySelector(s.section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
          const isLast = step >= TOUR_STEPS.length;
          const note = isLast ? '' : '\n\n<em style="color:#555;font-size:11px">Continuando en 3 segundos...</em>';
          addMsg(s.message + note, 'bot');
          if (!isLast) setTimeout(next, 3200);
          else setTimeout(next, 800);
        }, 600);
      }, step === 1 ? 400 : 0);
    }

    setTimeout(next, 800);
  }

  // ── INPUT EVENTS ──
  sendBtn.addEventListener('click', () => handleSend(inputEl.value));

  inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputEl.value);
    }
  });

  inputEl.addEventListener('input', () => {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 80) + 'px';
  });

  // ── INIT SUGGESTIONS ──
  setSuggestions(INITIAL_SUGGESTIONS);

})();
