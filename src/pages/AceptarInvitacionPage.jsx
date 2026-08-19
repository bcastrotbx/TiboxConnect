import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import { Icon } from '../components/shared/Icon.jsx';
import { CosmicBg } from '../components/shared/CosmicBg.jsx';

// Ruta pública /aceptar-invitacion — reemplaza compartir el action_link
// crudo de Supabase (.../auth/v1/verify?token=...), que es de un solo uso y
// por eso vulnerable a que un bot de vista previa de Slack/Teams/WhatsApp lo
// consuma con su propio GET automático antes de que la persona invitada
// haga clic real (ver adminUsersService.js, buildSecureInviteLink, para el
// diagnóstico completo — caso real: invitación a pfarias@tibox.cl).
//
// Esta página NO llama a verifyOtp automáticamente al cargar — solo lo hace
// dentro de handleAccept, disparado por un clic real del botón. Un bot de
// vista previa hace un GET simple para leer metadatos de la página (título,
// imagen), nunca ejecuta el onClick de un botón, así que el token queda
// intacto hasta que la persona invitada de verdad hace clic.
export function AceptarInvitacionPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const type = searchParams.get('type') || 'invite';
  const [state, setState] = React.useState('idle'); // idle | loading | error
  const [errorMsg, setErrorMsg] = React.useState('');

  const handleAccept = async () => {
    if (!token) {
      setState('error');
      setErrorMsg('Este enlace no es válido — falta información. Pide uno nuevo al administrador.');
      return;
    }
    setState('loading');
    const { error } = await supabase.auth.verifyOtp({ token_hash: token, type });
    if (error) {
      setState('error');
      setErrorMsg('Este enlace ya no es válido: puede haber expirado o ya haber sido usado. Pide uno nuevo al administrador.');
      return;
    }
    navigate('/actualizar-contrasena', { replace: true });
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
        position: 'relative', width: '100%', maxWidth: 420, background: 'white', borderRadius: 16,
        padding: '36px 32px', boxShadow: '0 20px 60px rgba(0,0,0,0.35)', textAlign: 'center',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img src="/assets/logo-tibox.png" alt="TIBOX" style={{ height: 26, marginBottom: 18 }} />
        </div>

        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(0,80,200,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Icon name="mail" style={{ width: 26, height: 26, color: '#0050C8' }} />
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy-900)', marginBottom: 8 }}>Invitación a Tibox Connect</div>

        {state !== 'error' ? (
          <React.Fragment>
            <p style={{ fontSize: 13.5, color: 'var(--gray-500)', lineHeight: 1.6, margin: '0 0 22px' }}>
              Te invitaron a ser administrador del portal. Haz clic para continuar y definir tu contraseña.
            </p>
            <button type="button" onClick={handleAccept} disabled={state === 'loading'} style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: 'linear-gradient(135deg, #0050C8 0%, #0080F0 100%)', color: 'white', border: 'none',
              borderRadius: 10, padding: '12px 22px', fontSize: 14, fontWeight: 700, cursor: state === 'loading' ? 'default' : 'pointer',
              opacity: state === 'loading' ? 0.7 : 1, boxShadow: '0 2px 10px rgba(0,80,200,0.28)',
            }}>
              {state === 'loading' ? <Icon name="loader-2" className="tbx-spin" style={{ width: 15, height: 15 }} /> : <Icon name="check" style={{ width: 15, height: 15 }} />}
              {state === 'loading' ? 'Verificando…' : 'Aceptar invitación'}
            </button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div style={{ fontSize: 12.5, color: '#c0392b', background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.2)', borderRadius: 8, padding: '9px 12px', lineHeight: 1.5, marginBottom: 18 }}>
              {errorMsg}
            </div>
            <a href="/login" style={{ fontSize: 13, color: 'var(--navy-900,#021233)', fontWeight: 700 }}>Ir a iniciar sesión</a>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
