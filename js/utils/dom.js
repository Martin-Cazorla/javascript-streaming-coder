/* ===== LOADER GLOBAL ===== */
export function mostrarLoader() {
  document.getElementById("app-loader")?.classList.remove("hidden");
}

export function ocultarLoader() {
  document.getElementById("app-loader")?.classList.add("hidden");
}

/* ===== HELPERS DOM ===== */
export function qs(selector) {
  return document.querySelector(selector);
}

export function on(element, event, handler) {
  if (element) {
    element.addEventListener(event, handler);
  }
}