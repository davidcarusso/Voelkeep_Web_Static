// ============================================
// CONFIGURACIÓN CENTRALIZADA - GIFT CARDS
// ============================================

const CONFIG = {
  // Contacto
  phone: '+5491123387610',
  phoneFormatted: '+54 9 11 2338-7610',
  instagram: 'voelkeep',
  instagramUrl: 'https://www.instagram.com/voelkeep',
  
  // Ubicación
  address: 'Av. Bartolomé Mitre 4240, Villa Dominico, Buenos Aires',
  
  // Mensajes de WhatsApp por tratamiento
  messages: {
    hero: 'Hola! Quiero consultar por las Gift Cards de Voelkeep',
    'Glow Peel': 'Hola! Quiero regalar una Gift Card de Glow Peel ✨',
    'Facial Profunda': 'Hola! Quiero regalar una Gift Card de Higiene Facial Profunda 💎',
    'Peeling': 'Hola! Quiero regalar una Gift Card de Peeling 🌟',
    'Ritual Corporal': 'Hola! Quiero regalar una Gift Card de Ritual Corporal 💆‍♀️',
    'Personalizada': 'Hola! Quiero crear una Gift Card personalizada con el monto que elijo 🎨',
    'Final': 'Hola! Quiero más información sobre las Gift Cards de Voelkeep'
  },
  
  // Validez de las gift cards
  validity: {
    days: 30,
    text: 'Válido por 30 días desde la fecha de compra'
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
  
  // 3. Animaciones al hacer scroll
  initScrollReveal();
  
  // 4. Smooth scroll para enlaces internos
  initSmoothScroll();
  
  // 5. Tracking de clicks en CTAs
  initCTATracking();
});

// ============================================
// CONFIGURAR ENLACES DE WHATSAPP
// ============================================

function setupWhatsAppLinks() {
  // Botón flotante
  const whatsappBtn = document.getElementById('whatsappBtn');
  if (whatsappBtn) {
    whatsappBtn.href = generateWhatsAppUrl(CONFIG.messages.hero);
  }
  
  // CTA Hero
  const ctaHero = document.querySelector('.cta-hero');
  if (ctaHero) {
    ctaHero.href = generateWhatsAppUrl(CONFIG.messages.hero);
  }
  
  // CTAs de tratamientos individuales
  const treatmentCTAs = document.querySelectorAll('.treatment-cta');
  treatmentCTAs.forEach(cta => {
    const treatment = cta.getAttribute('data-treatment');
    if (treatment && CONFIG.messages[treatment]) {
      cta.href = generateWhatsAppUrl(CONFIG.messages[treatment]);
    }
  });
  
  // CTA Gift Card personalizada
  const customCTA = document.querySelector('.custom-cta');
  if (customCTA) {
    customCTA.href = generateWhatsAppUrl(CONFIG.messages['Personalizada']);
  }
  
  // CTA Final
  const ctaFinal = document.querySelector('.cta-final');
  if (ctaFinal) {
    ctaFinal.href = generateWhatsAppUrl(CONFIG.messages['Final']);
  }
}

// ============================================
// CONFIGURAR FOOTER
// ============================================

function setupFooterLinks() {
  const footerPhone = document.getElementById('footerPhone');
  const footerWhatsapp = document.getElementById('footerWhatsapp');
  
  if (footerPhone) {
    footerPhone.href = generateWhatsAppUrl(CONFIG.messages.hero);
    footerPhone.textContent = CONFIG.phoneFormatted;
  }
  
  if (footerWhatsapp) {
    footerWhatsapp.href = generateWhatsAppUrl(CONFIG.messages.hero);
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
      const treatment = this.getAttribute('data-treatment') || 'General';
      
      trackEvent('CTA Click', {
        treatment: treatment,
        buttonText: ctaText,
        section: getSection(this)
      });
    });
  });
  
  // Trackear clicks en tratamientos
  const treatmentCards = document.querySelectorAll('.treatment-card');
  treatmentCards.forEach((card, index) => {
    card.addEventListener('mouseenter', function() {
      const treatmentName = this.querySelector('h3').textContent;
      trackEvent('Treatment Card Hover', {
        treatment: treatmentName,
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
  
  // Acá podés agregar Google Analytics, Facebook Pixel, etc.
  // Ejemplo con Google Analytics 4:
  // gtag('event', eventName, data);
  
  // Ejemplo con Facebook Pixel:
  // fbq('track', eventName, data);
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
// MANEJO DE ERRORES DE IMÁGENES
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  const giftcardImage = document.querySelector('.giftcard-image');
  
  if (giftcardImage) {
    // Si la imagen no carga, usar placeholder SVG
    giftcardImage.addEventListener('error', function() {
      console.warn('⚠️ Gift card image not found, using placeholder');
      
      // El placeholder SVG ya está en el atributo onerror del HTML
      // pero podemos añadir lógica adicional acá si es necesario
      
      trackEvent('Image Load Error', {
        image: 'giftcard-front',
        fallback: 'svg-placeholder'
      });
    });
    
    // Cuando cargue correctamente
    giftcardImage.addEventListener('load', function() {
      console.log('✅ Gift card image loaded successfully');
    });
  }
});

// ============================================
// ANIMACIÓN HOVER EN CARDS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  const treatmentCards = document.querySelectorAll('.treatment-card');
  
  treatmentCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(-10px)';
    });
  });
});

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
// COUNTDOWN PARA PROMOCIONES (Opcional)
// ============================================

function startCountdown(endDate, elementId) {
  const countdownElement = document.getElementById(elementId);
  if (!countdownElement) return;
  
  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = new Date(endDate).getTime() - now;
    
    if (distance < 0) {
      countdownElement.innerHTML = "¡Promoción finalizada!";
      return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };
  
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// Ejemplo de uso (descomentar para activar):
// startCountdown('2025-12-31', 'countdown-timer');

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
// SHARE BUTTONS (Para compartir en redes)
// ============================================

function shareOnSocialMedia(platform) {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent('¡Mirá estas Gift Cards de Voelkeep! El regalo perfecto 🎁✨');
  
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
// LAZY LOADING DE IMÁGENES ADICIONALES
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
// DETECTAR SCROLL PARA ANIMACIONES ADICIONALES
// ============================================

let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  // Ocultar/mostrar header al hacer scroll (si existe)
  if (header) {
    if (currentScroll > lastScroll && currentScroll > 100) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
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
      userAgent: navigator.userAgent
    });
  }
});

// ============================================
// EXPORTAR FUNCIONES PARA USO EXTERNO
// ============================================

window.VoelkeepGiftCard = {
  config: CONFIG,
  generateWhatsAppUrl: generateWhatsAppUrl,
  showPromoMessage: showPromoMessage,
  shareOnSocialMedia: shareOnSocialMedia,
  copyToClipboard: copyToClipboard,
  trackEvent: trackEvent
};

// ============================================
// EASTER EGG (Opcional - para debugging)
// ============================================

let clickCount = 0;
const logo = document.querySelector('.footer-brand h3');

if (logo) {
  logo.addEventListener('click', function() {
    clickCount++;
    if (clickCount === 5) {
      showPromoMessage('🎉 ¡Descubriste el easter egg! Desarrollado por SixSight Studio', 5000);
      clickCount = 0;
    }
  });
}

// ============================================
// DEBUG MODE
// ============================================

const DEBUG = false; // Cambiar a true para ver logs

if (DEBUG) {
  console.log('=== VOELKEEP GIFT CARD DEBUG ===');
  console.log('Config:', CONFIG);
  console.log('User Agent:', navigator.userAgent);
  console.log('Screen:', window.innerWidth + 'x' + window.innerHeight);
  console.log('Mobile:', isMobile());
  
  // Resaltar elementos interactivos
  document.addEventListener('DOMContentLoaded', function() {
    const interactiveElements = document.querySelectorAll('a, button, [class*="cta"]');
    console.log(`Elementos interactivos: ${interactiveElements.length}`);
    
    if (DEBUG) {
      interactiveElements.forEach(el => {
        el.style.outline = '2px dashed rgba(201, 76, 124, 0.5)';
      });
    }
  });
}

// ============================================
// INICIALIZACIÓN FINAL
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('%c🎁 Voelkeep Gift Cards', 'color: #C94C7C; font-size: 24px; font-weight: bold;');
  console.log('%c✨ Regala Bienestar', 'color: #8B1E5A; font-size: 16px;');
  console.log('%cDesarrollado por SixSight Studio - UADE Team Two', 'color: #E88BA0; font-size: 12px;');
  
  if (DEBUG) {
    console.log('\n💡 Funciones disponibles en window.VoelkeepGiftCard');
    console.log('- showPromoMessage(message, duration)');
    console.log('- shareOnSocialMedia(platform)');
    console.log('- copyToClipboard(text, message)');
    console.log('- generateWhatsAppUrl(message)');
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


// Banner de Span en hero

document.addEventListener("DOMContentLoaded", () => {
  const frases = [
    "El regalo perfecto",
    "Sorprendé con bienestar",
    "Un detalle único",
    "Regalá experiencias",
    "Bienestar para quien querés"
  ];

  let i = 0;
  const span = document.getElementById("changing-text");

  function cambiarFrase() {
    span.classList.remove("fade-in");
    void span.offsetWidth; // truco para reiniciar la animación CSS
    span.classList.add("fade-in");

    span.textContent = frases[i];
    i = (i + 1) % frases.length;
  }

  // Primera frase
  cambiarFrase();

  // Cambia cada 3 segundos
  setInterval(cambiarFrase, 3000);
});


// ============================================
// EJEMPLO DE USO DESDE LA CONSOLA
// ============================================

/*
  Para mostrar un mensaje promocional:
  VoelkeepGiftCard.showPromoMessage('🎉 Promo especial: 15% OFF en Gift Cards!', 8000);
  
  Para compartir en redes:
  VoelkeepGiftCard.shareOnSocialMedia('whatsapp');
  
  Para generar URL de WhatsApp personalizada:
  const url = VoelkeepGiftCard.generateWhatsAppUrl('Hola! Quiero una gift card de $20000');
  window.open(url, '_blank');
  
  Para copiar algo al portapapeles:
  VoelkeepGiftCard.copyToClipboard('+54 9 11 2338-7610', '¡Teléfono copiado!');
*/