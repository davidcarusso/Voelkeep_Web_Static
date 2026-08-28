// ============================================
// CONFIGURACIÓN CENTRALIZADA - VOELKEEP HOME
// ============================================

const CONFIG = {
  // Contacto
  phone: '+5491123387610',
  phoneFormatted: '+54 9 11 2338-7610',
  instagram: 'voelkeep',
  instagramUrl: 'https://www.instagram.com/voelkeep',
  
  // Ubicación
  address: 'Av. Bartolomé Mitre 4240, Villa Dominico, Buenos Aires',
  addressFull: 'Av. Bartolomé Mitre 4240, B1874 Villa Dominico, Provincia de Buenos Aires',
  coordinates: {
    lat: -34.68963435116331,
    lng: -58.3360788332687
  },
  mapUrl: 'https://maps.app.goo.gl/zQjmRhdwMuqtUgFz6',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3278.234567890123!2d-58.33828568477!3d-34.68963437294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccde8f0c5d4e7%3A0x8b5c3d2e1f4a6b9c!2sVoelkeep%20(Cosmetologia%20Estetica)!5e0!3m2!1ses-419!2sar!4v1696789012345!5m2!1ses-419!2sar',
  
  // Mensajes de WhatsApp
  messages: {
    general: 'Hola! Quiero consultar sobre los tratamientos de Voelkeep',
    agendar: 'Hola! Quiero agendar un turno para tratamiento facial',
    glossPeel: 'Hola! Quiero consultar sobre el tratamiento Gloss Peel',
    limpieza: 'Hola! Quiero consultar sobre la Limpieza Facial Profunda',
    ritual: 'Hola! Quiero consultar sobre el Ritual Corporal',
    giftCard: 'Hola! Quiero consultar sobre las Gift Cards de Voelkeep'
  }
};

// ============================================
// FUNCIONES AUXILIARES
// ============================================

// Generar URL de WhatsApp
function generateWhatsAppUrl(message) {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${CONFIG.phone.replace(/\D/g, '')}?text=${encodedMessage}`;
}

// ============================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  
  // 1. Configurar todos los enlaces de WhatsApp
  setupWhatsAppLinks();
  
  // 2. Configurar enlaces del footer
  setupFooterLinks();
  
  // 3. Configurar mapa
  setupMap();
  
  // 4. Animaciones al hacer scroll
  initScrollReveal();
  
  // 5. Smooth scroll para enlaces internos
  initSmoothScroll();
  
  // 6. Tracking de clicks en CTAs
  initCTATracking();
  
  console.log('✅ Voelkeep Home cargado correctamente');
});

// ============================================
// CONFIGURAR ENLACES DE WHATSAPP
// ============================================

function setupWhatsAppLinks() {
  // Botón flotante
  const whatsappBtn = document.getElementById('whatsappBtn');
  if (whatsappBtn) {
    whatsappBtn.href = generateWhatsAppUrl(CONFIG.messages.general);
  }
  
  // CTA Contacto hero
  const ctaContacto = document.getElementById('ctaContacto');
  if (ctaContacto) {
    ctaContacto.href = generateWhatsAppUrl(CONFIG.messages.agendar);
  }
  
  // CTA Final
  const ctaFinal = document.getElementById('ctaFinal');
  if (ctaFinal) {
    ctaFinal.href = generateWhatsAppUrl(CONFIG.messages.agendar);
  }
  
  // CTAs de servicios específicos
  const ctaLimpieza = document.querySelector('.cta-limpieza');
  if (ctaLimpieza) {
    ctaLimpieza.href = generateWhatsAppUrl(CONFIG.messages.limpieza);
  }
  
  const ctaRitual = document.querySelector('.cta-ritual');
  if (ctaRitual) {
    ctaRitual.href = generateWhatsAppUrl(CONFIG.messages.ritual);
  }
}

// ============================================
// CONFIGURAR FOOTER
// ============================================

function setupFooterLinks() {
  const footerPhone = document.getElementById('footerPhone');
  const footerWhatsapp = document.getElementById('footerWhatsapp');
  
  if (footerPhone) {
    footerPhone.href = generateWhatsAppUrl(CONFIG.messages.general);
    footerPhone.textContent = CONFIG.phoneFormatted;
  }
  
  if (footerWhatsapp) {
    footerWhatsapp.href = generateWhatsAppUrl(CONFIG.messages.general);
  }
  
  // Configurar teléfono en sección de ubicación
  const phoneLink = document.getElementById('phoneLink');
  if (phoneLink) {
    phoneLink.href = generateWhatsAppUrl(CONFIG.messages.general);
    phoneLink.textContent = CONFIG.phoneFormatted;
  }
  
  // Configurar dirección
  const addressText = document.getElementById('addressText');
  if (addressText) {
    addressText.textContent = CONFIG.addressFull;
  }
}

// ============================================
// CONFIGURAR MAPA
// ============================================

function setupMap() {
  const googleMap = document.getElementById('googleMap');
  const mapLoader = document.getElementById('mapLoader');
  
  if (!googleMap || !mapLoader) return;
  
  // Configurar handlers del mapa
  mapLoader.textContent = 'Cargando mapa...';
  googleMap.onload = function() {
    console.log('✅ Mapa cargado correctamente');
    mapLoader.style.display = 'none';
    googleMap.style.opacity = '1';
    googleMap.style.transition = 'opacity 0.5s ease';
  };
  
  googleMap.onerror = function() {
    console.error('❌ Error al cargar el mapa');
    mapLoader.textContent = 'No se pudo cargar el mapa. Haz clic aquí para ver en Google Maps';
    mapLoader.style.color = '#C94C7C';
    mapLoader.style.cursor = 'pointer';
    mapLoader.onclick = function() {
      window.open(CONFIG.mapUrl, '_blank');
    };
  };
  
  // Asignar URL del mapa
  try {
    googleMap.src = CONFIG.mapEmbedUrl;
    console.log('📍 Mapa configurado');
    
    // Timeout de fallback
    const fallbackTimeout = setTimeout(() => {
      if (mapLoader && mapLoader.style.display !== 'none') {
        const lat = CONFIG.coordinates.lat;
        const lng = CONFIG.coordinates.lng;
        if (lat && lng) {
          const fallbackUrl = `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
          console.warn('⚠️ Aplicando mapa de fallback');
          googleMap.src = fallbackUrl;
        }
      }
    }, 3000);
    
    // Limpiar timeout si el mapa carga
    const originalOnload = googleMap.onload;
    googleMap.onload = function() {
      clearTimeout(fallbackTimeout);
      if (typeof originalOnload === 'function') originalOnload();
    };
    
  } catch (err) {
    console.error('Error configurando mapa:', err);
  }
}

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
// TRACKING DE CTAs
// ============================================

function initCTATracking() {
  // Trackear clicks en todos los CTAs
  const allCTAs = document.querySelectorAll('[class*="cta"]');
  
  allCTAs.forEach(cta => {
    cta.addEventListener('click', function() {
      const ctaText = this.textContent.trim();
      const ctaClass = this.className;
      
      trackEvent('CTA Click', {
        buttonText: ctaText,
        className: ctaClass,
        section: getSection(this)
      });
    });
  });
  
  // Trackear hovers en cards de servicio
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach((card, index) => {
    card.addEventListener('mouseenter', function() {
      const serviceName = this.querySelector('h3').textContent;
      trackEvent('Service Card Hover', {
        service: serviceName,
        position: index + 1
      });
    });
  });
}

// ============================================
// FUNCIÓN DE TRACKING
// ============================================

function trackEvent(eventName, data) {
  // Logging en consola (desarrollo)
  console.log(`📊 Event: ${eventName}`, data);
  
  // Aquí podés agregar Google Analytics, Facebook Pixel, etc.
  // Ejemplo con Google Analytics 4:
  // if (typeof gtag !== 'undefined') {
  //   gtag('event', eventName, data);
  // }
  
  // Ejemplo con Facebook Pixel:
  // if (typeof fbq !== 'undefined') {
  //   fbq('track', eventName, data);
  // }
}

// ============================================
// UTILIDADES
// ============================================

// Obtener la sección donde está un elemento
function getSection(element) {
  const section = element.closest('section');
  if (section) {
    return section.className.split(' ')[0] || 'unknown';
  }
  return 'unknown';
}

// Detectar dispositivo móvil
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

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
// MOSTRAR MENSAJE PROMOCIONAL (Opcional)
// ============================================

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
// LAZY LOADING DE IMÁGENES
// ============================================

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
// COPIAR AL PORTAPAPELES
// ============================================

function copyToClipboard(text, successMessage = '¡Copiado!') {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showPromoMessage(successMessage, 2000);
    }).catch(err => {
      console.error('Error al copiar:', err);
    });
  } else {
    // Fallback para navegadores antiguos
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showPromoMessage(successMessage, 2000);
  }
}

// ============================================
// DETECTAR SCROLL PARA EFECTOS ADICIONALES
// ============================================

let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  // Aquí podrías agregar efectos adicionales basados en scroll
  // Por ejemplo, cambiar el estilo del botón de WhatsApp
  const whatsappBtn = document.querySelector('.whatsapp-float');
  if (whatsappBtn) {
    if (currentScroll > 300) {
      whatsappBtn.style.transform = 'scale(1)';
    } else {
      whatsappBtn.style.transform = 'scale(0.9)';
    }
  }
  
  lastScroll = currentScroll;
});

// ============================================
// MANEJO DE ERRORES GLOBAL
// ============================================

window.addEventListener('error', function(e) {
  console.error('Error capturado:', e.message);
  trackEvent('JavaScript Error', {
    message: e.message,
    file: e.filename,
    line: e.lineno
  });
});

// ============================================
// PERFORMANCE MONITORING
// ============================================

window.addEventListener('load', function() {
  // Medir performance de carga
  if (window.performance) {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    
    console.log(`⚡ Página cargada en ${pageLoadTime}ms`);
    
    trackEvent('Page Load', {
      loadTime: pageLoadTime,
      userAgent: navigator.userAgent,
      isMobile: isMobile()
    });
  }
  
  // Disparar evento personalizado
  const event = new CustomEvent('voelkeepLoaded', {
    detail: {
      timestamp: new Date(),
      config: CONFIG
    }
  });
  window.dispatchEvent(event);
});

// ============================================
// EXPORTAR FUNCIONES PARA USO EXTERNO
// ============================================

window.VoelkeepHome = {
  config: CONFIG,
  generateWhatsAppUrl: generateWhatsAppUrl,
  showPromoMessage: showPromoMessage,
  copyToClipboard: copyToClipboard,
  trackEvent: trackEvent
};

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
// VALIDACIÓN DE FORMULARIOS (Para futuras implementaciones)
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
        showPromoMessage('¡Formulario enviado! Te contactaremos pronto 🎉');
        form.reset();
      } else {
        showPromoMessage('Por favor completá todos los campos requeridos', 3000);
      }
    });
  });
}

// ============================================
// EASTER EGG (Opcional)
// ============================================

let clickCount = 0;
const logo = document.querySelector('.footer-brand h3');

if (logo) {
  logo.addEventListener('click', function() {
    clickCount++;
    if (clickCount === 5) {
      showPromoMessage('🎉 ¡Descubriste el easter egg! Desarrollado con ❤️ por SixSight Studio', 5000);
      clickCount = 0;
    }
  });
}

// ============================================
// DEBUG MODE
// ============================================

const DEBUG = false; // Cambiar a true para ver logs detallados

if (DEBUG) {
  console.log('=== VOELKEEP HOME DEBUG ===');
  console.log('Config:', CONFIG);
  console.log('User Agent:', navigator.userAgent);
  console.log('Screen:', window.innerWidth + 'x' + window.innerHeight);
  console.log('Mobile:', isMobile());
  console.log('Location:', window.location.href);
  
  // Resaltar elementos interactivos
  document.addEventListener('DOMContentLoaded', function() {
    const interactiveElements = document.querySelectorAll('a, button, [class*="cta"]');
    console.log(`Elementos interactivos: ${interactiveElements.length}`);
    
    if (DEBUG) {
      interactiveElements.forEach(el => {
        el.style.outline = '2px dashed rgba(201, 76, 124, 0.3)';
      });
    }
  });
}

// ============================================
// INICIALIZACIÓN FINAL
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('%c✨ VOELKEEP', 'color: #C94C7C; font-size: 28px; font-weight: bold;');
  console.log('%cCosmetología Profesional', 'color: #8B1E5A; font-size: 16px;');
  console.log('%cDesarrollado por SixSight Studio - UADE Team Two', 'color: #E88BA0; font-size: 12px;');
  
  if (DEBUG) {
    console.log('\n💡 Funciones disponibles en window.VoelkeepHome:');
    console.log('- showPromoMessage(message, duration)');
    console.log('- copyToClipboard(text, message)');
    console.log('- generateWhatsAppUrl(message)');
    console.log('- trackEvent(eventName, data)');
  }
});

// ============================================
// INTERACCIONES ADICIONALES
// ============================================

// Efecto parallax suave en el hero
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const heroContent = document.querySelector('.hero-content');
  
  if (heroContent && scrolled < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
    heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
  }
});

// Animación de números (para futuras estadísticas)
function animateNumber(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = Math.round(target);
      clearInterval(timer);
    } else {
      element.textContent = Math.round(current);
    }
  }, 16);
}

// Función para compartir en redes sociales
function shareOnSocialMedia(platform) {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent('Descubrí Voelkeep - Cosmetología Profesional 💎✨');
  
  let shareUrl = '';
  
  switch(platform) {
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      break;
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
      break;
    case 'whatsapp':
      shareUrl = `https://wa.me/?text=${text}%20${url}`;
      break;
    case 'linkedin':
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
      break;
  }
  
  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=400');
    trackEvent('Share Click', { platform: platform });
  }
}

// ============================================
// CONTADOR DE VISITAS (LocalStorage simulado con variables)
// ============================================

let pageViews = 0;

function incrementPageViews() {
  pageViews++;
  console.log(`📈 Vista #${pageViews} de esta sesión`);
}

// Incrementar al cargar
document.addEventListener('DOMContentLoaded', incrementPageViews);

// ============================================
// DETECCIÓN DE TIEMPO EN PÁGINA
// ============================================

let timeOnPage = 0;
let timeInterval;

window.addEventListener('load', function() {
  timeInterval = setInterval(() => {
    timeOnPage++;
    
    // Trackear cada 30 segundos
    if (timeOnPage % 30 === 0) {
      trackEvent('Time on Page', {
        seconds: timeOnPage,
        minutes: Math.floor(timeOnPage / 60)
      });
    }
  }, 1000);
});

window.addEventListener('beforeunload', function() {
  clearInterval(timeInterval);
  trackEvent('Page Exit', {
    totalTime: timeOnPage,
    minutes: Math.floor(timeOnPage / 60)
  });
});

// ============================================
// EJEMPLO DE USO DESDE LA CONSOLA
// ============================================

/*
  Para mostrar un mensaje promocional:
  VoelkeepHome.showPromoMessage('🎉 Promo especial: 20% OFF en tu primera sesión!', 8000);
  
  Para generar URL de WhatsApp personalizada:
  const url = VoelkeepHome.generateWhatsAppUrl('Hola! Quiero consultar por el pack de 4 sesiones');
  window.open(url, '_blank');
  
  Para copiar algo al portapapeles:
  VoelkeepHome.copyToClipboard('+54 9 11 2338-7610', '¡Teléfono copiado!');
  
  Para trackear un evento personalizado:
  VoelkeepHome.trackEvent('Custom Event', { data: 'value' });
  
  Para compartir en redes:
  shareOnSocialMedia('whatsapp');
*/

// ============================================
// FIN DEL SCRIPT
// ============================================
