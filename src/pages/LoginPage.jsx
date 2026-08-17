import React from 'react';
import { Navigate } from 'react-router-dom';
import { Icon } from '../components/shared/Icon.jsx';
import { CosmicBg } from '../components/shared/CosmicBg.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../lib/supabase.js';

const inputStyle = {
  width: '100%', padding: '11px 13px', border: '1.5px solid var(--gray-200)', borderRadius: 9,
  fontSize: 13.5, fontFamily: 'inherit', outline: 'none', background: 'white', color: 'var(--gray-800)',
  transition: 'border-color 150ms',
};

function labelStyle() {
  return { fontSize: 12, fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 5 };
}

function CardShell({ children }) {
  return (
    <div style={{
      position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden',
      background: 'var(--grad-corporate)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <CosmicBg variant={2} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(2,16,46,0.82), rgba(5,24,72,0.55))', pointerEvents: 'none' }}></div>
      <div style={{
        position: 'relative', width: '100%', maxWidth: 400, background: 'white', borderRadius: 16,
        padding: '36px 32px', boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
      }}>
        {children}
      </div>
    </div>
  );
}

// Solicitud de restablecimiento de contraseña — vive dentro de la misma
// página que el login (no se agregó una ruta propia porque el pedido solo
// exigía "un enlace que lleve a un flujo de recuperación", no una URL
// dedicada; ver decisión en docs/phases/FASE-05-AUTENTICACION.md).
function RecoverForm({ onBack, resetPasswordForEmail }) {
  const [email, setEmail] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    const { error } = await resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/actualizar-contrasena`,
    });
    setSending(false);
    if (error) {
      setError('No se pudo enviar el correo de recuperación. Verifica el correo e inténtalo de nuevo.');
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(22,179,100,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Icon name="mail-check" style={{ width: 26, height: 26, color: '#0d8a4e' }} />
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy-900)', marginBottom: 8 }}>Revisa tu correo</div>
        <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.6, margin: '0 0 20px' }}>
          Si <strong>{email}</strong> corresponde a una cuenta de administrador, te enviamos un enlace para definir una nueva contraseña.
        </p>
        <button onClick={onBack} style={{ fontSize: 13, fontWeight: 600, color: '#0050C8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
          Volver a iniciar sesión
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy-900)', marginBottom: 4 }}>Recuperar contraseña</div>
        <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.5, margin: 0 }}>
          Ingresa el correo de tu cuenta de administrador y te enviaremos un enlace para definir una nueva contraseña.
        </p>
      </div>
      <div>
        <label style={labelStyle()}>Correo</label>
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@tibox.cl" style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#0050C8'} onBlur={e => e.target.style.borderColor = 'var(--gray-200)'}
        />
      </div>
      {error && (
        <div style={{ fontSize: 12.5, color: '#c0392b', background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.2)', borderRadius: 8, padding: '9px 12px' }}>
          {error}
        </div>
      )}
      <button type="submit" disabled={sending} style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        background: 'linear-gradient(135deg, #0050C8 0%, #0080F0 100%)', color: 'white', border: 'none',
        borderRadius: 10, padding: '12px 16px', fontSize: 14, fontWeight: 700, cursor: sending ? 'default' : 'pointer',
        opacity: sending ? 0.7 : 1, boxShadow: '0 2px 10px rgba(0,80,200,0.28)',
      }}>
        {sending ? <Icon name="loader-2" className="tbx-spin" style={{ width: 16, height: 16 }} /> : <Icon name="send" style={{ width: 15, height: 15 }} />}
        Enviar enlace de recuperación
      </button>
      <button type="button" onClick={onBack} style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-500)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center' }}>
        Volver a iniciar sesión
      </button>
    </form>
  );
}

// Ruta pública /login — solo para administradores. Deliberadamente sin
// enlace de "crear cuenta" (ver ADR-004: no hay registro público). No hay
// ningún link público hacia esta página desde el portal (el botón ADM del
// header solo aparece cuando YA hay sesión de admin activa) — se llega
// escribiendo la URL directamente, algo esperable para administradores.
export function LoginPage() {
  const { loading, isAdmin, signIn, blockedNotice, clearBlockedNotice } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [mode, setMode] = React.useState('login');

  if (!loading && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    clearBlockedNotice();
    const { error } = await signIn(email, password);
    setSending(false);
    if (error) {
      if (error.message === 'Invalid login credentials') {
        setError('Correo o contraseña incorrectos.');
      } else if (error.message.toLowerCase().includes('email not confirmed')) {
        setError('Esta cuenta todavía no confirmó su invitación. Revisa el correo de invitación.');
      } else {
        setError('No se pudo iniciar sesión. Inténtalo nuevamente.');
      }
    }
  };

  return (
    <CardShell>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <img src="/assets/logo-tibox-dark.png" alt="TIBOX" style={{ height: 26, marginBottom: 18 }} />
        {mode === 'login' && (
          <React.Fragment>
            <div style={{ fontSize: 19, fontWeight: 700, color: 'var(--navy-900)' }}>Panel de administración</div>
            <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 4 }}>Acceso exclusivo para administradores TIBOX</div>
          </React.Fragment>
        )}
      </div>

      {mode === 'recover' ? (
        <RecoverForm onBack={() => setMode('login')} resetPasswordForEmail={(...args) => supabase.auth.resetPasswordForEmail(...args)} />
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {blockedNotice && (
            <div style={{ fontSize: 12.5, color: '#c0392b', background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.2)', borderRadius: 8, padding: '9px 12px' }}>
              Tu cuenta fue bloqueada. Contacta a otro administrador si crees que es un error.
            </div>
          )}
          <div>
            <label style={labelStyle()}>Correo</label>
            <input type="email" required autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@tibox.cl" style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#0050C8'} onBlur={e => e.target.style.borderColor = 'var(--gray-200)'}
            />
          </div>
          <div>
            <label style={labelStyle()}>Contraseña</label>
            <input type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#0050C8'} onBlur={e => e.target.style.borderColor = 'var(--gray-200)'}
            />
          </div>
          {error && (
            <div style={{ fontSize: 12.5, color: '#c0392b', background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.2)', borderRadius: 8, padding: '9px 12px' }}>
              {error}
            </div>
          )}
          <button type="submit" disabled={sending} style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: 'linear-gradient(135deg, #0050C8 0%, #0080F0 100%)', color: 'white', border: 'none',
            borderRadius: 10, padding: '12px 16px', fontSize: 14, fontWeight: 700, cursor: sending ? 'default' : 'pointer',
            opacity: sending ? 0.7 : 1, boxShadow: '0 2px 10px rgba(0,80,200,0.28)',
          }}>
            {sending ? <Icon name="loader-2" className="tbx-spin" style={{ width: 16, height: 16 }} /> : <Icon name="log-in" style={{ width: 15, height: 15 }} />}
            Iniciar sesión
          </button>
          <button type="button" onClick={() => { setError(''); setMode('recover'); }} style={{ fontSize: 13, fontWeight: 600, color: '#0050C8', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center' }}>
            ¿Olvidaste tu contraseña?
          </button>
        </form>
      )}
    </CardShell>
  );
}
