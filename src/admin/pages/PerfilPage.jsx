import React from 'react';
import { Icon } from '../../components/shared/Icon.jsx';
import { Field, Avatar } from '../AdminWidgets.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import * as profileService from '../../services/profileService.js';
import * as storageService from '../../services/storageService.js';

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
// sidebar).
//
// Ajuste posterior ("Mi Perfil" real): la página entera era decorativa —
// nombre/cargo/correo/teléfono con `defaultValue` fijo, "Guardar cambios"
// solo mostraba un toast falso sin tocar Supabase, "Cambiar contraseña" y la
// foto de perfil no hacían nada. Se conecta lo pedido (nombre, correo,
// contraseña, foto) y se quita lo que no: Cargo y Teléfono (columnas que
// existen en profiles pero no se piden acá — ver la migración de
// avatar_url), Autenticación en dos pasos y todo el bloque de Preferencias
// de la cuenta (ninguno tenía persistencia real ni la va a tener en esta
// fase).
export function PerfilPage() {
  const { profile, user } = useAuth();

  const [fullName, setFullName] = React.useState(profile?.full_name || '');
  const [email, setEmail] = React.useState(user?.email || '');
  const [savingInfo, setSavingInfo] = React.useState(false);
  const [infoError, setInfoError] = React.useState('');
  const [infoSaved, setInfoSaved] = React.useState('');

  const [uploadingAvatar, setUploadingAvatar] = React.useState(false);
  const [avatarError, setAvatarError] = React.useState('');

  const [showPwdForm, setShowPwdForm] = React.useState(false);
  const [currentPwd, setCurrentPwd] = React.useState('');
  const [newPwd, setNewPwd] = React.useState('');
  const [confirmPwd, setConfirmPwd] = React.useState('');
  const [changingPwd, setChangingPwd] = React.useState(false);
  const [pwdError, setPwdError] = React.useState('');
  const [pwdSaved, setPwdSaved] = React.useState(false);

  const cardHead = (t) => <div style={{ fontSize:15, fontWeight:700, color:'var(--navy-900,#021233)', marginBottom:6 }}>{t}</div>;

  // No se limpia el avatar anterior en Storage (a diferencia de
  // deleteContentImageIfUnused para contenido/eventos): esa función solo
  // revisa content_items/events, no profiles, así que reusarla acá borraría
  // por error una foto todavía en uso. Con el volumen de este panel (un
  // puñado de administradores) un archivo huérfano ocasional no justifica
  // más lógica.
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setAvatarError('');
    setUploadingAvatar(true);
    try {
      const url = await storageService.uploadContentImage(file);
      await profileService.updateAvatar(user.id, url);
      window.location.reload();
    } catch (err) {
      setAvatarError(err.message || 'No se pudo subir la foto.');
      setUploadingAvatar(false);
    }
  };

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setInfoError('');
    setInfoSaved('');
    if (!fullName.trim()) { setInfoError('El nombre no puede quedar vacío.'); return; }
    setSavingInfo(true);
    try {
      if (fullName.trim() !== profile?.full_name) {
        await profileService.updateFullName(user.id, fullName.trim());
      }
      // Cambiar el correo no lo actualiza al instante — Supabase exige
      // confirmar el cambio desde un link enviado a la dirección nueva antes
      // de que auth.users.email se actualice de verdad (ver
      // profileService.requestEmailChange). El aviso se lo dice al admin en
      // vez de mostrar "Cambios guardados" como si ya hubiera terminado.
      const emailChanged = email.trim() && email.trim() !== user?.email;
      if (emailChanged) {
        await profileService.requestEmailChange(email.trim());
      }
      setInfoSaved(emailChanged
        ? 'Guardado. Revisa tu correo nuevo para confirmar el cambio de dirección.'
        : 'Cambios guardados.');
      setTimeout(() => setInfoSaved(''), 5000);
    } catch (err) {
      setInfoError(err.message || 'No se pudo guardar. Inténtalo nuevamente.');
    } finally {
      setSavingInfo(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdError('');
    if (newPwd.length < 8) { setPwdError('La nueva contraseña debe tener al menos 8 caracteres.'); return; }
    if (newPwd !== confirmPwd) { setPwdError('Las contraseñas no coinciden.'); return; }
    setChangingPwd(true);
    try {
      await profileService.changePassword(user.email, currentPwd, newPwd);
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
      setShowPwdForm(false);
      setPwdSaved(true);
      setTimeout(() => setPwdSaved(false), 5000);
    } catch (err) {
      setPwdError(err.message || 'No se pudo cambiar la contraseña.');
    } finally {
      setChangingPwd(false);
    }
  };

  return (
    <div style={{ display:'grid', gridTemplateColumns:'320px 1fr', gap:20, alignItems:'start' }}>
      <div className="adm-card" style={{ padding:24, display:'flex', flexDirection:'column', alignItems:'center', gap:4, textAlign:'center' }}>
        <div style={{ position:'relative' }}>
          <Avatar profile={profile} size={104} fontSize={36} />
          <label style={{ position:'absolute', bottom:2, right:2, width:32, height:32, borderRadius:'50%', background:'white', border:'1px solid var(--gray-200)', boxShadow:'0 2px 8px rgba(0,0,0,0.12)', display:'flex', alignItems:'center', justifyContent:'center', cursor: uploadingAvatar ? 'default' : 'pointer', color:'#0050C8' }} title="Cambiar foto">
            <Icon name={uploadingAvatar ? 'loader-2' : 'camera'} className={uploadingAvatar ? 'tbx-spin' : undefined} style={{ width:15, height:15 }} />
            <input type="file" accept="image/jpeg,image/png,image/webp" style={{ display:'none' }} onChange={handleAvatarChange} disabled={uploadingAvatar} />
          </label>
        </div>
        <div style={{ fontSize:18, fontWeight:700, color:'var(--navy-900,#021233)', marginTop:12 }}>{profile?.full_name || 'Administrador'}</div>
        <div style={{ fontSize:13, color:'var(--gray-500)' }}>{user?.email}</div>
        <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(0,200,250,0.08)', borderRadius:8, padding:'5px 11px', border:'1px solid rgba(0,200,250,0.2)', marginTop:10 }}>
          <div style={{ width:5, height:5, borderRadius:'50%', background:'var(--brand-cyan)' }}></div>
          <span style={{ fontSize:11, fontWeight:700, color:'#0079a3', letterSpacing:'0.08em' }}>ADMIN</span>
        </div>
        <label className="adm-mini-btn" style={{ marginTop:16, cursor: uploadingAvatar ? 'default' : 'pointer', opacity: uploadingAvatar ? 0.7 : 1 }}>
          <Icon name={uploadingAvatar ? 'loader-2' : 'upload-cloud'} className={uploadingAvatar ? 'tbx-spin' : undefined} style={{ width:13, height:13 }} />
          {uploadingAvatar ? 'Subiendo…' : 'Cambiar foto de perfil'}
          <input type="file" accept="image/jpeg,image/png,image/webp" style={{ display:'none' }} onChange={handleAvatarChange} disabled={uploadingAvatar} />
        </label>
        {avatarError && <div style={{ fontSize:12, color:'#c0392b', marginTop:8 }}>{avatarError}</div>}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
        <form onSubmit={handleSaveInfo} className="adm-card" style={{ padding:24, display:'flex', flexDirection:'column', gap:16 }}>
          {cardHead('Información personal')}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <Field label="Nombre completo"><input value={fullName} onChange={e => setFullName(e.target.value)} /></Field>
            <Field label="Correo electrónico"><input type="email" value={email} onChange={e => setEmail(e.target.value)} /></Field>
          </div>
          {infoError && (
            <div style={{ fontSize:12.5, color:'#c0392b', background:'rgba(192,57,43,0.08)', border:'1px solid rgba(192,57,43,0.2)', borderRadius:8, padding:'9px 12px' }}>{infoError}</div>
          )}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:14 }}>
            {infoSaved && <span style={{ fontSize:13, fontWeight:700, color:'#16a34a', display:'inline-flex', alignItems:'center', gap:6 }}><Icon name="check-circle-2" style={{ width:15, height:15 }} />{infoSaved}</span>}
            <button type="submit" disabled={savingInfo} style={{ background:'linear-gradient(135deg, #0050C8 0%, #0080F0 100%)', color:'white', border:'none', borderRadius:11, padding:'11px 24px', fontSize:13.5, fontWeight:700, cursor: savingInfo ? 'default' : 'pointer', opacity: savingInfo ? 0.7 : 1, boxShadow:'0 2px 10px rgba(0,80,200,0.28)', display:'inline-flex', alignItems:'center', gap:8 }}>
              {savingInfo && <Icon name="loader-2" className="tbx-spin" style={{ width:14, height:14 }} />}
              {savingInfo ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </form>

        <div className="adm-card" style={{ padding:'8px 24px 20px' }}>
          <div style={{ padding:'16px 0 0' }}>{cardHead('Seguridad')}</div>
          <ProfileRow icon="key" title="Contraseña" desc="Cambia la contraseña de tu cuenta">
            <button type="button" className="adm-mini-btn" onClick={() => setShowPwdForm(p => !p)}><Icon name="lock" style={{ width:13, height:13 }} />Cambiar contraseña</button>
          </ProfileRow>
          {showPwdForm && (
            <form onSubmit={handleChangePassword} style={{ padding:'16px 0', display:'flex', flexDirection:'column', gap:14, borderBottom:'1px solid var(--gray-100)' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
                <Field label="Contraseña actual"><input type="password" autoComplete="current-password" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} placeholder="••••••••" /></Field>
                <Field label="Nueva contraseña"><input type="password" autoComplete="new-password" value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="••••••••" /></Field>
                <Field label="Confirmar"><input type="password" autoComplete="new-password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} placeholder="••••••••" /></Field>
              </div>
              {pwdError && (
                <div style={{ fontSize:12.5, color:'#c0392b', background:'rgba(192,57,43,0.08)', border:'1px solid rgba(192,57,43,0.2)', borderRadius:8, padding:'9px 12px' }}>{pwdError}</div>
              )}
              <div style={{ display:'flex', justifyContent:'flex-end' }}>
                <button type="submit" disabled={changingPwd} className="adm-mini-btn primary" style={{ display:'inline-flex', alignItems:'center', gap:6, opacity: changingPwd ? 0.7 : 1 }}>
                  {changingPwd && <Icon name="loader-2" className="tbx-spin" style={{ width:13, height:13 }} />}
                  {changingPwd ? 'Actualizando…' : 'Actualizar contraseña'}
                </button>
              </div>
            </form>
          )}
          {pwdSaved && (
            <div style={{ padding:'14px 0 0' }}>
              <span style={{ fontSize:13, fontWeight:700, color:'#16a34a', display:'inline-flex', alignItems:'center', gap:6 }}><Icon name="check-circle-2" style={{ width:15, height:15 }} />Contraseña actualizada.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
