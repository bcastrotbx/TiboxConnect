import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/shared/Icon.jsx';
import { CosmicBg } from '../components/shared/CosmicBg.jsx';
import { supabase } from '../lib/supabase.js';

const inputStyle = {
  width: '100%', padding: '11px 13px', border: '1.5px solid var(--gray-200)', borderRadius: 9,
  fontSize: 13.5, fontFamily: 'inherit', outline: 'none', background: 'white', color: 'var(--gray-800)',
  transition: 'border-color 150ms',
};

// Ruta pública /actualizar-contrasena — a la que Supabase redirige tras
// hacer clic en el enlace de recuperación (ver resetPasswordForEmail en
// LoginPage.jsx). supabase-js detecta el token de la URL automáticamente
// (detectSessionInUrl, default true) y deja una sesión temporal activa solo
// para poder llamar a updateUser(); no implica que la cuenta ya esté
// "logueada" en el sentido normal hasta que esta pantalla confirma el
// cambio.
export function UpdatePasswordPage() {
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState('');
  const [done, setDone] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setSending(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSending(false);
    if (error) {
      setError('No se pudo actualizar la contraseña. El enlace puede haber expirado — solicita uno nuevo desde /login.');
      return;
    }
    setDone(true);
  };

  return (
    <div style={{
      position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden',
      background: 'var(--grad-corporate)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <CosmicBg variant={1} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(2,16,46,0.82), rgba(5,24,72,0.55))', pointerEvents: 'none' }}></div>
      <div style={{
        position: 'relative', width: '100%', maxWidth: 400, background: 'white', borderRadius: 16,
        padding: '36px 32px', boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img src="/assets/logo-tibox.png" alt="TIBOX" style={{ height: 26, marginBottom: 18 }} />
        </div>

        {done ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(22,179,100,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Icon name="check-circle-2" style={{ width: 26, height: 26, color: '#0d8a4e' }} />
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy-900)', marginBottom: 8 }}>Contraseña actualizada</div>
            <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.6, margin: '0 0 20px' }}>
              Ya puedes acceder al panel de administración con tu nueva contraseña.
            </p>
            <Link to="/admin" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 20px', borderRadius: 10,
              background: 'linear-gradient(135deg, #0050C8 0%, #0080F0 100%)', color: 'white', textDecoration: 'none',
              fontSize: 13.5, fontWeight: 700,
            }}>
              <Icon name="arrow-right" style={{ width: 14, height: 14 }} />
              Ir al panel
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy-900)', marginBottom: 4 }}>Define tu nueva contraseña</div>
              <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.5, margin: 0 }}>Mínimo 8 caracteres.</p>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 5 }}>Nueva contraseña</label>
              <input type="password" required autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#0050C8'} onBlur={e => e.target.style.borderColor = 'var(--gray-200)'}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 5 }}>Confirmar contraseña</label>
              <input type="password" required autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" style={inputStyle}
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
              {sending ? <Icon name="loader-2" className="tbx-spin" style={{ width: 16, height: 16 }} /> : <Icon name="check" style={{ width: 15, height: 15 }} />}
              Guardar nueva contraseña
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
