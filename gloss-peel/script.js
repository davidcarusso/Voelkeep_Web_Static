// ============================================
// Voelkeep Landing - script.js (limpio y consolidado)
// ============================================

// CONFIGURACIÓN CENTRALIZADA
const CONFIG = {
  phone: '+5491123387610',
  phoneFormatted: '+54 9 11 2338-7610',
  instagram: 'voelkeep',
  instagramUrl: 'https://www.instagram.com/voelkeep',

  address: 'Av. Bartolomé Mitre 4240, Villa Dominico, Buenos Aires',
  addressFull: 'Av. Bartolomé Mitre 4240, B1874 Villa Dominico, Provincia de Buenos Aires',
  coordinates: {
    lat: -34.68963435116331,
    lng: -58.3360788332687
  },
  mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3278.234567890123!2d-58.33828568477!3d-34.68963437294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccde8f0c5d4e7%3A0x8b5c3d2e1f4a6b9c!2sVoelkeep%20(Cosmetologia%20Estetica)!5e0!3m2!1ses-419!2sar!4v1696789012345!5m2!1ses-419!2sar',
  mapsLink: 'https://goo.gl/maps/5RmZqoCyDr9caCu56',

  pricing: {
    sessionPrice: 35000,
    currency: '$',
    priceNote: '*Precio por sesión individual'
  },

  messages: {
    hero: 'Hola! Quiero agendar una sesión de Gloss Peel',
    pricing: 'Hola! Quiero consultar por Gloss Peel y agendar una sesión',
    general: 'Hola! Quiero consultar sobre los tratamientos de Voelkeep'
  }
};

// Set address text/link safely (call immediately and again on DOMContentLoaded)
function applyAddressText() {
  try {
    const addressText = document.getElementById('addressText');
    if (addressText) {
      addressText.textContent = CONFIG.addressFull || CONFIG.address;
      console.log('applyAddressText: addressText updated:', addressText.textContent);
    } else {
      console.log('applyAddressText: #addressText not found yet');
    }

    const addressLink = document.getElementById('addressLink');
    if (addressLink) {
      addressLink.href = CONFIG.mapsLink;
      console.log('applyAddressText: addressLink updated:', addressLink.href);
    }
  } catch (err) {
    console.error('applyAddressText error:', err);
  }
}

// Try to apply immediately in case script is loaded after body
applyAddressText();

// Log that the script executed and current location (useful on GitHub Pages)
console.log('script.js loaded — location.href=', location.href);

// Polling fallback: intenta varias veces si el elemento no está presente todavía
function pollApplyAddressText(retries = 10, interval = 200) {
  let attempts = 0;
  const id = setInterval(() => {
    attempts++;
    const el = document.getElementById('addressText');
    if (el) {
      el.textContent = CONFIG.addressFull || CONFIG.address;
      console.log(`pollApplyAddressText: success on attempt ${attempts}`);
      const link = document.getElementById('addressLink');
      if (link) link.href = CONFIG.mapsLink;
      clearInterval(id);
      return;
    }
    if (attempts >= retries) {
      console.warn('pollApplyAddressText: element #addressText not found after', attempts, 'attempts');
      clearInterval(id);
    } else {
      console.log('pollApplyAddressText: attempt', attempts, '— not found yet');
    }
  }, interval);
}

pollApplyAddressText(15, 250);

// UTILIDADES
function formatPrice(price) {
  return CONFIG.pricing.currency + price.toLocaleString('es-AR');
}

function generateWhatsAppUrl(message) {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${CONFIG.phone.replace(/\D/g, '')}?text=${encodedMessage}`;
}

// Init DOM
document.addEventListener('DOMContentLoaded', function() {
  // --- Precio
  const priceElement = document.getElementById('sessionPrice');
  if (priceElement) priceElement.textContent = formatPrice(CONFIG.pricing.sessionPrice);

  // --- Enlaces de WhatsApp y teléfonos
  const whatsappBtn = document.getElementById('whatsappBtn');
  const ctaHero = document.querySelector('.cta-hero');
  const ctaPricing = document.querySelector('.cta-pricing');
  const phoneLink = document.getElementById('phoneLink');
  const footerPhone = document.getElementById('footerPhone');
  const footerWhatsapp = document.getElementById('footerWhatsapp');

  if (whatsappBtn) whatsappBtn.href = generateWhatsAppUrl(CONFIG.messages.general);
  if (ctaHero) ctaHero.href = generateWhatsAppUrl(CONFIG.messages.hero);
  if (ctaPricing) ctaPricing.href = generateWhatsAppUrl(CONFIG.messages.pricing);
  if (phoneLink) { phoneLink.href = generateWhatsAppUrl(CONFIG.messages.general); phoneLink.textContent = CONFIG.phoneFormatted; }
  if (footerPhone) { footerPhone.href = generateWhatsAppUrl(CONFIG.messages.general); footerPhone.textContent = CONFIG.phoneFormatted; }
  if (footerWhatsapp) footerWhatsapp.href = generateWhatsAppUrl(CONFIG.messages.general);

  // --- Dirección
  const addressLink = document.getElementById('addressLink');
  if (addressLink) addressLink.href = CONFIG.mapsLink;
  const addressText = document.getElementById('addressText');
  if (addressText) addressText.textContent = CONFIG.addressFull || CONFIG.address;

  // --- Mapa: handlers, asignación de src con fallback
  const googleMap = document.getElementById('googleMap');
  const mapLoader = document.getElementById('mapLoader');

  if (googleMap && mapLoader) {
    mapLoader.textContent = 'Cargando mapa...';
    googleMap.style.opacity = '0';

    googleMap.onload = function() {
      console.log('Mapa cargado: onload fired');
      mapLoader.style.display = 'none';
      googleMap.style.opacity = '1';
      googleMap.style.transition = 'opacity 0.5s ease';
    };

    googleMap.onerror = function() {
      console.error('Error al cargar el iframe del mapa');
      mapLoader.textContent = 'No se pudo cargar el mapa. Contactanos por WhatsApp.';
      mapLoader.style.color = '#C94C7C';
    };

    try {
      googleMap.src = CONFIG.mapUrl;
      console.log('Map iframe src asignado desde CONFIG');

      const fallbackTimeout = setTimeout(() => {
        if (mapLoader && mapLoader.style.display !== 'none') {
          const lat = CONFIG.coordinates && CONFIG.coordinates.lat;
          const lng = CONFIG.coordinates && CONFIG.coordinates.lng;
          if (lat && lng) {
            const fallback = 'https://www.google.com/maps?q=' + lat + ',' + lng + '&z=16&output=embed';
            console.warn('Mapa principal no respondió: aplicando fallback:', fallback);
            googleMap.src = fallback;
          } else {
            console.warn('Mapa principal no respondió y no hay coordenadas para fallback');
          }
        }
      }, 3000);

      const originalOnload = googleMap.onload;
      googleMap.onload = function() {
        clearTimeout(fallbackTimeout);
        if (typeof originalOnload === 'function') originalOnload();
      };
    } catch (err) {
      console.error('Error asignando src al iframe del mapa:', err);
    }
  }

  // Animaciones y utilidades
  initScrollReveal();
  initSmoothScroll();
});

// ============================================
// ANIMACIONES AL HACER SCROLL
// ============================================

function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const revealPoint = 100;
    
    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      
      if (elementTop < windowHeight - revealPoint) {
        element.classList.add('revealed');
      }
    });
  };
  
  // Ejecutar al cargar
  revealOnScroll();
  
  // Ejecutar al hacer scroll (con throttle para performance)
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(revealOnScroll);
  });
}

// ============================================
// SMOOTH SCROLL
// ============================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Ignorar enlaces vacíos o solo con #
      if (href === '#' || href === '') {
        return;
      }
      
      e.preventDefault();
      
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ============================================
// DETECCIÓN DE DISPOSITIVO MÓVIL
// ============================================

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Si es móvil, ajustar el comportamiento del botón de WhatsApp
if (isMobile()) {
  document.addEventListener('DOMContentLoaded', function() {
    const whatsappBtn = document.getElementById('whatsappBtn');
    if (whatsappBtn) {
      // En móvil, abrir directamente WhatsApp sin tooltip
      whatsappBtn.style.cursor = 'pointer';
    }
  });
}

// ============================================
// PERFORMANCE: Lazy loading para el mapa
// ============================================

// Observer para cargar el mapa solo cuando esté visible
const mapObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const iframe = entry.target;
      if (!iframe.src) {
        iframe.src = CONFIG.mapUrl;
      }
      mapObserver.unobserve(iframe);
    }
  });
}, {
  rootMargin: '50px'
});

// Activar observer cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  const googleMap = document.getElementById('googleMap');
  if (googleMap) {
    mapObserver.observe(googleMap);
  }
});

// ============================================
// ANALYTICS Y TRACKING (Opcional)
// ============================================

// Función para trackear clicks en CTAs
function trackCTA(ctaName) {
  // Acá podés agregar Google Analytics, Facebook Pixel, etc.
  console.log(`CTA clicked: ${ctaName}`);
  
  // Ejemplo con Google Analytics (si lo tenés configurado):
  // gtag('event', 'click', {
  //   'event_category': 'CTA',
  //   'event_label': ctaName
  // });
}

// Agregar tracking a los botones principales
document.addEventListener('DOMContentLoaded', function() {
  const ctaHero = document.querySelector('.cta-hero');
  const ctaPricing = document.querySelector('.cta-pricing');
  const whatsappBtn = document.getElementById('whatsappBtn');
  
  if (ctaHero) {
    ctaHero.addEventListener('click', () => trackCTA('Hero Button'));
  }
  
  if (ctaPricing) {
    ctaPricing.addEventListener('click', () => trackCTA('Pricing Button'));
  }
  
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => trackCTA('WhatsApp Float Button'));
  }
});

// ============================================
// UTILIDADES ADICIONALES
// ============================================

// Función para cambiar el precio dinámicamente (útil para promociones)
function updatePrice(newPrice) {
  CONFIG.pricing.sessionPrice = newPrice;
  const priceElement = document.getElementById('sessionPrice');
  if (priceElement) {
    priceElement.textContent = formatPrice(newPrice);
    
    // Animación de cambio de precio
    priceElement.style.transform = 'scale(1.1)';
    priceElement.style.transition = 'transform 0.3s ease';
    setTimeout(() => {
      priceElement.style.transform = 'scale(1)';
    }, 300);
  }
}

// Función para mostrar un mensaje temporal (útil para promociones flash)
function showPromoMessage(message, duration = 5000) {
  const promo = document.createElement('div');
  promo.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #8B1E5A, #C94C7C);
    color: white;
    padding: 15px 30px;
    border-radius: 50px;
    box-shadow: 0 4px 20px rgba(139, 30, 90, 0.4);
    z-index: 9999;
    font-weight: 600;
    text-align: center;
    animation: slideDown 0.5s ease;
  `;

  promo.textContent = message;
  document.body.appendChild(promo);

  // Remover después del tiempo especificado
  setTimeout(() => {
    promo.style.animation = 'slideUp 0.5s ease';
    setTimeout(() => promo.remove(), 500);
  }, duration);
}

// Agregar animaciones CSS para el mensaje promo
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
  
  @keyframes slideUp {
    from {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    to {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
  }
`;
document.head.appendChild(style);

// ============================================
// PREVENCIÓN DE ERRORES COMUNES
// ============================================

// Prevenir que los enlaces vacíos recarguen la página
document.addEventListener('click', function(e) {
  const target = e.target.closest('a');
  if (target && (target.getAttribute('href') === '#' || target.getAttribute('href') === '')) {
    e.preventDefault();
  }
});

// ============================================
// MANEJO DE ERRORES GLOBAL
// ============================================

window.addEventListener('error', function(e) {
  console.error('Error capturado:', e.message);
  // Acá podrías enviar el error a un servicio de logging
});

// ============================================
// EXPORTAR FUNCIONES PARA USO EXTERNO
// ============================================

// Si necesitás usar estas funciones desde la consola o desde otros scripts
window.VoelkeepLanding = {
  config: CONFIG,
  updatePrice: updatePrice,
  showPromoMessage: showPromoMessage,
  formatPrice: formatPrice,
  generateWhatsAppUrl: generateWhatsAppUrl,
  trackCTA: trackCTA
};

// ============================================
// EJEMPLO DE USO DESDE LA CONSOLA DEL NAVEGADOR
// ============================================

/*
  Para cambiar el precio dinámicamente:
  VoelkeepLanding.updatePrice(40000);
  
  Para mostrar un mensaje promocional:
  VoelkeepLanding.showPromoMessage('🎉 Promo especial: 20% OFF en tu primera sesión!', 8000);
  
  Para generar una URL de WhatsApp personalizada:
  const url = VoelkeepLanding.generateWhatsAppUrl('Hola! Quiero consultar por el pack de 6 sesiones');
  window.open(url, '_blank');
*/

// ============================================
// DEBUG MODE (Activar solo en desarrollo)
// ============================================

const DEBUG = false; // Cambiar a true para ver logs en consola

if (DEBUG) {
  console.log('=== VOELKEEP LANDING PAGE DEBUG ===');
  console.log('Configuración:', CONFIG);
  console.log('Precio formateado:', formatPrice(CONFIG.pricing.sessionPrice));
  console.log('URL WhatsApp Hero:', generateWhatsAppUrl(CONFIG.messages.hero));
  console.log('Funciones disponibles en window.VoelkeepLanding');
  
  // Resaltar visualmente elementos con animaciones
  document.addEventListener('DOMContentLoaded', function() {
    const scrollElements = document.querySelectorAll('.scroll-reveal');
    console.log(`Elementos con animación al scroll: ${scrollElements.length}`);
    
    // Agregar borde de debug
    if (DEBUG) {
      scrollElements.forEach(el => {
        el.style.outline = '2px dashed rgba(201, 76, 124, 0.3)';
      });
    }
  });
}

// ============================================
// OPTIMIZACIONES DE PERFORMANCE
// ============================================

// Precargar fuentes críticas
const fontPreload = document.createElement('link');
fontPreload.rel = 'preload';
fontPreload.as = 'font';
fontPreload.type = 'font/woff2';
fontPreload.crossOrigin = 'anonymous';

// Usar Intersection Observer para lazy loading de imágenes (si las agregás después)
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    }
  });
}, {
  rootMargin: '50px'
});

// Activar lazy loading para imágenes con data-src
document.addEventListener('DOMContentLoaded', function() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  lazyImages.forEach(img => imageObserver.observe(img));
});

// ============================================
// EVENTOS PERSONALIZADOS
// ============================================

// Disparar evento cuando se carga todo el contenido
window.addEventListener('load', function() {
  const event = new CustomEvent('voelkeepLoaded', {
    detail: {
      timestamp: new Date(),
      config: CONFIG
    }
  });
  window.dispatchEvent(event);
  
  if (DEBUG) {
    console.log('Evento voelkeepLoaded disparado');
  }
});

// Escuchar cambios de precio (útil para integraciones)
document.addEventListener('priceUpdated', function(e) {
  if (DEBUG) {
    console.log('Precio actualizado:', e.detail);
  }
});

// ============================================
// FUNCIONALIDAD DE SCROLL PROGRESS (Opcional)
// ============================================

function initScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #8B1E5A, #C94C7C, #E88BA0);
    z-index: 9999;
    transition: width 0.1s ease;
  `;
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / documentHeight) * 100;
    progressBar.style.width = `${progress}%`;
  });
}

// Descomentar la siguiente línea para activar la barra de progreso
// document.addEventListener('DOMContentLoaded', initScrollProgress);

// ============================================
// MANEJO DE FORMULARIOS (Para futuras implementaciones)
// ============================================

function initFormHandling() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validación básica
      const inputs = form.querySelectorAll('input[required], textarea[required]');
      let isValid = true;
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = '#C94C7C';
        } else {
          input.style.borderColor = '';
        }
      });
      
      if (isValid) {
        // Acá iría la lógica de envío
        showPromoMessage('¡Formulario enviado! Te contactaremos pronto 🎉');
        form.reset();
      } else {
        showPromoMessage('Por favor completá todos los campos requeridos', 3000);
      }
    });
  });
}

// ============================================
// DETECCIÓN DE AD BLOCKERS (Opcional)
// ============================================

function detectAdBlock() {
  const testAd = document.createElement('div');
  testAd.innerHTML = '&nbsp;';
  testAd.className = 'adsbox';
  document.body.appendChild(testAd);
  
  window.setTimeout(() => {
    if (testAd.offsetHeight === 0) {
      if (DEBUG) {
        console.log('AdBlock detectado');
      }
    }
    testAd.remove();
  }, 100);
}

// ============================================
// INICIALIZACIÓN FINAL
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Activar funcionalidades opcionales
  // initScrollProgress(); // Descomentar si querés la barra de progreso
  // detectAdBlock(); // Descomentar si necesitás detectar ad blockers
  
  if (DEBUG) {
    console.log('✅ Landing page completamente cargada y funcional');
    console.log('💡 Tip: Usá window.VoelkeepLanding para acceder a funciones útiles');
  }
});

// ============================================
// COMPATIBILIDAD CON NAVEGADORES ANTIGUOS
// ============================================

// Polyfill para Array.forEach (IE11)
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function(callback, thisArg) {
    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

// Polyfill para Element.closest (IE11)
if (!Element.prototype.closest) {
  Element.prototype.closest = function(selector) {
    var el = this;
    while (el) {
      if (el.matches(selector)) return el;
      el = el.parentElement;
    }
    return null;
  };
}

// ============================================
// FIN DEL SCRIPT
// ============================================

// --- IGNORE ---

// function firmaEquipoUade() {
// // Mensajes de consola
// console.log('%c🌟 Voelkeep Web', 'color: #C94C7C; font-size: 20px; font-weight: bold;');
// console.log('%cDesarrollado por SixSight Studio - UADE Team Two', 'color: #8B1E5A; font-size: 12px;');
// console.log('%cEquipo:', 'color: #C94C7C; font-size: 14px; font-weight: bold;');
// console.log('%cCardoso, Tomas Francisco\nCarle, Santiago\nCarusso, David Ismael\nCáceres, Mariana\nCórdoba Bourilhon, Micaela\nDi Yorio, Juan', 'color: #8B1E5A; font-size: 12px;');

// }

// firmaEquipoUade();
