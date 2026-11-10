/* Integración para la portada de PRIMER partido. Cargar en su HTML, no en el iframe.
   Configurar origenApp EXACTO del iframe googleusercontent de ESTA implementación,
   iframe = elemento externo que carga DATOS, app = api_acceso_config().r.app.
   No usar comodines ni aceptar todos los subdominios googleusercontent.com.
   Al actualizar service worker conservar localStorage; iniciar directamente DATOS sin pase.
   La portada está en otro repositorio: este archivo es el relevo instalable. */
window.instalarSesionCaldeher = function (config) {
  'use strict';
  if (!config || !config.iframe || !/^https:\/\/[a-z0-9-]+\.googleusercontent\.com$/.test(config.origenApp) || !/^[A-Za-z0-9_-]{20}$/.test(config.app)) throw Error('Configuración de portada incompleta');
  const clave = 'cd_sesion_' + config.app;
  function recibe(e) {
    if (e.origin !== config.origenApp || !e.source || !e.data || e.data.tipo !== 'caldeher-sesion' || e.data.app !== config.app) return;
    // Apps Script envuelve el HtmlService en un iframe adicional.
    try { if (e.source !== config.iframe.contentWindow && e.source.parent !== config.iframe.contentWindow) return; } catch (_) { return; }
    const d = e.data;
    if (!/^[0-9-]{10,80}$/.test(d.nonce) || !['leer', 'guardar'].includes(d.op)) return;
    if (d.op === 'guardar' && d.token !== null && (typeof d.token !== 'string' || !/^D1\.[a-f0-9-]{36}\.\d{13}\.[A-Za-z0-9_-]{43}$/.test(d.token))) return;
    let token = null, guardado = false;
    try {
      if (d.op === 'guardar') { if (d.token) localStorage.setItem(clave, d.token); else localStorage.removeItem(clave); }
      token = localStorage.getItem(clave); guardado = true;
    } catch (_) {}
    e.source.postMessage({ tipo: 'caldeher-sesion-respuesta', nonce: d.nonce, token: d.op === 'leer' ? token : null, guardado: guardado }, config.origenApp);
  }
  window.addEventListener('message', recibe);
  try { const u = new URL(location.href); u.searchParams.delete('pase'); u.searchParams.delete('token'); history.replaceState(null, '', u.pathname + u.search + u.hash); } catch (_) {}
  return function () { window.removeEventListener('message', recibe); };
};
