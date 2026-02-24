/* =========================================
    LOADER GLOBAL
========================================= */

export function mostrarLoader() {
  const loader = qs("#app-loader"); 
  if (loader) {
    loader.classList.remove("hidden");
    loader.setAttribute("aria-hidden", "false");
  }
}

export function ocultarLoader() {
  const loader = qs("#app-loader");
  if (loader) {
    loader.classList.add("hidden");
    loader.setAttribute("aria-hidden", "true");
  }
}


/* =========================================
    SELECTORES DOM
========================================= */

// Selecciona un único elemento
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// Selecciona múltiples elementos y devuelve un Array 
export function qsa(selector, parent = document) {
  return [...parent.querySelectorAll(selector)];
}


/* =========================================
    EVENTOS
========================================= */

export function on(element, event, handler) {
  if (element && typeof handler === 'function') {
    element.addEventListener(event, handler);
  }
}


/* =========================================
    CREAR ELEMENTOS
========================================= */

export function create(tag, className = "", content = "", isHTML = false) {
  const el = document.createElement(tag);

  if (className) el.className = className;

  if (content) {
    isHTML ? (el.innerHTML = content) : (el.textContent = content);
  }

  return el;
}


/* =========================================
    LIMPIAR ELEMENTO
========================================= */

export function clear(element) {
  if (element) {
    element.replaceChildren(); 
  }
}