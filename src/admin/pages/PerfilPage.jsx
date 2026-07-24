import React from 'react';
import { Icon } from '../../components/shared/Icon.jsx';
import { Field } from '../AdminWidgets.jsx';

function Toggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)} style={{ width:42, height:24, borderRadius:999, border:'none', cursor:'pointer', padding:0, position:'relative', background: on ? '#0050C8' : 'var(--gray-300)', transition:'background 160ms', flexShrink:0 }}>
      <span style={{ position:'absolute', top:3, left: on ? 21 : 3, width:18, height:18, borderRadius:'50%', background:'white', transition:'left 160ms', boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}></span>
    </button>
  );
}

function ProfileRow({ icon, title, desc, children }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 0', borderBottom:'1px solid var(--gray-100)' }}>
      <div style={{ width:38, height:38, borderRadius:10, background:'rgba(0,80,200,0.08)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <Icon name={icon} style={{ width:17, height:17, color:'#0050C8' }} />
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13.5, fontWeight:700, color:'var(--navy-900,#021233)' }}>{title}</div>
        {desc && <div style={{ fontSize:12.5, color:'var(--gray-500)', marginTop:1 }}>{desc}</div>}
      </div>
      {children}
    </div>
  );
}

// Ruta /admin/perfil — antes la sección "profile" del admin (Fase 1),
// alcanzable solo vía el botón "Mi Perfil" del header (nunca estuvo en el
// sidebar). No estaba en la lista de rutas pedida explícitamente para esta
// fase; se agrega como ruta propia para no perder la funcionalidad y para
// que el botón del header tenga una URL real a la que navegar.
export function PerfilPage() {
  const [twoFA, setTwoFA] = React.useState(true);
  const [prefs, setPrefs] = React.useState({ emailNotif:true, weekly:false, darkAdmin:false, sound:true });
  const [saved, setSaved] = React.useState(false);
  const [pwd, setPwd] = React.useState(false);
  const togglePref = k => setPrefs(p => ({ ...p, [k]: !p[k] }));
  const cardHead = (t) => <div style={{ fontSize:15, fontWeight:700, color:'var(--navy-900,#021233)', marginBottom:6 }}>{t}</div>;
  return (
    <div style={{ display:'grid', gridTemplateColumns:'320px 1fr', gap:20, alignItems:'start' }}>
      <div className="adm-card" style={{ padding:24, display:'flex', flexDirection:'column', alignItems:'center', gap:4, textAlign:'center' }}>
        <div style={{ position:'relative' }}>
          <div style={{ width:104, height:104, borderRadius:'50%', background:'var(--grad-title)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, fontWeight:700, color:'white' }}>AD</div>
          <label style={{ position:'absolute', bottom:2, right:2, width:32, height:32, borderRadius:'50%', background:'white', border:'1px solid var(--gray-200)', boxShadow:'0 2px 8px rgba(0,0,0,0.12)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#0050C8' }} title="Cambiar foto">
            <Icon name="camera" style={{ width:15, height:15 }} />
            <input type="file" accept="image/*" style={{ display:'none' }} />
          </label>
        </div>
        <div style={{ fontSize:18, fontWeight:700, color:'var(--navy-900,#021233)', marginTop:12 }}>Alejandro Díaz</div>
        <div style={{ fontSize:13, color:'var(--gray-500)' }}>Administrador del portal</div>
        <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(0,200,250,0.08)', borderRadius:8, padding:'5px 11px', border:'1px solid rgba(0,200,250,0.2)', marginTop:10 }}>
          <div style={{ width:5, height:5, borderRadius:'50%', background:'var(--brand-cyan)' }}></div>
          <span style={{ fontSize:11, fontWeight:700, color:'#0079a3', letterSpacing:'0.08em' }}>ADMIN</span>
        </div>
        <label className="adm-mini-btn" style={{ marginTop:16 }}>
          <Icon name="upload-cloud" style={{ width:13, height:13 }} />Cambiar foto de perfil
          <input type="file" accept="image/*" style={{ display:'none' }} />
        </label>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
        <div className="adm-card" style={{ padding:24, display:'flex', flexDirection:'column', gap:16 }}>
          {cardHead('Información personal')}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <Field label="Nombre completo"><input defaultValue="Alejandro Díaz" /></Field>
            <Field label="Cargo"><input defaultValue="Administrador del portal" /></Field>
            <Field label="Correo electrónico"><input type="email" defaultValue="alejandro.diaz@tibox.cl" /></Field>
            <Field label="Teléfono"><input type="tel" defaultValue="+56 9 1234 5678" /></Field>
          </div>
        </div>

        <div className="adm-card" style={{ padding:'8px 24px 20px' }}>
          <div style={{ padding:'16px 0 0' }}>{cardHead('Seguridad')}</div>
          <ProfileRow icon="key" title="Contraseña" desc="Último cambio hace 3 meses">
            <button className="adm-mini-btn" onClick={() => setPwd(p => !p)}><Icon name="lock" style={{ width:13, height:13 }} />Cambiar contraseña</button>
          </ProfileRow>
          {pwd && (
            <div style={{ padding:'16px 0', borderBottom:'1px solid var(--gray-100)', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
              <Field label="Contraseña actual"><input type="password" placeholder="••••••••" /></Field>
              <Field label="Nueva contraseña"><input type="password" placeholder="••••••••" /></Field>
              <Field label="Confirmar"><input type="password" placeholder="••••••••" /></Field>
            </div>
          )}
          <ProfileRow icon="shield-check" title="Autenticación en dos pasos (2FA)" desc={twoFA ? 'Activada — código por aplicación autenticadora' : 'Desactivada — tu cuenta es más vulnerable'}>
            <Toggle on={twoFA} onChange={setTwoFA} />
          </ProfileRow>
        </div>

        <div className="adm-card" style={{ padding:'8px 24px 20px' }}>
          <div style={{ padding:'16px 0 0' }}>{cardHead('Preferencias de la cuenta')}</div>
          <ProfileRow icon="mail" title="Notificaciones por correo" desc="Recibe avisos de mensajes e inscripciones">
            <Toggle on={prefs.emailNotif} onChange={() => togglePref('emailNotif')} />
          </ProfileRow>
          <ProfileRow icon="calendar" title="Resumen semanal" desc="Reporte de actividad cada lunes">
            <Toggle on={prefs.weekly} onChange={() => togglePref('weekly')} />
          </ProfileRow>
          <ProfileRow icon="volume-2" title="Sonido de notificaciones" desc="Alerta sonora dentro del panel">
            <Toggle on={prefs.sound} onChange={() => togglePref('sound')} />
          </ProfileRow>
          <div style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 0 0' }}>
            <div style={{ width:38, height:38, borderRadius:10, background:'rgba(0,80,200,0.08)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Icon name="globe" style={{ width:17, height:17, color:'#0050C8' }} />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13.5, fontWeight:700, color:'var(--navy-900,#021233)' }}>Idioma del panel</div>
            </div>
            <select defaultValue="es" style={{ fontFamily:'inherit', fontSize:13, padding:'8px 12px', border:'1px solid var(--gray-200)', borderRadius:9, color:'var(--navy-900,#021233)', background:'white' }}>
              <option value="es">Español</option><option value="en">English</option><option value="pt">Português</option>
            </select>
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:14 }}>
          {saved && <span style={{ fontSize:13, fontWeight:700, color:'#16a34a', display:'inline-flex', alignItems:'center', gap:6 }}><Icon name="check-circle-2" style={{ width:15, height:15 }} />Cambios guardados</span>}
          <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2600); }} style={{ background:'linear-gradient(135deg, #0050C8 0%, #0080F0 100%)', color:'white', border:'none', borderRadius:11, padding:'11px 24px', fontSize:13.5, fontWeight:700, cursor:'pointer', boxShadow:'0 2px 10px rgba(0,80,200,0.28)' }}>Guardar cambios</button>
        </div>
      </div>
    </div>
  );
}
