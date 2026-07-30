import React from 'react';
import { Icon } from '../components/shared/Icon.jsx';
import { LoadingState, EmptyState, ErrorState } from '../components/shared/AsyncState.jsx';
import { Pagination } from '../components/shared/Pagination.jsx';
import { useDesignSystem } from '../context/DesignSystemContext.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import * as adminService from '../services/adminService.js';
import * as adminContentService from '../services/adminContentService.js';
import * as adminEventsService from '../services/adminEventsService.js';
import * as adminLeadsService from '../services/adminLeadsService.js';
import * as categoryService from '../services/categoryService.js';
import * as storageService from '../services/storageService.js';
import { getYouTubeThumbnailUrl } from '../lib/youtube.js';

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

// Menú de acciones de una fila de contenido/evento. Los ítems disponibles
// dependen del estado actual de la fila (no tiene sentido ofrecer
// "Publicar" sobre algo ya publicado) — ver ContentTable más abajo, que es
// quien realmente ejecuta cada acción contra Supabase.
function buildRowMenuItems(row, isEvent) {
  const items = [
    { id:'view', icon:'eye', label:'Ver publicación' },
    { id:'edit', icon:'pencil', label:'Editar' },
    { id:'duplicate', icon:'copy', label:'Duplicar' },
  ];
  if (row.rawStatus !== 'published') items.push({ id:'publish', icon:'upload', label:'Publicar' });
  if (isEvent && row.rawStatus !== 'completed') items.push({ id:'complete', icon:'check-circle-2', label:'Marcar como realizado' });
  if (!isEvent) items.push({ id: row.isFeatured ? 'unfeature' : 'feature', icon:'star', label: row.isFeatured ? 'Quitar destacado' : 'Marcar como destacado' });
  if (row.rawStatus !== 'archived') items.push({ id:'archive', icon:'archive', label:'Archivar' });
  if (row.rawStatus !== 'draft') items.push({ id:'draft', icon:'file-edit', label:'Volver a borrador' });
  items.push({ id:'delete', icon:'trash-2', label:'Eliminar', danger:true });
  return items;
}

// `readOnly` (ver ajuste posterior, panel "Publicaciones recientes" del
// Dashboard): esa tabla mezcla videos/infografías/noticias en un solo
// listado — el modal de edición necesita saber el tipo exacto de cada fila
// para mostrar los campos correctos, dato que este resumen no expone. En
// vez de arriesgar un modal con campos equivocados, se limita a "Ver
// publicación" (solo lectura) y se deja Editar/Eliminar/etc. para la
// sección real de cada tipo.
export function RowMenu({ row, isEvent, onAction, readOnly }) {
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState({ top:0, left:0 });
  const btnRef = React.useRef(null);
  const toggle = () => {
    const r = btnRef.current.getBoundingClientRect();
    setPos({ top:r.bottom + 6, left:r.right - 200 });
    setOpen(o => !o);
  };
  const items = readOnly ? [{ id:'view', icon:'eye', label:'Ver publicación' }] : buildRowMenuItems(row, isEvent);
  return (
    <React.Fragment>
      <button ref={btnRef} onClick={toggle} title="Acciones" style={{ background:open?'var(--gray-100)':'none', border:'none', cursor:'pointer', padding:5, borderRadius:7, display:'inline-flex', color:'var(--gray-500)' }}>
        <Icon name="more-horizontal" style={{ width:16, height:16 }} />
      </button>
      {open && (
        <React.Fragment>
          <div onClick={() => setOpen(false)} style={{ position:'fixed', inset:0, zIndex:400 }}></div>
          <div style={{ position:'fixed', top:pos.top, left:pos.left, width:200, background:'white', borderRadius:11, border:'1px solid var(--gray-200)', boxShadow:'0 10px 32px rgba(2,18,55,0.18)', zIndex:401, padding:6 }}>
            {items.map((it) => (
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

// Ajuste posterior (auditoría del panel admin): "Abrir en el portal" era un
// link fijo a "/" sin importar qué contenido se estuviera viendo — nunca
// llevaba al item real. Videos tienen página propia (/videoteca/:slug);
// infografías y noticias no tienen una ruta por item (se abren en un popup
// desde su listado), así que el mejor destino posible es esa página de
// listado; eventos tampoco tienen detalle propio, van a /eventos.
function contentPublicUrl(item, section) {
  if (section === 'events') return '/eventos';
  const type = item.type || (section === 'videos' ? 'video' : section === 'infographics' ? 'infographic' : section === 'news' ? 'news' : null);
  if (type === 'video') return item.slug ? `/videoteca/${item.slug}` : '/videoteca';
  if (type === 'infographic') return '/infografias';
  if (type === 'news') return '/tendencias';
  return '/';
}

export function ContentViewModal({ item, section, onClose }) {
  const { Badge } = useDesignSystem();
  const publicUrl = contentPublicUrl(item, section);
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
          {(item.summary || item.description) && (
            <p style={{ fontSize:13.5, color:'var(--gray-500)', lineHeight:1.6, margin:0 }}>{item.description || item.summary}</p>
          )}
        </div>
        <div style={{ padding:'16px 24px', borderTop:'1px solid var(--gray-200)', display:'flex', justifyContent:'flex-end', gap:10 }}>
          <button className="adm-mini-btn" onClick={onClose}>Cerrar</button>
          <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="adm-mini-btn primary"><Icon name="external-link" style={{ width:13, height:13 }} />Abrir en el portal</a>
        </div>
      </div>
    </div>
  );
}

const SECTION_TO_TYPE = { videos: 'video', infographics: 'infographic', news: 'news' };

// Pieza de subida de archivo en sí (sin el <Field> envolvente), reutilizada
// tanto por ImageUploadField (subida-solamente, para el banner de eventos)
// como por ImageUploadOrUrlField (subida + URL, para noticias/infografías).
function ImageUploadInner({ value, onChange }) {
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [dragOver, setDragOver] = React.useState(false);

  const processFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const url = await storageService.uploadContentImage(file);
      onChange(url);
    } catch (err) {
      setError(err.message || 'No se pudo subir la imagen.');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
    // Permite volver a elegir el mismo archivo dos veces seguidas (el
    // navegador no dispara "change" si el value no cambió).
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  return (
    <React.Fragment>
      {value && (
        <div style={{ marginBottom:10, borderRadius:10, overflow:'hidden', border:'1px solid var(--gray-200)', maxHeight:140 }}>
          <img src={value} alt="" style={{ width:'100%', maxHeight:140, objectFit:'cover', display:'block' }} />
        </div>
      )}
      {/* <label> (no <div>) es lo que hace que el clic abra el selector de
          archivos nativo del sistema operativo — un <input type="file">
          dentro de un <label> se asocia implícitamente con él sin necesitar
          htmlFor/id ni un manejador de clic manual (mismo patrón ya usado en
          PerfilPage.jsx para la foto de perfil). El <div> original nunca
          tuvo esa asociación, por eso el clic no hacía nada. */}
      <label
        className="adm-upload"
        style={{
          display: 'block',
          cursor: uploading ? 'default' : 'pointer',
          borderColor: dragOver ? '#0050C8' : undefined,
          background: dragOver ? 'rgba(0,80,200,0.03)' : undefined,
        }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <Icon name="upload-cloud" style={{ width:24, height:24, marginBottom:8 }} />
        <div style={{ fontSize:13, fontWeight:600 }}>{uploading ? 'Subiendo…' : value ? 'Reemplazar imagen' : 'Arrastra una imagen o haz clic para subir'}</div>
        <input type="file" accept="image/jpeg,image/png,image/webp" style={{ display:'none' }} onChange={handleInputChange} disabled={uploading} />
      </label>
      {error && <div style={{ fontSize:12, color:'#c0392b', marginTop:6 }}>{error}</div>}
    </React.Fragment>
  );
}

// Alternativa a subir un archivo: pegar la URL de una imagen ya alojada en
// otro lugar. thumbnail_url queda con ese link tal cual, sin pasar por
// Supabase Storage. `key={value}` en el <img> fuerza a React a remontarlo
// cada vez que cambia la URL, para que onLoad/onError se disparen de nuevo
// en cada intento (en vez de quedar pegados al resultado del link anterior).
function ImageUrlInner({ value, onChange }) {
  const [status, setStatus] = React.useState(value ? 'checking' : 'idle');

  const handleChange = (e) => {
    const url = e.target.value.trim();
    onChange(url);
    setStatus(url ? 'checking' : 'idle');
  };

  return (
    <React.Fragment>
      <input type="url" placeholder="https://ejemplo.com/imagen.jpg" value={value} onChange={handleChange} />
      {value && (
        <div style={{ marginTop:10 }}>
          <div style={{ borderRadius:10, overflow:'hidden', border:'1px solid var(--gray-200)', maxHeight:140, background:'var(--gray-50)', display: status === 'error' ? 'none' : 'block' }}>
            <img
              key={value}
              src={value}
              alt=""
              style={{ width:'100%', maxHeight:140, objectFit:'cover', display:'block' }}
              onLoad={() => setStatus('valid')}
              onError={() => setStatus('error')}
            />
          </div>
          {status === 'checking' && <div style={{ fontSize:12, color:'var(--gray-400)', marginTop:6 }}>Comprobando la imagen…</div>}
          {status === 'error' && <div style={{ fontSize:12, color:'#c0392b', marginTop:6 }}>No pudimos cargar una imagen desde esa URL. Verifica el link (puedes guardar igual, pero probablemente tampoco se vea en el portal).</div>}
        </div>
      )}
    </React.Fragment>
  );
}

function ImageUploadField({ label, value, onChange }) {
  return (
    <Field label={label}>
      <ImageUploadInner value={value} onChange={onChange} />
    </Field>
  );
}

// Usado solo en noticias e infografías (ver pedido explícito de Braulio):
// deja elegir entre subir un archivo o pegar una URL ya alojada en otro
// lugar. Ambas vías terminan escribiendo el mismo valor (thumbnail_url) vía
// el mismo onChange — el formulario que las usa no necesita saber cuál se
// usó.
function ImageUploadOrUrlField({ label, value, onChange }) {
  const [mode, setMode] = React.useState('upload');

  const tabStyle = (active) => ({
    flex: 1, textAlign: 'center', fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
    padding: '8px 10px', borderRadius: 8, border: '1px solid ' + (active ? '#0050C8' : 'var(--gray-200)'),
    background: active ? '#0050C8' : 'white', color: active ? 'white' : 'var(--gray-600)',
  });

  return (
    <Field label={label}>
      <div style={{ display:'flex', gap:8, marginBottom:10 }}>
        <button type="button" onClick={() => setMode('upload')} style={tabStyle(mode === 'upload')}>Subir archivo</button>
        <button type="button" onClick={() => setMode('url')} style={tabStyle(mode === 'url')}>o pega una URL</button>
      </div>
      {mode === 'upload'
        ? <ImageUploadInner value={value} onChange={onChange} />
        : <ImageUrlInner value={value} onChange={onChange} />}
    </Field>
  );
}

export function NewContentModal({ section, item, onClose }) {
  const isEvent = section === 'events';
  const { data: categoriesData } = useAsyncData(() => (isEvent ? Promise.resolve([]) : categoryService.getActiveCategories()), [isEvent]);
  const cats = categoriesData || [];

  const [title, setTitle] = React.useState(item?.title || '');
  const [categoryId, setCategoryId] = React.useState(item?.categoryId || '');
  const [summary, setSummary] = React.useState(item?.summary || '');
  const [description, setDescription] = React.useState(item?.description || '');
  const [thumbnailUrl, setThumbnailUrl] = React.useState(item?.thumbnailUrl || '');
  const [externalUrl, setExternalUrl] = React.useState(item?.externalUrl || '');
  const [sourceName, setSourceName] = React.useState(item?.sourceName || '');
  const [durationMinutes, setDurationMinutes] = React.useState(item?.durationMinutes || '');
  const [isFeatured, setIsFeatured] = React.useState(item?.isFeatured || false);
  const [status, setStatus] = React.useState(item?.rawStatus || 'draft');
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState('');

  // Solo eventos
  const [modality, setModality] = React.useState(item?.modality || 'online');
  const [location, setLocation] = React.useState(item?.location || '');
  const [partnerName, setPartnerName] = React.useState(item?.partnerName || '');
  const [registrationUrl, setRegistrationUrl] = React.useState(item?.registrationUrl || '');
  const [visibility, setVisibility] = React.useState(item?.visibility || 'public');
  const [startDate, setStartDate] = React.useState(item?.startsAt ? item.startsAt.slice(0, 10) : '');
  const [startTime, setStartTime] = React.useState(item?.startsAt ? item.startsAt.slice(11, 16) : '');
  const [endDate, setEndDate] = React.useState(item?.endsAt ? item.endsAt.slice(0, 10) : '');
  const [endTime, setEndTime] = React.useState(item?.endsAt ? item.endsAt.slice(11, 16) : '');

  const newTitles = { videos:'Nuevo video o webinar', infographics:'Nueva infografía', news:'Nueva noticia', events:'Nuevo evento' };
  const editTitles = { videos:'Editar video o webinar', infographics:'Editar infografía', news:'Editar noticia', events:'Editar evento' };
  const titles = item ? editTitles : newTitles;

  const handleVideoUrlChange = (e) => {
    const url = e.target.value;
    setExternalUrl(url);
    const thumb = getYouTubeThumbnailUrl(url);
    if (thumb) setThumbnailUrl(thumb);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError('');
    if (!title.trim()) { setSaveError('El título es obligatorio.'); return; }
    if (isEvent && (!startDate || !startTime)) { setSaveError('La fecha y hora de inicio son obligatorias.'); return; }

    setSaving(true);
    try {
      if (isEvent) {
        const startsAt = new Date(`${startDate}T${startTime}`).toISOString();
        const endsAt = endDate && endTime ? new Date(`${endDate}T${endTime}`).toISOString() : null;
        // Ajuste posterior (auditoría del panel admin): no había ninguna
        // validación que impidiera guardar un evento con término anterior
        // al inicio — ni acá ni en la base (la columna `ends_at` no tiene
        // un check constraint para esto).
        if (endsAt && endsAt <= startsAt) {
          setSaveError('La fecha y hora de término deben ser posteriores al inicio.');
          setSaving(false);
          return;
        }
        const fields = {
          title: title.trim(),
          summary: summary || null,
          description: description || null,
          modality,
          location: location || null,
          thumbnail_url: thumbnailUrl || null,
          registration_url: registrationUrl || null,
          partner_name: partnerName || null,
          visibility,
          status,
          starts_at: startsAt,
          ends_at: endsAt,
        };
        if (item) await adminEventsService.updateEvent(item.id, fields);
        else await adminEventsService.createEvent(fields);
      } else {
        const fields = {
          title: title.trim(),
          category_id: categoryId || null,
          summary: summary || null,
          thumbnail_url: thumbnailUrl || null,
          external_url: externalUrl || null,
          source_name: sourceName || null,
          duration_minutes: durationMinutes ? Number(durationMinutes) : null,
          visibility: 'public',
          status,
          is_featured: isFeatured,
        };
        if (status === 'published' && item?.rawStatus !== 'published') {
          fields.published_at = new Date().toISOString();
        }
        if (item) await adminContentService.updateContentItem(item.id, fields);
        else await adminContentService.createContentItem(SECTION_TO_TYPE[section], fields);
      }
      // Recarga completa tras guardar: ContentTable vuelve a leer de
      // Supabase con datos reales. Es una simplificación deliberada para
      // esta fase (ver decisiones en FASE-06-07-08-CONTENIDO-REAL.md) en vez
      // de propagar el nuevo/actualizado item entre componentes que hoy no
      // comparten estado (el botón "Nuevo" vive en AdminLayout, la tabla en
      // la página de la ruta).
      window.location.reload();
    } catch (err) {
      setSaveError(err.message || 'No se pudo guardar. Inténtalo nuevamente.');
      setSaving(false);
    }
  };

  return (
    <div className="adm-modal-overlay" onClick={onClose}>
      <div className="adm-modal" onClick={e => e.stopPropagation()}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--gray-200)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize:17, fontWeight:700, color:'var(--navy-900,#021233)' }}>{titles[section]}</div>
          <button onClick={onClose} style={{ background:'var(--gray-100)', border:'none', borderRadius:8, cursor:'pointer', color:'var(--gray-500)', padding:6, display:'flex' }}>
            <Icon name="x" style={{ width:16, height:16 }} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ padding:'22px 24px', display:'flex', flexDirection:'column', gap:16 }}>
            {section === 'videos' && (
              <React.Fragment>
                <Field label="Link del video (YouTube)">
                  <input type="url" placeholder="https://youtube.com/watch?v=…" value={externalUrl} onChange={handleVideoUrlChange} />
                </Field>
                {thumbnailUrl && (
                  <div style={{ borderRadius:10, overflow:'hidden', border:'1px solid var(--gray-200)', maxHeight:140 }}>
                    <img src={thumbnailUrl} alt="" style={{ width:'100%', maxHeight:140, objectFit:'cover', display:'block' }} />
                  </div>
                )}
                <Field label="Título"><input type="text" placeholder="Título del video o webinar" value={title} onChange={e => setTitle(e.target.value)} /></Field>
                <Field label="Descripción"><textarea placeholder="Breve descripción del contenido…" value={summary} onChange={e => setSummary(e.target.value)}></textarea></Field>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  <Field label="Categoría">
                    <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                      <option value="">Selecciona una categoría</option>
                      {cats.map(cat => <option key={cat.dbId} value={cat.dbId}>{cat.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Duración (minutos)"><input type="number" min="0" placeholder="24" value={durationMinutes} onChange={e => setDurationMinutes(e.target.value)} /></Field>
                </div>
              </React.Fragment>
            )}

            {section === 'infographics' && (
              <React.Fragment>
                <ImageUploadOrUrlField label="Imagen" value={thumbnailUrl} onChange={setThumbnailUrl} />
                <Field label="Título"><input type="text" placeholder="Título de la infografía" value={title} onChange={e => setTitle(e.target.value)} /></Field>
                <Field label="Resumen"><textarea placeholder="Breve resumen de la infografía…" value={summary} onChange={e => setSummary(e.target.value)}></textarea></Field>
                <Field label="Categoría">
                  <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                    <option value="">Selecciona una categoría</option>
                    {cats.map(cat => <option key={cat.dbId} value={cat.dbId}>{cat.label}</option>)}
                  </select>
                </Field>
                <Field label="Link de la publicación"><input type="url" placeholder="https://…" value={externalUrl} onChange={e => setExternalUrl(e.target.value)} /></Field>
              </React.Fragment>
            )}

            {section === 'news' && (
              <React.Fragment>
                <ImageUploadOrUrlField label="Imagen" value={thumbnailUrl} onChange={setThumbnailUrl} />
                <Field label="Título de la noticia"><input type="text" placeholder="Título de la noticia" value={title} onChange={e => setTitle(e.target.value)} /></Field>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  <Field label="Categoría">
                    <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                      <option value="">Selecciona una categoría</option>
                      {cats.map(cat => <option key={cat.dbId} value={cat.dbId}>{cat.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Fuente"><input type="text" placeholder="Microsoft, Gartner…" value={sourceName} onChange={e => setSourceName(e.target.value)} /></Field>
                </div>
                <Field label="Información"><textarea placeholder="Resumen de la noticia…" style={{ minHeight:130 }} value={summary} onChange={e => setSummary(e.target.value)}></textarea></Field>
              </React.Fragment>
            )}

            {section === 'events' && (
              <React.Fragment>
                <Field label="Título del evento"><input type="text" placeholder="Título del evento" value={title} onChange={e => setTitle(e.target.value)} /></Field>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  <Field label="Modalidad">
                    <select value={modality} onChange={e => setModality(e.target.value)}>
                      <option value="presential">Presencial</option>
                      <option value="online">Online</option>
                      <option value="hybrid">Híbrida</option>
                    </select>
                  </Field>
                  <Field label="Lugar"><input type="text" placeholder="Microsoft Teams, Oficina TIBOX…" value={location} onChange={e => setLocation(e.target.value)} /></Field>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  <Field label="Fecha de inicio"><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></Field>
                  <Field label="Hora de inicio"><input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} /></Field>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  <Field label="Fecha de término (opcional)"><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></Field>
                  <Field label="Hora de término (opcional)"><input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} /></Field>
                </div>
                <Field label="Resumen breve"><textarea placeholder="Descripción breve del evento…" value={summary} onChange={e => setSummary(e.target.value)}></textarea></Field>
                <Field label="Reseña completa"><textarea placeholder="Descripción completa (se muestra en el detalle del evento)…" value={description} onChange={e => setDescription(e.target.value)}></textarea></Field>
                <ImageUploadField label="Banner del evento" value={thumbnailUrl} onChange={setThumbnailUrl} />
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  <Field label="Colaborador"><input type="text" placeholder="Microsoft, Veeam…" value={partnerName} onChange={e => setPartnerName(e.target.value)} /></Field>
                  <Field label="Enlace de inscripción"><input type="url" placeholder="https://teams.microsoft.com/registration/…" value={registrationUrl} onChange={e => setRegistrationUrl(e.target.value)} /></Field>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  <Field label="Visibilidad">
                    <select value={visibility} onChange={e => setVisibility(e.target.value)}>
                      <option value="public">Público</option>
                      <option value="authenticated">Autenticado</option>
                    </select>
                  </Field>
                  <Field label="Estado">
                    <select value={status} onChange={e => setStatus(e.target.value)}>
                      <option value="draft">Borrador</option>
                      <option value="published">Publicado</option>
                      <option value="completed">Completado (evento realizado)</option>
                      <option value="archived">Archivado</option>
                    </select>
                  </Field>
                </div>
              </React.Fragment>
            )}

            {!isEvent && (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, paddingTop:4, borderTop:'1px solid var(--gray-100)' }}>
                <label style={{ display:'flex', alignItems:'center', gap:9, fontSize:13, fontWeight:600, color:'var(--navy-900,#021233)', cursor:'pointer' }}>
                  <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} />
                  Marcar como destacado
                </label>
                <Field label="Estado">
                  <select value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="draft">Borrador</option>
                    <option value="published">Publicado</option>
                    <option value="archived">Archivado</option>
                  </select>
                </Field>
              </div>
            )}

            {saveError && (
              <div style={{ fontSize:12.5, color:'#c0392b', background:'rgba(192,57,43,0.08)', border:'1px solid rgba(192,57,43,0.2)', borderRadius:8, padding:'9px 12px' }}>
                {saveError}
              </div>
            )}
          </div>

          <div style={{ padding:'16px 24px', borderTop:'1px solid var(--gray-200)', display:'flex', justifyContent:'flex-end', gap:10 }}>
            <button type="button" onClick={onClose} style={{ background:'white', border:'1px solid var(--gray-200)', borderRadius:10, padding:'10px 18px', fontSize:13, fontWeight:600, color:'var(--gray-600)', cursor:'pointer' }}>Cancelar</button>
            <button type="submit" disabled={saving} style={{ background:'#0050C8', color:'white', border:'none', borderRadius:10, padding:'10px 20px', fontSize:13, fontWeight:700, cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.7 : 1, display:'inline-flex', alignItems:'center', gap:8 }}>
              {saving && <Icon name="loader-2" className="tbx-spin" style={{ width:14, height:14 }} />}
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Noticias queda fuera del reordenamiento manual: su orden público siempre es
// por fecha de publicación descendente (ver ajuste posterior en
// FASE-06-07-08-CONTENIDO-REAL.md), así que unas flechas de reordenar ahí
// serían contradictorias con ese comportamiento ya definido. Eventos
// realizados (status='completed') tampoco se reordenan manualmente — no fue
// pedido y mantienen su propio orden por fecha (ver mismo documento).
function isReorderable(section, row) {
  if (section === 'news') return false;
  if (section === 'events') return row.rawStatus !== 'completed';
  return true;
}

// Mueve la fila `dragId` a la posición de `overId` dentro del arreglo
// completo (splice), usado tanto por drag-and-drop como, indirectamente, por
// las flechas ↑/↓ (que solo intercambian con el vecino reordenable más
// cercano, saltando filas no reordenables como los eventos ya realizados).
function moveToPosition(rows, dragId, overId) {
  const dragIdx = rows.findIndex(r => r.id === dragId);
  const overIdx = rows.findIndex(r => r.id === overId);
  if (dragIdx === -1 || overIdx === -1 || dragIdx === overIdx) return rows;
  const next = [...rows];
  const [dragged] = next.splice(dragIdx, 1);
  next.splice(overIdx, 0, dragged);
  return next;
}

function sortValue(row, key) {
  switch (key) {
    case 'title': return (row.title || '').toLowerCase();
    case 'cat': return (row.cat || '').toLowerCase();
    case 'status': return (row.status || '').toLowerCase();
    case 'isFeatured': return row.isFeatured ? 1 : 0;
    case 'date': return row.dateRaw ? new Date(row.dateRaw).getTime() : 0;
    default: return '';
  }
}

// Encabezado de columna clickeable para el orden de vista (client-side,
// no persiste ni altera sort_order/fechas reales — ver PARTE 2 del ajuste
// posterior en FASE-06-07-08-CONTENIDO-REAL.md).
function SortableTh({ label, sortKey, colSort, onSort, disabled }) {
  if (disabled) return <th>{label}</th>;
  const active = colSort && colSort.key === sortKey;
  const iconName = active ? (colSort.dir === 'asc' ? 'chevron-up' : 'chevron-down') : 'chevrons-up-down';
  return (
    <th onClick={() => onSort(sortKey)} style={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
      {label}
      <Icon name={iconName} style={{ width: 12, height: 12, marginLeft: 4, verticalAlign: -1, opacity: active ? 1 : 0.35 }} />
    </th>
  );
}

const PAGE_SIZE = 10;

export function ContentTable({ section, title }) {
  const isEvent = section === 'events';
  const isRecent = section === 'recent';
  const allowReorder = section !== 'news' && !isRecent;
  const fetcher = React.useCallback(
    () => {
      if (isRecent) return adminContentService.listRecentContentItems();
      return isEvent ? adminEventsService.listEvents() : adminContentService.listContentItems(SECTION_TO_TYPE[section]);
    },
    [section, isEvent, isRecent]
  );
  const { status, data, error } = useAsyncData(fetcher, [section]);
  const [rows, setRows] = React.useState([]);
  const [baselineIds, setBaselineIds] = React.useState([]); // último orden guardado del subconjunto reordenable — se compara contra el orden actual para saber si hay cambios pendientes
  const [viewing, setViewing] = React.useState(null);
  const [editing, setEditing] = React.useState(null);
  const [confirming, setConfirming] = React.useState(null);
  const [actionError, setActionError] = React.useState('');
  const [colSort, setColSort] = React.useState(null); // { key, dir } | null — vista, no persiste
  const [dragId, setDragId] = React.useState(null);
  const [savingOrder, setSavingOrder] = React.useState(false);
  const [page, setPage] = React.useState(1);
  React.useEffect(() => {
    if (status === 'success') {
      setRows(data || []);
      setBaselineIds((data || []).filter(r => isReorderable(section, r)).map(r => r.id));
      setPage(1);
    }
  }, [status, data, section]);
  React.useEffect(() => { setPage(1); }, [colSort]);

  const deleteFn = isEvent ? adminEventsService.deleteEvent : adminContentService.deleteContentItem;
  const updateFn = isEvent ? adminEventsService.updateEvent : adminContentService.updateContentItem;
  const setStatusFn = isEvent
    ? (id, s) => adminEventsService.updateEvent(id, { status: s })
    : (id, s) => adminContentService.updateContentItem(id, { status: s, ...(s === 'published' ? { published_at: new Date().toISOString() } : {}) });
  const setFeaturedFn = (id, v) => adminContentService.updateContentItem(id, { is_featured: v });

  const toggleSort = (key) => {
    setColSort((cur) => {
      if (!cur || cur.key !== key) return { key, dir: 'asc' };
      if (cur.dir === 'asc') return { key, dir: 'desc' };
      return null;
    });
  };

  const displayRows = React.useMemo(() => {
    if (!colSort) return rows;
    return [...rows].sort((a, b) => {
      const va = sortValue(a, colSort.key);
      const vb = sortValue(b, colSort.key);
      if (va < vb) return colSort.dir === 'asc' ? -1 : 1;
      if (va > vb) return colSort.dir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [rows, colSort]);

  const currentOrderIds = React.useMemo(
    () => rows.filter(r => isReorderable(section, r)).map(r => r.id),
    [rows, section]
  );
  const orderDirty = allowReorder && currentOrderIds.join(',') !== baselineIds.join(',');

  // Paginación: 10 elementos por página (estilo WordPress, ver Pagination
  // más arriba). Arrastrar-y-soltar solo puede reordenar dentro de la página
  // visible — no es una restricción que se valide explícitamente en el
  // código, es una consecuencia natural de que las filas de otras páginas ni
  // siquiera están en el DOM (no hay "onDragEnter" posible sobre una fila que
  // no está renderizada), así que nunca queda en un estado roto o
  // inconsistente. Se documenta la decisión en
  // FASE-06-07-08-CONTENIDO-REAL.md: si el admin necesita mover un elemento
  // entre páginas lejanas, primero debe reordenar arrastrando dentro de cada
  // página (ida y vuelta) — suficiente para los volúmenes de contenido
  // actuales; no se justificó una solución más compleja (ej. arrastrar entre
  // páginas con auto-scroll) para este panel interno.
  const totalPages = Math.max(1, Math.ceil(displayRows.length / PAGE_SIZE));
  React.useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);
  const pagedRows = displayRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Arrastrar-y-soltar (único método de reordenar — ver ajuste posterior en
  // FASE-06-07-08-CONTENIDO-REAL.md, se quitaron las flechas ↑/↓ por
  // redundantes) solo reordena la vista local (rows) — no guarda nada
  // todavía. El guardado real ocurre al hacer clic en "Guardar cambios" (ver
  // saveOrder). Si el admin sale de la sección o recarga sin guardar, el
  // nuevo orden se pierde (patrón estándar de "cambios sin guardar"). Se
  // deshabilita mientras haya un orden de columna activo (ver diseño en
  // FASE-06-07-08-CONTENIDO-REAL.md) — el orden visual ya no reflejaría
  // sort_order en ese estado.
  const handleDragStart = (rowId) => (e) => {
    if (colSort) { e.preventDefault(); return; }
    setDragId(rowId);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragEnter = (overId) => (e) => {
    e.preventDefault();
    if (colSort || !dragId || dragId === overId) return;
    setRows(prev => {
      const dragRow = prev.find(r => r.id === dragId);
      const overRow = prev.find(r => r.id === overId);
      if (!dragRow || !overRow || !isReorderable(section, dragRow) || !isReorderable(section, overRow)) return prev;
      return moveToPosition(prev, dragId, overId);
    });
  };
  const handleDragOver = (e) => { e.preventDefault(); };
  const handleDragEnd = () => setDragId(null);

  const saveOrder = async () => {
    setActionError('');
    setSavingOrder(true);
    const newIds = currentOrderIds;
    try {
      await Promise.all(newIds.map((id, idx) => updateFn(id, { sort_order: idx })));
      setRows(prev => {
        const orderMap = new Map(newIds.map((id, idx) => [id, idx]));
        return prev.map(r => orderMap.has(r.id) ? { ...r, sortOrder: orderMap.get(r.id) } : r);
      });
      setBaselineIds(newIds);
    } catch (err) {
      setActionError(err.message || 'No se pudo guardar el nuevo orden.');
    } finally {
      setSavingOrder(false);
    }
  };

  const discardOrder = () => {
    setRows(data || []);
  };

  const handle = async (action, row) => {
    setActionError('');
    try {
      if (action === 'view') { setViewing(row); return; }
      if (action === 'edit') { setEditing(row); return; }
      if (action === 'duplicate') {
        if (isEvent) {
          await adminEventsService.createEvent({
            title: row.title + ' (copia)', summary: row.summary, description: row.description,
            modality: row.modality, location: row.location, thumbnail_url: row.thumbnailUrl || null,
            registration_url: row.registrationUrl || null, partner_name: row.partnerName || null,
            visibility: row.visibility, status: 'draft', starts_at: row.startsAt, ends_at: row.endsAt,
          });
        } else {
          await adminContentService.createContentItem(SECTION_TO_TYPE[section], {
            title: row.title + ' (copia)', category_id: row.categoryId || null, summary: row.summary,
            thumbnail_url: row.thumbnailUrl || null, external_url: row.externalUrl || null,
            source_name: row.sourceName || null, duration_minutes: row.durationMinutes || null,
            visibility: 'public', status: 'draft', is_featured: false,
          });
        }
        window.location.reload();
        return;
      }
      if (action === 'delete') { setConfirming(row); return; }
      if (action === 'publish') { await setStatusFn(row.id, 'published'); }
      else if (action === 'archive') { await setStatusFn(row.id, 'archived'); }
      else if (action === 'draft') { await setStatusFn(row.id, 'draft'); }
      else if (action === 'complete') { await setStatusFn(row.id, 'completed'); }
      else if (action === 'feature') { await setFeaturedFn(row.id, true); }
      else if (action === 'unfeature') { await setFeaturedFn(row.id, false); }
      window.location.reload();
    } catch (err) {
      setActionError(err.message || 'No se pudo completar la acción.');
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteFn(confirming.id);
      window.location.reload();
    } catch (err) {
      setActionError(err.message || 'No se pudo eliminar.');
      setConfirming(null);
    }
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
      <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--gray-200)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
        <div style={{ fontSize:15, fontWeight:700, color:'var(--navy-900,#021233)' }}>{title || 'Contenido publicado'}</div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          {colSort && (
            <button className="adm-mini-btn" onClick={() => setColSort(null)}>
              <Icon name="rotate-ccw" style={{ width:13, height:13 }} />Volver al orden de publicación
            </button>
          )}
          {allowReorder && orderDirty && (
            <button className="adm-mini-btn" onClick={discardOrder} disabled={savingOrder}>Descartar cambios</button>
          )}
          {/* "Guardar cambios" queda siempre visible en las secciones reordenables
              (no solo cuando hay cambios) para que el admin nunca piense que su
              reordenamiento se perdió — se deshabilita en vez de ocultarse cuando
              no hay nada pendiente. Se habilita únicamente en base a orderDirty,
              sin importar si hay un orden de columna activo: un cambio pendiente
              de antes de activar el orden de columna sigue pudiendo guardarse. */}
          {allowReorder && (
            <button
              className="adm-mini-btn primary"
              onClick={saveOrder}
              disabled={savingOrder || !orderDirty}
              style={{ display:'inline-flex', alignItems:'center', gap:6, opacity: (savingOrder || !orderDirty) ? 0.5 : 1, cursor: (savingOrder || !orderDirty) ? 'default' : 'pointer' }}
            >
              {savingOrder && <Icon name="loader-2" className="tbx-spin" style={{ width:13, height:13 }} />}
              {savingOrder ? 'Guardando…' : 'Guardar cambios'}
            </button>
          )}
          <span style={{ fontSize:12, color:'var(--gray-400)' }}>{rows.length} elementos</span>
        </div>
      </div>
      {actionError && (
        <div style={{ margin:'12px 20px 0', fontSize:12.5, color:'#c0392b', background:'rgba(192,57,43,0.08)', border:'1px solid rgba(192,57,43,0.2)', borderRadius:8, padding:'9px 12px' }}>
          {actionError}
        </div>
      )}
      {rows.length === 0 ? (
        <EmptyState label="Todavía no hay publicaciones en esta sección." icon="inbox" />
      ) : (
        <table className="adm-table">
          <thead>
            <tr>
              {allowReorder && <th style={{ width:56 }}></th>}
              <SortableTh label="Título" sortKey="title" colSort={colSort} onSort={toggleSort} />
              <SortableTh label={isEvent ? 'Modalidad' : 'Categoría'} sortKey="cat" colSort={colSort} onSort={toggleSort} />
              <SortableTh label="Estado" sortKey="status" colSort={colSort} onSort={toggleSort} />
              <SortableTh label="Destacado" sortKey="isFeatured" colSort={colSort} onSort={toggleSort} disabled={isEvent} />
              <SortableTh label="Fecha" sortKey="date" colSort={colSort} onSort={toggleSort} />
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pagedRows.map((r) => {
              const reorderable = allowReorder && isReorderable(section, r) && !colSort;
              return (
                <tr
                  key={r.id}
                  draggable={reorderable}
                  onDragStart={reorderable ? handleDragStart(r.id) : undefined}
                  onDragEnter={reorderable ? handleDragEnter(r.id) : undefined}
                  onDragOver={reorderable ? handleDragOver : undefined}
                  onDragEnd={reorderable ? handleDragEnd : undefined}
                  style={{ opacity: dragId === r.id ? 0.4 : 1 }}
                >
                  {allowReorder && (
                    <td>
                      {reorderable && (
                        <span title="Arrastra para reordenar" style={{ cursor:'grab', display:'inline-flex', color:'var(--gray-400)' }}>
                          <Icon name="grip-vertical" style={{ width:16, height:16 }} />
                        </span>
                      )}
                    </td>
                  )}
                  <td style={{ fontWeight:600 }}>{r.title}</td>
                  <td style={{ color:'var(--gray-500)' }}>{r.cat}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>{!isEvent && r.isFeatured && <Icon name="star" style={{ width:14, height:14, color:'#FFC600', fill:'#FFC600' }} />}</td>
                  <td style={{ color:'var(--gray-500)' }}>{r.date}</td>
                  <td style={{ textAlign:'right' }}>
                    <RowMenu row={r} isEvent={isEvent} readOnly={isRecent} onAction={a => handle(a, r)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {rows.length > 0 && <Pagination page={page} totalPages={totalPages} onChange={setPage} bordered />}
      {viewing && <ContentViewModal item={viewing} section={section} onClose={() => setViewing(null)} />}
      {editing && <NewContentModal section={section} item={editing} onClose={() => setEditing(null)} />}
      {confirming !== null && (
        <ConfirmDialog title="Eliminar publicación"
          message={`¿Seguro que deseas eliminar "${confirming.title}"? Esta acción no se puede deshacer.`}
          onCancel={() => setConfirming(null)}
          onConfirm={confirmDelete} />
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

// Ajuste posterior (auditoría del panel admin): "Eliminar" no tenía
// confirmación — un clic de más borraba el mensaje sin aviso. Se agrega
// ConfirmDialog (mismo patrón que ContentTable). Sigue siendo un borrado
// solo en el estado local del componente — `adminService.getMessages()`
// lee de datos de ejemplo, no de la tabla real `contact_messages`, así que
// esto no persiste entre recargas; conectar esta sección a Supabase queda
// pendiente (ver informe de auditoría en FASE-06-07-08-CONTENIDO-REAL.md).
export function MessagesTable() {
  const { status, data, error } = useAsyncData(() => adminService.getMessages(), []);
  const [rows, setRows] = React.useState([]);
  const [viewing, setViewing] = React.useState(null);
  const [confirming, setConfirming] = React.useState(null);
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
                    <button className="adm-mini-btn danger" onClick={() => setConfirming(i)}><Icon name="trash-2" style={{width:13,height:13}} />Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {viewing && <MessageViewModal msg={viewing} onClose={() => setViewing(null)} />}
      {confirming !== null && (
        <ConfirmDialog
          title="¿Eliminar mensaje?"
          message="Esta acción no se puede deshacer."
          onCancel={() => setConfirming(null)}
          onConfirm={() => { setRows(rows.filter((_, ix) => ix !== confirming)); setConfirming(null); }}
        />
      )}
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

const LEADS_PAGE_SIZE = 10;

// Ajuste posterior (ver FASE-06-07-08-CONTENIDO-REAL.md): sección nueva de
// solo lectura para ver los leads capturados por InfografiaLeadModal antes
// de conectarse a Supabase, esos datos solo vivían en la memoria de la
// sesión del visitante (sessionStorage) y nunca llegaban al admin. Mismo
// patrón de tabla que OpinionsPanel, con paginación (ver Pagination
// compartido) porque a diferencia de las opiniones, se espera que esta
// lista crezca más rápido.
export function InfographicLeadsPanel() {
  const { status, data, error } = useAsyncData(() => adminLeadsService.listInfographicLeads(), []);
  const [page, setPage] = React.useState(1);
  const leads = data || [];
  const totalPages = Math.max(1, Math.ceil(leads.length / LEADS_PAGE_SIZE));
  const pagedLeads = leads.slice((page - 1) * LEADS_PAGE_SIZE, page * LEADS_PAGE_SIZE);

  if (status === 'loading') {
    return (
      <div className="adm-card">
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--gray-200)' }}><div style={{ fontSize:15, fontWeight:700, color:'var(--navy-900,#021233)' }}>Leads de infografías</div></div>
        <LoadingState label="Cargando leads…" />
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="adm-card">
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--gray-200)' }}><div style={{ fontSize:15, fontWeight:700, color:'var(--navy-900,#021233)' }}>Leads de infografías</div></div>
        <ErrorState label="No pudimos cargar los leads." error={error} />
      </div>
    );
  }

  return (
    <div className="adm-card">
      <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--gray-200)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontSize:15, fontWeight:700, color:'var(--navy-900,#021233)' }}>Leads de infografías</div>
          <div style={{ fontSize:12, color:'var(--gray-400)', marginTop:2 }}>Datos dejados antes de descargar una infografía</div>
        </div>
        <span style={{ fontSize:12, color:'var(--gray-400)' }}>{leads.length} {leads.length === 1 ? 'lead' : 'leads'}</span>
      </div>
      {leads.length === 0 ? (
        <EmptyState label="Todavía no hay leads capturados." icon="download" />
      ) : (
        <React.Fragment>
          <table className="adm-table">
            <thead><tr><th>Nombre</th><th>Empresa</th><th>Cargo</th><th>Correo</th><th>Infografía</th><th>Fecha</th></tr></thead>
            <tbody>
              {pagedLeads.map((l) => (
                <tr key={l.id}>
                  <td style={{ fontWeight:600 }}>{l.name}</td>
                  <td style={{ color:'var(--gray-500)' }}>{l.company || '—'}</td>
                  <td style={{ color:'var(--gray-500)' }}>{l.position || '—'}</td>
                  <td style={{ color:'var(--gray-500)' }}>{l.email}</td>
                  <td style={{ color:'var(--gray-500)' }}>{l.infographicTitle}</td>
                  <td style={{ color:'var(--gray-500)' }}>{l.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} bordered />
        </React.Fragment>
      )}
    </div>
  );
}
