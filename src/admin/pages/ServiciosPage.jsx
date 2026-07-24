import React from 'react';
import { Icon } from '../../components/shared/Icon.jsx';
import { LoadingState, ErrorState } from '../../components/shared/AsyncState.jsx';
import { useAsyncData } from '../../hooks/useAsyncData.js';
import * as adminService from '../../services/adminService.js';

function ServiceEditModal({ name, data, onSave, onClose }) {
  const [bullets, setBullets] = React.useState(data.bullets);
  const update = (i, v) => setBullets(bullets.map((b,ix) => ix===i ? v : b));
  return (
    <div className="adm-modal-overlay" onClick={onClose}>
      <div className="adm-modal wide" onClick={e => e.stopPropagation()}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--gray-200)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize:17, fontWeight:700, color:'var(--navy-900,#021233)' }}>Editar {name}</div>
          <button onClick={onClose} style={{ background:'var(--gray-100)', border:'none', borderRadius:8, cursor:'pointer', color:'var(--gray-500)', padding:6, display:'flex' }}>
            <Icon name="x" style={{ width:16, height:16 }} />
          </button>
        </div>
        <div style={{ padding:'22px 24px', display:'flex', flexDirection:'column', gap:16 }}>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:'var(--navy-900,#021233)', marginBottom:8 }}>Puntos destacados (popup del servicio)</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {bullets.map((b,i) => (
                <div key={i} style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <Icon name="check-circle-2" style={{ width:15, height:15, color:'#0050C8', flexShrink:0 }} />
                  <input style={{ flex:1, fontFamily:'inherit', fontSize:13.5, padding:'9px 11px', border:'1px solid var(--gray-200)', borderRadius:9 }} value={b} onChange={e => update(i, e.target.value)} />
                  <button className="adm-mini-btn danger" onClick={() => setBullets(bullets.filter((_,ix) => ix !== i))}><Icon name="trash-2" style={{width:13,height:13}} /></button>
                </div>
              ))}
            </div>
            <button className="adm-mini-btn" style={{ marginTop:10 }} onClick={() => setBullets([...bullets, ''])}><Icon name="plus" style={{width:13,height:13}} />Agregar punto</button>
          </div>
        </div>
        <div style={{ padding:'16px 24px', borderTop:'1px solid var(--gray-200)', display:'flex', justifyContent:'flex-end', gap:10 }}>
          <button onClick={onClose} className="adm-mini-btn">Cancelar</button>
          <button onClick={() => { onSave({ icon: data.icon, bullets: bullets.filter(b => b.trim()) }); onClose(); }} className="adm-mini-btn primary">Guardar cambios</button>
        </div>
      </div>
    </div>
  );
}

// Ruta /admin/contenidos/servicios — antes la sección "services" del admin
// (Fase 1). Se agrupa bajo /admin/contenidos porque no tenía una ruta
// propia en la lista pedida para la Fase 2.
export function ServiciosPage() {
  const { status, data, error } = useAsyncData(() => adminService.getDefaultServicesConfig(), []);
  const [services, setServices] = React.useState({});
  const [editing, setEditing] = React.useState(null);
  React.useEffect(() => { if (status === 'success') setServices(data || {}); }, [status, data]);

  if (status === 'loading') return <div className="adm-card" style={{ padding:20 }}><LoadingState label="Cargando servicios…" /></div>;
  if (status === 'error') return <div className="adm-card" style={{ padding:20 }}><ErrorState label="No pudimos cargar el catálogo de servicios." error={error} /></div>;

  return (
    <div className="adm-card" style={{ padding:20 }}>
      <div style={{ fontSize:15, fontWeight:700, color:'var(--navy-900,#021233)', marginBottom:16 }}>Unidades de negocio</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14 }}>
        {Object.entries(services).map(([name, data]) => (
          <div key={name} style={{ border:'1px solid var(--gray-200)', borderRadius:12, padding:'14px 16px', display:'flex', flexDirection:'column', gap:12 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:36, height:36, borderRadius:9, background:'rgba(0,80,200,0.08)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon name={data.icon} style={{ width:17, height:17, color:'#0050C8' }} />
              </div>
              <div style={{ fontSize:13.5, fontWeight:700, color:'var(--navy-900,#021233)' }}>{name}</div>
            </div>
            <div style={{ fontSize:11.5, color:'var(--gray-400)' }}>{data.bullets.length} puntos destacados</div>
            <button className="adm-mini-btn" onClick={() => setEditing(name)}><Icon name="pencil" style={{width:13,height:13}} />Editar</button>
          </div>
        ))}
      </div>
      {editing && (
        <ServiceEditModal name={editing} data={services[editing]} onClose={() => setEditing(null)}
          onSave={(newData) => setServices({ ...services, [editing]: newData })} />
      )}
    </div>
  );
}
