import React from 'react';
import { Icon } from '../components/shared/Icon.jsx';
import { LoadingState, EmptyState, ErrorState } from '../components/shared/AsyncState.jsx';
import { useDesignSystem } from '../context/DesignSystemContext.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import * as adminService from '../services/adminService.js';

export function statusTone(s) {
  if (s === 'Publicado' || s === 'Respondido' || s === 'Realizado') return 'success';
  if (s === 'Borrador' || s === 'Nuevo') return 'cyan';
  if (s === 'Próximo' || s === 'Programado') return 'warning';
  return 'gray';
}

export function Field({ label, children }) {
  return <div className="adm-field"><label>{label}</label>{children}</div>;
}

export function StatRow() {
  const { status, data, error } = useAsyncData(() => adminService.getDashboardStats(), []);
  if (status === 'loading') return <LoadingState label="Cargando estadísticas…" />;
  if (status === 'error') return <ErrorState label="No pudimos cargar las estadísticas del dashboard." onRetry={() => window.location.reload()} error={error} />;
  const stats = data || [];
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:18 }}>
      {stats.map((s,i) => (
        <div key={i} className="adm-card" style={{ padding:'18px 20px', display:'flex', flexDirection:'column', gap:8 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--gray-400)' }}>{s.label}</span>
            <div style={{ width:30, height:30, borderRadius:8, background:'rgba(0,80,200,0.08)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon name={s.icon} style={{ width:14, height:14, color:'#0050C8' }} />
            </div>
          </div>
          <div style={{ fontSize:26, fontWeight:700, color:'var(--navy-900,#021233)' }}>{s.value}</div>
        </div>
      ))}
    </div>
  );
}

export function RowMenu({ onAction }) {
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState({ top:0, left:0 });
  const btnRef = React.useRef(null);
  const toggle = () => {
    const r = btnRef.current.getBoundingClientRect();
    setPos({ top:r.bottom + 6, left:r.right - 184 });
    setOpen(o => !o);
  };
  const items = [
    { id:'view', icon:'eye', label:'Ver publicación' },
    { id:'edit', icon:'pencil', label:'Editar' },
    { id:'duplicate', icon:'copy', label:'Duplicar' },
    { id:'delete', icon:'trash-2', label:'Eliminar', danger:true },
  ];
  return (
    <React.Fragment>
      <button ref={btnRef} onClick={toggle} title="Acciones" style={{ background:open?'var(--gray-100)':'none', border:'none', cursor:'pointer', padding:5, borderRadius:7, display:'inline-flex', color:'var(--gray-500)' }}>
        <Icon name="more-horizontal" style={{ width:16, height:16 }} />
      </button>
      {open && (
        <React.Fragment>
          <div onClick={() => setOpen(false)} style={{ position:'fixed', inset:0, zIndex:400 }}></div>
          <div style={{ position:'fixed', top:pos.top, left:pos.left, width:184, background:'white', borderRadius:11, border:'1px solid var(--gray-200)', boxShadow:'0 10px 32px rgba(2,18,55,0.18)', zIndex:401, padding:6 }}>
            {items.map((it,ix) => (
              <React.Fragment key={it.id}>
                {it.danger && <div style={{ height:1, background:'var(--gray-100)', margin:'5px 4px' }}></div>}
                <button onClick={() => { setOpen(false); onAction(it.id); }} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'8px 10px', border:'none', background:'none', borderRadius:8, cursor:'pointer', fontSize:13, fontWeight:600, textAlign:'left', color: it.danger ? '#c0392b' : 'var(--navy-900,#021233)', fontFamily:'inherit' }}
                  onMouseEnter={e => e.currentTarget.style.background = it.danger ? 'rgba(192,57,43,0.06)' : 'var(--gray-50)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                  <Icon name={it.icon} style={{ width:14, height:14 }} />{it.label}
                </button>
              </React.Fragment>
            ))}
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel }) {
  return (
    <div className="adm-modal-overlay" style={{ zIndex:600 }} onClick={onCancel}>
      <div className="adm-modal" style={{ maxWidth:410 }} onClick={e => e.stopPropagation()}>
        <div style={{ padding:'24px 24px 4px', display:'flex', gap:14 }}>
          <div style={{ width:42, height:42, borderRadius:11, background:'rgba(192,57,43,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <Icon name="alert-triangle" style={{ width:20, height:20, color:'#c0392b' }} />
          </div>
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:'var(--navy-900,#021233)' }}>{title}</div>
            <p style={{ fontSize:13, color:'var(--gray-500)', lineHeight:1.55, margin:'6px 0 0' }}>{message}</p>
          </div>
        </div>
        <div style={{ padding:'18px 24px 20px', display:'flex', justifyContent:'flex-end', gap:10 }}>
          <button className="adm-mini-btn" onClick={onCancel}>Cancelar</button>
          <button className="adm-mini-btn" onClick={onConfirm} style={{ background:'#c0392b', color:'white', borderColor:'#c0392b' }}><Icon name="trash-2" style={{ width:13, height:13 }} />{confirmLabel || 'Eliminar'}</button>
        </div>
      </div>
    </div>
  );
}

export function ContentViewModal({ item, onClose }) {
  const { Badge } = useDesignSystem();
  return (
    <div className="adm-modal-overlay" onClick={onClose}>
      <div className="adm-modal" onClick={e => e.stopPropagation()}>
        <div style={{ height:140, background:'linear-gradient(135deg,#021233 0%,#0050C8 100%)', borderRadius:'18px 18px 0 0', display:'flex', alignItems:'flex-end', padding:'20px 24px', position:'relative' }}>
          <button onClick={onClose} style={{ position:'absolute', top:14, right:14, background:'rgba(255,255,255,0.16)', border:'none', borderRadius:8, cursor:'pointer', color:'white', padding:6, display:'flex' }}>
            <Icon name="x" style={{ width:16, height:16 }} />
          </button>
          <span style={{ fontSize:10.5, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'white', background:'rgba(255,255,255,0.16)', padding:'4px 11px', borderRadius:999 }}>{item.cat}</span>
        </div>
        <div style={{ padding:'20px 24px', display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ fontSize:18, fontWeight:700, color:'var(--navy-900,#021233)', lineHeight:1.3 }}>{item.title}</div>
          <div style={{ display:'flex', gap:18, alignItems:'center' }}>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              {Badge ? <Badge tone={statusTone(item.status)}>{item.status}</Badge> : <span>{item.status}</span>}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12.5, color:'var(--gray-500)' }}>
              <Icon name="calendar" style={{ width:14, height:14 }} />{item.date}
            </div>
          </div>
          <p style={{ fontSize:13.5, color:'var(--gray-500)', lineHeight:1.6, margin:0 }}>Vista previa de la publicación tal como aparece en el portal de clientes de TIBOX Connect.</p>
        </div>
        <div style={{ padding:'16px 24px', borderTop:'1px solid var(--gray-200)', display:'flex', justifyContent:'flex-end', gap:10 }}>
          <button className="adm-mini-btn" onClick={onClose}>Cerrar</button>
          <a href="/" target="_blank" className="adm-mini-btn primary"><Icon name="external-link" style={{ width:13, height:13 }} />Abrir en el portal</a>
        </div>
      </div>
    </div>
  );
}

const CONTENT_TYPE_CATEGORIES_FALLBACK = [];

export function NewContentModal({ section, item, onClose }) {
  const { data: categories } = useAsyncData(() => adminService.getContentTypeCategories(), []);
  const cats = categories || CONTENT_TYPE_CATEGORIES_FALLBACK;
  const newTitles = { videos:'Nuevo video o webinar', infographics:'Nueva infografía', news:'Nueva noticia', events:'Nuevo evento' };
  const editTitles = { videos:'Editar video o webinar', infographics:'Editar infografía', news:'Editar noticia', events:'Editar evento' };
  const titles = item ? editTitles : newTitles;
  const t = item ? item.title : '';
  const c = item ? item.cat : '';

  return (
    <div className="adm-modal-overlay" onClick={onClose}>
      <div className="adm-modal" onClick={e => e.stopPropagation()}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--gray-200)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize:17, fontWeight:700, color:'var(--navy-900,#021233)' }}>{titles[section]}</div>
          <button onClick={onClose} style={{ background:'var(--gray-100)', border:'none', borderRadius:8, cursor:'pointer', color:'var(--gray-500)', padding:6, display:'flex' }}>
            <Icon name="x" style={{ width:16, height:16 }} />
          </button>
        </div>

        <div style={{ padding:'22px 24px', display:'flex', flexDirection:'column', gap:16 }}>
          {section === 'videos' && (
            <React.Fragment>
              <Field label="Link del video"><input type="url" placeholder="https://youtube.com/watch?v=…" /></Field>
              <Field label="Título"><input type="text" placeholder="Título del video o webinar" defaultValue={t} /></Field>
              <Field label="Descripción"><textarea placeholder="Breve descripción del contenido…"></textarea></Field>
              <Field label="Categoría">
                <select defaultValue={c}><option value="">Selecciona una categoría</option>{cats.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select>
              </Field>
              <Field label="Fecha"><input type="date" /></Field>
            </React.Fragment>
          )}

          {section === 'infographics' && (
            <React.Fragment>
              <Field label="Imagen">
                <div className="adm-upload">
                  <Icon name="upload-cloud" style={{ width:24, height:24, marginBottom:8 }} />
                  <div style={{ fontSize:13, fontWeight:600 }}>Arrastra una imagen o haz clic para subir</div>
                  <input type="file" accept="image/*" style={{ display:'none' }} />
                </div>
              </Field>
              <Field label="Título"><input type="text" placeholder="Título de la infografía" defaultValue={t} /></Field>
              <Field label="Categoría">
                <select defaultValue={c}><option value="">Selecciona una categoría</option>{cats.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select>
              </Field>
              <Field label="Link de la publicación"><input type="url" placeholder="https://…" /></Field>
            </React.Fragment>
          )}

          {section === 'news' && (
            <React.Fragment>
              <Field label="Título de la noticia"><input type="text" placeholder="Título de la noticia" defaultValue={t} /></Field>
              <Field label="Categoría">
                <select defaultValue={c}><option value="">Selecciona una categoría</option>{cats.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select>
              </Field>
              <Field label="Información"><textarea placeholder="Contenido de la noticia…" style={{ minHeight:130 }}></textarea></Field>
            </React.Fragment>
          )}

          {section === 'events' && (
            <React.Fragment>
              <Field label="Título del evento"><input type="text" placeholder="Título del evento" defaultValue={t} /></Field>
              <Field label="Modalidad">
                <select><option value="">Selecciona una modalidad</option><option>Presencial</option><option>Online</option><option>Híbrida</option></select>
              </Field>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <Field label="Fecha"><input type="date" /></Field>
                <Field label="Hora"><input type="time" /></Field>
              </div>
              <Field label="Breve reseña"><textarea placeholder="Descripción breve del evento…"></textarea></Field>
              <Field label="Logo del partner">
                <div className="adm-upload">
                  <Icon name="upload-cloud" style={{ width:24, height:24, marginBottom:8 }} />
                  <div style={{ fontSize:13, fontWeight:600 }}>Sube el logo del partner</div>
                  <input type="file" accept="image/*" style={{ display:'none' }} />
                </div>
              </Field>
            </React.Fragment>
          )}
        </div>

        <div style={{ padding:'16px 24px', borderTop:'1px solid var(--gray-200)', display:'flex', justifyContent:'flex-end', gap:10 }}>
          <button onClick={onClose} style={{ background:'white', border:'1px solid var(--gray-200)', borderRadius:10, padding:'10px 18px', fontSize:13, fontWeight:600, color:'var(--gray-600)', cursor:'pointer' }}>Cancelar</button>
          <button onClick={onClose} style={{ background:'#0050C8', color:'white', border:'none', borderRadius:10, padding:'10px 20px', fontSize:13, fontWeight:700, cursor:'pointer' }}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

export function ContentTable({ section, title }) {
  const { status, data, error } = useAsyncData(() => adminService.getContentItems(section), [section]);
  const [rows, setRows] = React.useState([]);
  const [viewing, setViewing] = React.useState(null);
  const [editing, setEditing] = React.useState(null);
  const [confirming, setConfirming] = React.useState(null);
  React.useEffect(() => { if (status === 'success') setRows(data || []); }, [status, data]);

  const editSection = ['videos','infographics','news','events'].includes(section) ? section : 'news';
  const handle = (action, i) => {
    if (action === 'view') setViewing(rows[i]);
    else if (action === 'edit') setEditing(rows[i]);
    else if (action === 'duplicate') {
      const dup = { ...rows[i], title: rows[i].title + ' (copia)', status:'Borrador' };
      setRows([...rows.slice(0,i+1), dup, ...rows.slice(i+1)]);
    } else if (action === 'delete') setConfirming(i);
  };

  if (status === 'loading') {
    return (
      <div className="adm-card">
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--gray-200)' }}>
          <div style={{ fontSize:15, fontWeight:700, color:'var(--navy-900,#021233)' }}>{title || 'Contenido publicado'}</div>
        </div>
        <LoadingState label="Cargando publicaciones…" />
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="adm-card">
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--gray-200)' }}>
          <div style={{ fontSize:15, fontWeight:700, color:'var(--navy-900,#021233)' }}>{title || 'Contenido publicado'}</div>
        </div>
        <ErrorState label="No pudimos cargar las publicaciones." error={error} />
      </div>
    );
  }

  return (
    <div className="adm-card">
      <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--gray-200)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ fontSize:15, fontWeight:700, color:'var(--navy-900,#021233)' }}>{title || 'Contenido publicado'}</div>
        <span style={{ fontSize:12, color:'var(--gray-400)' }}>{rows.length} elementos</span>
      </div>
      {rows.length === 0 ? (
        <EmptyState label="Todavía no hay publicaciones en esta sección." icon="inbox" />
      ) : (
        <table className="adm-table">
          <thead><tr><th>Título</th><th>Categoría</th><th>Estado</th><th>Fecha</th><th></th></tr></thead>
          <tbody>
            {rows.map((r,i) => (
              <tr key={i}>
                <td style={{ fontWeight:600 }}>{r.title}</td>
                <td style={{ color:'var(--gray-500)' }}>{r.cat}</td>
                <td><StatusBadge status={r.status} /></td>
                <td style={{ color:'var(--gray-500)' }}>{r.date}</td>
                <td style={{ textAlign:'right' }}>
                  <RowMenu onAction={a => handle(a, i)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {viewing && <ContentViewModal item={viewing} onClose={() => setViewing(null)} />}
      {editing && <NewContentModal section={editSection} item={editing} onClose={() => setEditing(null)} />}
      {confirming !== null && (
        <ConfirmDialog title="Eliminar publicación"
          message={`¿Seguro que deseas eliminar "${rows[confirming].title}"? Esta acción no se puede deshacer.`}
          onCancel={() => setConfirming(null)}
          onConfirm={() => { setRows(rows.filter((_,ix) => ix !== confirming)); setConfirming(null); }} />
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const { Badge } = useDesignSystem();
  return Badge ? <Badge tone={statusTone(status)}>{status}</Badge> :
    <span style={{ fontSize:11, fontWeight:700, borderRadius:999, padding:'3px 10px', background:'var(--gray-100)' }}>{status}</span>;
}

function MessageViewModal({ msg, onClose }) {
  return (
    <div className="adm-modal-overlay" onClick={onClose}>
      <div className="adm-modal" onClick={e => e.stopPropagation()}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--gray-200)', display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
          <div>
            <div style={{ fontSize:17, fontWeight:700, color:'var(--navy-900,#021233)' }}>{msg.name}</div>
            <div style={{ fontSize:12.5, color:'var(--gray-500)', marginTop:2 }}>{msg.email}</div>
          </div>
          <button onClick={onClose} style={{ background:'var(--gray-100)', border:'none', borderRadius:8, cursor:'pointer', color:'var(--gray-500)', padding:6, display:'flex', flexShrink:0 }}>
            <Icon name="x" style={{ width:16, height:16 }} />
          </button>
        </div>
        <div style={{ padding:'20px 24px', display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
            {[['Empresa', msg.empresa],['Servicio', msg.servicio],['Fecha', msg.fecha]].map(([lb,vl],i) => (
              <div key={i} style={{ background:'var(--gray-50)', border:'1px solid var(--gray-200)', borderRadius:10, padding:'9px 11px' }}>
                <div style={{ fontSize:9.5, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--gray-400)' }}>{lb}</div>
                <div style={{ fontSize:12.5, fontWeight:700, color:'var(--navy-900,#021233)' }}>{vl}</div>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--gray-400)', marginBottom:6 }}>Mensaje</div>
            <p style={{ fontSize:13.5, color:'var(--navy-900,#021233)', lineHeight:1.6, margin:0 }}>{msg.mensaje}</p>
          </div>
        </div>
        <div style={{ padding:'16px 24px', borderTop:'1px solid var(--gray-200)', display:'flex', justifyContent:'flex-end', gap:10 }}>
          <button onClick={onClose} className="adm-mini-btn">Cerrar</button>
          <a href={`mailto:${msg.email}`} className="adm-mini-btn primary"><Icon name="reply" style={{width:13,height:13}} />Responder</a>
        </div>
      </div>
    </div>
  );
}

export function MessagesTable() {
  const { status, data, error } = useAsyncData(() => adminService.getMessages(), []);
  const [rows, setRows] = React.useState([]);
  const [viewing, setViewing] = React.useState(null);
  React.useEffect(() => { if (status === 'success') setRows(data || []); }, [status, data]);

  if (status === 'loading') {
    return (
      <div className="adm-card">
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--gray-200)' }}><div style={{ fontSize:15, fontWeight:700, color:'var(--navy-900,#021233)' }}>Bandeja de mensajes</div></div>
        <LoadingState label="Cargando mensajes…" />
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="adm-card">
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--gray-200)' }}><div style={{ fontSize:15, fontWeight:700, color:'var(--navy-900,#021233)' }}>Bandeja de mensajes</div></div>
        <ErrorState label="No pudimos cargar los mensajes." error={error} />
      </div>
    );
  }

  return (
    <div className="adm-card">
      <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--gray-200)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ fontSize:15, fontWeight:700, color:'var(--navy-900,#021233)' }}>Bandeja de mensajes</div>
        <span style={{ fontSize:12, color:'var(--gray-400)' }}>{rows.length} mensajes</span>
      </div>
      {rows.length === 0 ? (
        <EmptyState label="No hay mensajes de contacto todavía." icon="mail" />
      ) : (
        <table className="adm-table">
          <thead><tr><th>Contacto</th><th>Empresa</th><th>Servicio</th><th>Fecha</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            {rows.map((m,i) => (
              <tr key={i}>
                <td style={{ fontWeight:600 }}>{m.name}</td>
                <td style={{ color:'var(--gray-500)' }}>{m.empresa}</td>
                <td style={{ color:'var(--gray-500)' }}>{m.servicio}</td>
                <td style={{ color:'var(--gray-500)' }}>{m.fecha}</td>
                <td><StatusBadge status={m.estado} /></td>
                <td style={{ textAlign:'right', whiteSpace:'nowrap' }}>
                  <div style={{ display:'inline-flex', gap:6 }}>
                    <button className="adm-mini-btn" onClick={() => setViewing(m)}><Icon name="eye" style={{width:13,height:13}} />Ver mensaje</button>
                    <button className="adm-mini-btn danger" onClick={() => setRows(rows.filter((_,ix) => ix !== i))}><Icon name="trash-2" style={{width:13,height:13}} />Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {viewing && <MessageViewModal msg={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}

export function OpinionsPanel() {
  const { status, data, error } = useAsyncData(() => adminService.getOpinions(), []);
  const [viewing, setViewing] = React.useState(null);
  const opinions = data || [];

  if (status === 'loading') {
    return (
      <div className="adm-card">
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--gray-200)' }}><div style={{ fontSize:15, fontWeight:700, color:'var(--navy-900,#021233)' }}>Opiniones recibidas</div></div>
        <LoadingState label="Cargando opiniones…" />
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="adm-card">
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--gray-200)' }}><div style={{ fontSize:15, fontWeight:700, color:'var(--navy-900,#021233)' }}>Opiniones recibidas</div></div>
        <ErrorState label="No pudimos cargar las opiniones." error={error} />
      </div>
    );
  }

  return (
    <div className="adm-card">
      <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--gray-200)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ fontSize:15, fontWeight:700, color:'var(--navy-900,#021233)' }}>Opiniones recibidas</div>
        <span style={{ fontSize:12, color:'var(--gray-400)' }}>{opinions.length} opiniones</span>
      </div>
      {opinions.length === 0 ? (
        <EmptyState label="Todavía no hay opiniones de clientes." icon="star" />
      ) : (
        <table className="adm-table">
          <thead><tr><th>Nombre</th><th>Email</th><th>Calificación</th><th>Fecha</th><th></th></tr></thead>
          <tbody>
            {opinions.map((o,i) => (
              <tr key={i}>
                <td style={{ fontWeight:600 }}>{o.name}</td>
                <td style={{ color:'var(--gray-500)' }}>{o.email}</td>
                <td>
                  <div style={{ display:'flex', gap:1 }}>
                    {[1,2,3,4,5].map(n => <Icon key={n} name="star" style={{ width:13, height:13, color: n<=o.rating ? '#FFC600' : 'var(--gray-200)', fill: n<=o.rating ? '#FFC600' : 'none' }} />)}
                  </div>
                </td>
                <td style={{ color:'var(--gray-500)' }}>{o.fecha}</td>
                <td style={{ textAlign:'right' }}>
                  <button className="adm-mini-btn" onClick={() => setViewing(o)}><Icon name="eye" style={{width:13,height:13}} />Ver mensaje</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {viewing && (
        <div className="adm-modal-overlay" onClick={() => setViewing(null)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--gray-200)', display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
              <div>
                <div style={{ fontSize:17, fontWeight:700, color:'var(--navy-900,#021233)' }}>{viewing.name}</div>
                <div style={{ fontSize:12.5, color:'var(--gray-500)', marginTop:2 }}>{viewing.email}</div>
                <div style={{ display:'flex', gap:1, marginTop:6 }}>
                  {[1,2,3,4,5].map(n => <Icon key={n} name="star" style={{ width:14, height:14, color: n<=viewing.rating ? '#FFC600' : 'var(--gray-200)', fill: n<=viewing.rating ? '#FFC600' : 'none' }} />)}
                </div>
              </div>
              <button onClick={() => setViewing(null)} style={{ background:'var(--gray-100)', border:'none', borderRadius:8, cursor:'pointer', color:'var(--gray-500)', padding:6, display:'flex', flexShrink:0 }}>
                <Icon name="x" style={{ width:16, height:16 }} />
              </button>
            </div>
            <div style={{ padding:'20px 24px' }}>
              <p style={{ fontSize:13.5, color:'var(--navy-900,#021233)', lineHeight:1.6, margin:0 }}>{viewing.mensaje}</p>
            </div>
            <div style={{ padding:'16px 24px', borderTop:'1px solid var(--gray-200)', display:'flex', justifyContent:'flex-end' }}>
              <button onClick={() => setViewing(null)} className="adm-mini-btn">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
