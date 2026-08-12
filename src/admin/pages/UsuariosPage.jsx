import React from 'react';
import { Icon } from '../../components/shared/Icon.jsx';
import { LoadingState, EmptyState, ErrorState } from '../../components/shared/AsyncState.jsx';
import { Field } from '../AdminWidgets.jsx';
import { useAsyncData } from '../../hooks/useAsyncData.js';
import * as adminUsersService from '../../services/adminUsersService.js';

function AdminStatusBadge({ status }) {
  const active = status === 'Activo';
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, borderRadius: 999, padding: '3px 10px',
      color: active ? '#0d8a4e' : '#c0392b',
      background: active ? 'rgba(22,179,100,0.1)' : 'rgba(192,57,43,0.1)',
    }}>{status}</span>
  );
}

// Ajuste posterior (ver FASE-09D-VISIBILIDAD-INVITACION-ADMIN.md): badge
// separado de AdminStatusBadge a propósito — "Estado" (activo/bloqueado)
// es sobre si la cuenta está habilitada, esto es sobre si la persona ya
// aceptó la invitación (inició sesión al menos una vez) o sigue con el
// enlace sin abrir. Mezclarlos bajo la misma palabra "Activo" habría sido
// confuso, por eso "Aceptada"/"Invitación pendiente" en vez de reusar
// "Activo"/"Inactivo".
function InvitationBadge({ hasSignedIn }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, borderRadius: 999, padding: '3px 10px',
      display: 'inline-flex', alignItems: 'center', gap: 5,
      color: hasSignedIn ? '#0d8a4e' : '#a86a00',
      background: hasSignedIn ? 'rgba(22,179,100,0.1)' : 'rgba(255,166,0,0.12)',
    }}>
      <Icon name={hasSignedIn ? 'check-circle-2' : 'clock'} style={{ width: 12, height: 12 }} />
      {hasSignedIn ? 'Aceptada' : 'Invitación pendiente'}
    </span>
  );
}

// Ajuste posterior (ver FASE-09-NOTICIAS-DETALLE-Y-ADMIN.md, punto 2.3):
// listado de solo lectura de todos los usuarios con rol admin — antes esta
// página solo tenía el formulario de invitación, sin forma de ver quién ya
// tiene acceso. Usa adminUsersService.listAdmins() (RPC list_admin_profiles,
// ver esa migración para el porqué de un RPC en vez de un SELECT directo).
function AdminsList() {
  const { status, data, error } = useAsyncData(() => adminUsersService.listAdmins(), []);
  return (
    <div className="adm-card">
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy-900,#021233)' }}>Administradores registrados</div>
        {status === 'success' && <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>{(data || []).length} administradores</span>}
      </div>
      {status === 'loading' && <LoadingState label="Cargando administradores…" />}
      {status === 'error' && <ErrorState label="No pudimos cargar el listado de administradores." error={error} />}
      {status === 'success' && (data || []).length === 0 && (
        <EmptyState label="No hay administradores registrados todavía." icon="users" />
      )}
      {status === 'success' && (data || []).length > 0 && (
        <table className="adm-table">
          <thead><tr><th>Nombre completo</th><th>Correo</th><th>Estado</th><th>Invitación</th></tr></thead>
          <tbody>
            {data.map((a) => (
              <tr key={a.id}>
                <td style={{ fontWeight: 600 }}>{a.fullName || '—'}</td>
                <td style={{ color: 'var(--gray-500)' }}>{a.email}</td>
                <td><AdminStatusBadge status={a.status} /></td>
                <td><InvitationBadge hasSignedIn={a.hasSignedIn} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Ruta /admin/usuarios (Fase 5) — invitar administradores adicionales, ver
// ADR-004 y ADR-005. Toda la ruta /admin/* ya exige sesión de administrador
// activa (AdminRoute), así que no hace falta un guardado adicional aquí para
// cumplir "solo visible y usable por administradores ya logueados".
export function UsuariosPage() {
  const [email, setEmail] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [result, setResult] = React.useState(null); // { ok: boolean, message: string, link?: string }
  const [copied, setCopied] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setResult(null);
    setCopied(false);
    const { data, error } = await adminUsersService.inviteAdmin({ email, fullName });
    setSending(false);
    if (error) {
      setResult({ ok: false, message: error });
      return;
    }
    setResult({
      ok: true,
      message: `Cuenta de administrador creada para ${email}. Copia el enlace de abajo y envíaselo — al abrirlo y definir su contraseña, tendrá acceso inmediato al panel.`,
      link: data?.actionLink || '',
    });
    setEmail('');
    setFullName('');
  };

  const handleCopyLink = async () => {
    if (!result?.link) return;
    try {
      await navigator.clipboard.writeText(result.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Sin permiso del navegador para escribir al portapapeles (poco común
      // con un clic real de usuario) — el input de solo lectura de arriba
      // ya selecciona todo su texto al enfocarse, así que copiar a mano
      // (clic + Cmd/Ctrl+C) sigue disponible como respaldo.
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 880 }}>
      <div className="adm-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 640 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy-900,#021233)' }}>Agregar administrador</div>
          <p style={{ fontSize: 13, color: 'var(--gray-500)', margin: '4px 0 0', lineHeight: 1.5 }}>
            Genera un enlace de invitación para que la persona defina su propia contraseña — cópialo y envíaselo por el medio que prefieras (correo, WhatsApp, Slack). Al abrirlo y definir su contraseña, tendrá acceso completo al panel de administración de inmediato — no hay un paso intermedio de aprobación posterior.
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
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              {result.message}
              {result.ok && result.link && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    readOnly
                    value={result.link}
                    onFocus={e => e.target.select()}
                    style={{
                      flex: 1, fontSize: 12, fontFamily: 'monospace', color: 'var(--navy-900,#021233)',
                      background: 'white', border: '1px solid rgba(22,179,100,0.3)', borderRadius: 6, padding: '7px 9px',
                    }}
                  />
                  <button type="button" onClick={handleCopyLink} className="adm-mini-btn" style={{ padding: '7px 12px', fontSize: 12, whiteSpace: 'nowrap' }}>
                    <Icon name={copied ? 'check' : 'copy'} style={{ width: 13, height: 13 }} />
                    {copied ? 'Copiado' : 'Copiar enlace'}
                  </button>
                </div>
              )}
            </div>
          )}

          <div>
            <button type="submit" disabled={sending} className="adm-mini-btn primary" style={{ padding: '9px 16px', fontSize: 13 }}>
              {sending ? <Icon name="loader-2" className="tbx-spin" style={{ width: 14, height: 14 }} /> : <Icon name="user-plus" style={{ width: 14, height: 14 }} />}
              {sending ? 'Generando invitación…' : 'Generar invitación'}
            </button>
          </div>
        </form>
      </div>

      <div className="adm-card" style={{ padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'flex-start', maxWidth: 640 }}>
        <Icon name="info" style={{ width: 16, height: 16, color: 'var(--gray-400)', flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 12.5, color: 'var(--gray-500)', lineHeight: 1.6, margin: 0 }}>
          El enlace de invitación se genera al instante y funciona de inmediato — no depende de que llegue un correo automático (todavía no se configuró un dominio propio de envío, ver <code>docs/phases/FASE-05-AUTENTICACION.md</code>). Envíaselo tú mismo a la persona invitada por el medio que prefieras.
        </p>
      </div>

      <AdminsList />
    </div>
  );
}
