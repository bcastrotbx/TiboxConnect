// Todos los servicios en src/services/ leen hoy desde src/data/seed/ (datos
// locales, instantáneos) pero devuelven Promises con un pequeño delay
// simulado, para que los componentes ya usen el patrón loading/empty/error
// que necesitarán cuando en una fase futura la implementación interna de
// estas funciones pase a llamar a un backend real (ninguna otra parte del
// código debería necesitar cambiar).
export function simulateDelay(value, ms = 350) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
