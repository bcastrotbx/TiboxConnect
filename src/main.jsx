import ReactDOM from 'react-dom/client';
import { AppRouter } from './routes/AppRouter.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css';

// No StrictMode: preserves the original prototype's exact runtime behavior
// (double-invoked effects in dev could visibly double-fire things like the
// hero slider interval or the simulated-submit setTimeout animations).
// AuthProvider envuelve todo el árbol (portal + admin): tanto el header
// público (Fase 5, botón ADM condicional) como AdminRoute necesitan leer la
// sesión real.
ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <AppRouter />
  </AuthProvider>
);
