import React from 'react';
import { Icon } from '../../components/shared/Icon.jsx';
import { LoadingState, ErrorState } from '../../components/shared/AsyncState.jsx';
import { useAsyncData } from '../../hooks/useAsyncData.js';
import * as adminServicesService from '../../services/adminServicesService.js';
import { Field, ConfirmDialog } from '../AdminWidgets.jsx';

// Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): el modal ahora
// edita la estructura real del catálogo (label/descripción/ícono/logo,
// más los grupos de ítems del popup público) contra la tabla `services` —
// antes solo editaba una lista de "puntos destacados" sueltos que no
// correspondía a nada de lo que realmente se muestra en el portal.
function ServiceEditModal({ service, onSave, onClose, saving, saveError }) {
  const [label, setLabel] = React.useState(service.label);
  const [description, setDescription] = React.useState(service.description);
  const [icon, setIcon] = React.useState(service.icon);
  const [logoUrl, setLogoUrl] = React.useState(service.logoUrl);
  const [fullName, setFullName] = React.useState(service.detail.fullName || '');
  const [intro, setIntro] = React.useState(service.detail.intro || '');
  const [groups, setGroups] = React.useState(service.detail.groups || []);

  const updateGroupName = (gi, val) => setGroups(groups.map((g,i) => i===gi ? { ...g, name: val } : g));
  const updateItem = (gi, ii, val) => setGroups(groups.map((g,i) => i===gi ? { ...g, items: g.items.map((it,ix) => ix===ii ? val : it) } : g));
  const addItem = (gi) => setGroups(groups.map((g,i) => i===gi ? { ...g, items: [...g.items, ''] } : g));
  const removeItem = (gi, ii) => setGroups(groups.map((g,i) => i===gi ? { ...g, items: g.items.filter((_,ix) => ix!==ii) } : g));
  const addGroup = () => setGroups([...groups, { name: 'Nuevo grupo', items: [''] }]);
  const removeGroup = (gi) => setGroups(groups.filter((_,i) => i!==gi));

  const handleSave = () => {
    onSave({
      label, description, icon, logo_url: logoUrl,
      detail: { fullName, intro, groups: groups.map(g => ({ ...g, items: g.items.filter(it => it.trim()) })).filter(g => g.name.trim()) },
    });
  };

  return (
    <div className="adm-modal-overlay" onClick={onClose}>
      <div className="adm-modal wide" onClick={e => e.stopPropagation()}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--gray-200)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize:17, fontWeight:700, color:'var(--navy-900,#021233)' }}>Editar {service.label}</div>
          <button onClick={onClose} style={{ background:'var(--gray-100)', border:'none', borderRadius:8, cursor:'pointer', color:'var(--gray-500)', padding:6, display:'flex' }}>
            <Icon name="x" style={{ width:16, height:16 }} />
          </button>
        </div>
        <div style={{ padding:'22px 24px', display:'flex', flexDirection:'column', gap:16, maxHeight:'64vh', overflowY:'auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <Field label="Nombre (tarjeta)"><input value={label} onChange={e => setLabel(e.target.value)} /></Field>
            <Field label="Ícono"><input value={icon} onChange={e => setIcon(e.target.value)} /></Field>
          </div>
          <Field label="Descripción corta (tarjeta)"><textarea style={{ minHeight:50 }} value={description} onChange={e => setDescription(e.target.value)}></textarea></Field>
          <Field label="URL del logo"><input value={logoUrl} onChange={e => setLogoUrl(e.target.value)} /></Field>
          <div style={{ borderTop:'1px solid var(--gray-200)', paddingTop:14 }}>
            <div style={{ fontSize:12, fontWeight:700, color:'var(--navy-900,#021233)', marginBottom:10 }}>Popup del servicio</div>
            <Field label="Nombre completo"><input value={fullName} onChange={e => setFullName(e.target.value)} /></Field>
            <Field label="Introducción"><textarea style={{ minHeight:50 }} value={intro} onChange={e => setIntro(e.target.value)}></textarea></Field>
          </div>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:'var(--navy-900,#021233)', marginBottom:8 }}>Grupos de servicios (ítems destacados)</div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {groups.map((g, gi) => (
                <div key={gi} style={{ border:'1px solid var(--gray-200)', borderRadius:10, padding:12, display:'flex', flexDirection:'column', gap:8 }}>
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <input style={{ flex:1, fontFamily:'inherit', fontSize:13, fontWeight:700, padding:'8px 10px', border:'1px solid var(--gray-200)', borderRadius:8 }} value={g.name} onChange={e => updateGroupName(gi, e.target.value)} />
                    <button className="adm-mini-btn danger" onClick={() => removeGroup(gi)}><Icon name="trash-2" style={{width:13,height:13}} /></button>
                  </div>
                  {g.items.map((it, ii) => (
                    <div key={ii} style={{ display:'flex', gap:8, alignItems:'center', paddingLeft:14 }}>
                      <Icon name="check-circle-2" style={{ width:14, height:14, color:'#0050C8', flexShrink:0 }} />
                      <input style={{ flex:1, fontFamily:'inherit', fontSize:13, padding:'8px 10px', border:'1px solid var(--gray-200)', borderRadius:8 }} value={it} onChange={e => updateItem(gi, ii, e.target.value)} />
                      <button className="adm-mini-btn danger" onClick={() => removeItem(gi, ii)}><Icon name="trash-2" style={{width:13,height:13}} /></button>
                    </div>
                  ))}
                  <button className="adm-mini-btn" style={{ marginLeft:14, alignSelf:'flex-start' }} onClick={() => addItem(gi)}><Icon name="plus" style={{width:13,height:13}} />Agregar ítem</button>
                </div>
              ))}
            </div>
            <button className="adm-mini-btn" style={{ marginTop:10 }} onClick={addGroup}><Icon name="plus" style={{width:13,height:13}} />Agregar grupo</button>
          </div>
        </div>
        {saveError && <div style={{ margin:'0 24px', fontSize:12.5, color:'#c0392b' }}>{saveError}</div>}
        <div style={{ padding:'16px 24px', borderTop:'1px solid var(--gray-200)', display:'flex', justifyContent:'flex-end', gap:10 }}>
          <button onClick={onClose} className="adm-mini-btn">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="adm-mini-btn primary">{saving ? 'Guardando…' : 'Guardar cambios'}</button>
        </div>
      </div>
    </div>
  );
}

// Ruta /admin/contenidos/servicios — antes la sección "services" del admin
// (Fase 1). Se agrupa bajo /admin/contenidos porque no tenía una ruta
// propia en la lista pedida para la Fase 2.
export function ServiciosPage() {
  const { status, data, error } = useAsyncData(() => adminServicesService.listServices(), []);
  const [services, setServices] = React.useState([]);
  const [editing, setEditing] = React.useState(null);
  const [confirming, setConfirming] = React.useState(null);
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState('');
  const [actionError, setActionError] = React.useState('');
  React.useEffect(() => { if (status === 'success') setServices(data || []); }, [status, data]);

  const handleSave = async (fields) => {
    setSaving(true);
    setSaveError('');
    try {
      await adminServicesService.updateService(editing.id, fields);
      setServices(services.map(s => s.id === editing.id ? { ...s, ...mapFieldsToLocal(fields) } : s));
      setEditing(null);
    } catch (err) {
      setSaveError(err.message || 'No se pudieron guardar los cambios.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    const id = confirming;
    setConfirming(null);
    setActionError('');
    try {
      await adminServicesService.deleteService(id);
      setServices(services.filter(s => s.id !== id));
    } catch (err) {
      setActionError(err.message || 'No se pudo eliminar el servicio.');
    }
  };

  if (status === 'loading') return <div className="adm-card" style={{ padding:20 }}><LoadingState label="Cargando servicios…" /></div>;
  if (status === 'error') return <div className="adm-card" style={{ padding:20 }}><ErrorState label="No pudimos cargar el catálogo de servicios." error={error} onRetry={() => window.location.reload()} /></div>;

  return (
    <div className="adm-card" style={{ padding:20 }}>
      <div style={{ fontSize:15, fontWeight:700, color:'var(--navy-900,#021233)', marginBottom:6 }}>Unidades de negocio</div>
      <div style={{ fontSize:12.5, color:'var(--gray-500)', marginBottom:16 }}>Este es el mismo catálogo que se muestra (u oculto hoy, ver `SHOW_SERVICES` en HomePage.jsx) en el bloque &quot;Servicios TIBOX&quot; del portal público.</div>
      {actionError && (
        <div style={{ marginBottom:14, fontSize:12.5, color:'#c0392b', background:'rgba(192,57,43,0.08)', border:'1px solid rgba(192,57,43,0.2)', borderRadius:8, padding:'9px 12px' }}>
          {actionError}
        </div>
      )}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14 }}>
        {services.map((s) => (
          <div key={s.id} style={{ border:'1px solid var(--gray-200)', borderRadius:12, padding:'14px 16px', display:'flex', flexDirection:'column', gap:12 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:36, height:36, borderRadius:9, background:'rgba(0,80,200,0.08)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon name={s.icon} style={{ width:17, height:17, color:'#0050C8' }} />
              </div>
              <div style={{ fontSize:13.5, fontWeight:700, color:'var(--navy-900,#021233)' }}>{s.label}</div>
            </div>
            <div style={{ fontSize:11.5, color:'var(--gray-400)' }}>{(s.detail.groups || []).reduce((n,g) => n + g.items.length, 0)} ítems destacados</div>
            <div style={{ display:'flex', gap:6 }}>
              <button className="adm-mini-btn" onClick={() => setEditing(s)}><Icon name="pencil" style={{width:13,height:13}} />Editar</button>
              <button className="adm-mini-btn danger" onClick={() => setConfirming(s.id)}><Icon name="trash-2" style={{width:13,height:13}} /></button>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <ServiceEditModal service={editing} onClose={() => { setEditing(null); setSaveError(''); }}
          onSave={handleSave} saving={saving} saveError={saveError} />
      )}
      {confirming !== null && (
        <ConfirmDialog title="¿Eliminar servicio?" message="Esta acción no se puede deshacer y el servicio desaparecerá del portal público."
          confirmLabel="Eliminar" onConfirm={confirmDelete} onCancel={() => setConfirming(null)} />
      )}
    </div>
  );
}

function mapFieldsToLocal(fields) {
  return {
    label: fields.label, description: fields.description, icon: fields.icon,
    logoUrl: fields.logo_url, detail: fields.detail,
  };
}
