import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Entrada única (Fase 2): portal y admin ahora comparten la misma app React
// montada en index.html, con react-router-dom decidiendo qué se renderiza
// según la ruta (ver src/routes/AppRouter.jsx). Antes había una segunda
// entrada admin/index.html (Fase 1); se eliminó junto con
// src/admin/main.jsx y src/admin/AdminApp.jsx.
export default defineConfig({
  plugins: [react()],
});
