import React from 'react';
import { Icon } from '../../components/shared/Icon.jsx';
import { Field } from '../AdminWidgets.jsx';
import * as adminUsersService from '../../services/adminUsersService.js';

// Ruta /admin/usuarios (Fase 5) — invitar administradores adicionales, ver
// ADR-004 y ADR-005. Toda la ruta /admin/* ya exige sesión de administrador
// activa (AdminRoute), así que no hace falta un guardado adicional aquí para
// cumplir "solo visible y usable por administradores ya logueados".
export function UsuariosPage() {
  const [email, setEmail] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [result, setResult] = React.useState(null); // { ok: boolean, message: string }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setResult(null);
    const { data, error } = await adminUsersService.inviteAdmin({ email, fullName });
    setSending(false);
    if (error) {
      setResult({ ok: false, message: error });
      return;
    }
    setResult({ ok: true, message: `Invitación enviada a ${email}. Recibirá un correo para definir su contraseña y ya tendrá acceso de administrador al aceptarla.` });
    setEmail('');
    setFullName('');
    void data;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 640 }}>
      <div className="adm-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy-900,#021233)' }}>Agregar administrador</div>
          <p style={{ fontSize: 13, color: 'var(--gray-500)', margin: '4px 0 0', lineHeight: 1.5 }}>
            Se enviará una invitación por correo para que la persona defina su propia contraseña. Al aceptarla, tendrá acceso completo al panel de administración — no hay un paso intermedio de aprobación posterior.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Nombre completo">
              <input required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="María Pérez" />
            </Field>
            <Field label="Correo">
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="maria.perez@tibox.cl" />
            </Field>
          </div>

          {result && (
            <div style={{
              fontSize: 12.5, lineHeight: 1.5, borderRadius: 8, padding: '10px 12px',
              color: result.ok ? '#0d8a4e' : '#c0392b',
              background: result.ok ? 'rgba(22,179,100,0.08)' : 'rgba(192,57,43,0.08)',
              border: `1px solid ${result.ok ? 'rgba(22,179,100,0.25)' : 'rgba(192,57,43,0.2)'}`,
            }}>
              {result.message}
            </div>
          )}

          <div>
            <button type="submit" disabled={sending} className="adm-mini-btn primary" style={{ padding: '9px 16px', fontSize: 13 }}>
              {sending ? <Icon name="loader-2" className="tbx-spin" style={{ width: 14, height: 14 }} /> : <Icon name="user-plus" style={{ width: 14, height: 14 }} />}
              {sending ? 'Enviando invitación…' : 'Enviar invitación'}
            </button>
          </div>
        </form>
      </div>

      <div className="adm-card" style={{ padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <Icon name="info" style={{ width: 16, height: 16, color: 'var(--gray-400)', flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 12.5, color: 'var(--gray-500)', lineHeight: 1.6, margin: 0 }}>
          El correo de invitación lo envía Supabase con su servicio de correo por defecto (todavía no se configuró un dominio propio de envío — ver <code>docs/phases/FASE-05-AUTENTICACION.md</code>). Puede llegar a spam/promociones la primera vez.
        </p>
      </div>
    </div>
  );
}
