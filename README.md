# Pronto POS — Landing Page

Sitio de ventas para Pronto POS. Stack: HTML + CSS + JS puro. Deploy en Vercel.

## Estructura

```
pronto-pos-landing/
├── index.html          # Página principal
├── src/
│   ├── css/
│   │   └── styles.css  # Todos los estilos
│   └── js/
│       ├── pricing.js  # Toggle mensual/anual
│       └── widget.js   # Asistente IA
├── public/
│   └── logo.svg        # Logo (reemplazar)
├── vercel.json         # Config de Vercel
└── .env.example        # Variables de entorno
```

## Setup local

Abrí `index.html` directamente en el browser. No necesita build.

## Deploy en Vercel

1. Subí el repo a GitHub
2. Conectá el repo en vercel.com → New Project
3. Framework Preset: **Other**
4. Agregá la variable de entorno:
   - `ANTHROPIC_API_KEY` = tu clave de Anthropic

> El widget de IA llama a la API directamente desde el browser.
> La API key se inyecta en el HTML via Vercel Edge Function (ver `api/chat.js`).

## Variables de entorno

```
ANTHROPIC_API_KEY=sk-ant-...
WHATSAPP_NUMBER=5492646000000
```

## Personalización rápida

- **Precios**: `src/js/pricing.js` → objeto `PRICES`
- **Texto del asistente IA**: `src/js/widget.js` → constante `SYSTEM_PROMPT`
- **Colores**: `src/css/styles.css` → bloque `:root { --orange: ... }`
- **WhatsApp**: `index.html` → buscar `wa.me/` y reemplazar número
