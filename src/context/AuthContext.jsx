import React from 'react';
import { supabase } from '../lib/supabase.js';

// Fase 5 — Autenticación real de administradores (ver ADR-004: sin registro
// público, el portal es 100% público, solo existen cuentas de admin creadas
// por invitación). Este contexto es la única fuente de verdad de sesión en
// toda la app: envuelve <AppRouter/> en src/main.jsx.
const AuthContext = React.createContext(null);

const initialState = {
  session: null,
  user: null,
  profile: null,
  loading: true,
};

export function AuthProvider({ children }) {
  const [state, setState] = React.useState(initialState);
  // Se conserva por separado del resto del estado porque debe sobrevivir al
  // signOut() automático que dispara (ver loadProfile más abajo): si se
  // guardara junto a session/user/profile, el propio signOut lo borraría
  // antes de que la pantalla de login alcance a mostrarlo.
  const [blockedNotice, setBlockedNotice] = React.useState(false);

  const loadProfile = React.useCallback(async (session) => {
    if (!session?.user) {
      setState({ session: null, user: null, profile: null, loading: false });
      return;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) {
      // No hay fila de perfil (o no se pudo leer) — no debería pasar para
      // una cuenta creada vía el trigger on_auth_user_created, pero si
      // ocurre, se trata como "sin acceso" en vez de dejar al usuario en un
      // estado a medias con sesión pero sin profile.
      setState({ session, user: session.user, profile: null, loading: false });
      return;
    }

    if (profile.status === 'blocked') {
      // La cuenta fue bloqueada por otro administrador. Se cierra la sesión
      // automáticamente en vez de dejarla "viva" con acceso de solo lectura
      // — bloqueado significa bloqueado, no un tercer estado intermedio.
      setBlockedNotice(true);
      await supabase.auth.signOut();
      // onAuthStateChange (más abajo) ya deja session/user/profile en null
      // tras el signOut — no se duplica ese setState aquí.
      return;
    }

    setState({ session, user: session.user, profile, loading: false });
  }, []);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      loadProfile(session);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      loadProfile(session);
    });

    return () => subscription.subscription.unsubscribe();
  }, [loadProfile]);

  const signIn = React.useCallback(async (email, password) => {
    setBlockedNotice(false);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  }, []);

  const signOut = React.useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const isAdmin = state.profile?.role === 'admin' && state.profile?.status === 'active';

  const value = {
    ...state,
    isAdmin,
    blockedNotice,
    clearBlockedNotice: () => setBlockedNotice(false),
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth() debe usarse dentro de <AuthProvider>.');
  return ctx;
}
