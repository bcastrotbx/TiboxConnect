import React from 'react';
import { Icon } from '../components/shared/Icon.jsx';
import { LoadingState, ErrorState } from '../components/shared/AsyncState.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import * as adminService from '../services/adminService.js';
import { Field } from './AdminWidgets.jsx';

function IconPicker({ value, onChange, iconLibrary }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="adm-field">
      <label>Ícono</label>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:38, height:38, borderRadius:9, background:'rgba(0,80,200,0.08)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Icon name={value} style={{ width:18, height:18, color:'#0050C8' }} />
        </div>
        <label className="adm-mini-btn" style={{ margin:0 }}>
          <Icon name="upload-cloud" style={{width:13,height:13}} />Subir desde escritorio
          <input type="file" accept="image/*" style={{ display:'none' }} />
        </label>
        <button type="button" className="adm-mini-btn" onClick={() => setOpen(o => !o)}><Icon name="grid-3x3" style={{width:13,height:13}} />Elegir de biblioteca</button>
      </div>
      {open && (
        <div style={{ border:'1px solid var(--gray-200)', borderRadius:10, padding:10, marginTop:6 }}>
          <div className="adm-icon-lib">
            {(iconLibrary || []).map(ic => (
              <button type="button" key={ic} className={`adm-icon-opt${value===ic ? ' active' : ''}`} onClick={() => { onChange(ic); setOpen(false); }} title={ic}>
                <Icon name={ic} style={{ width:16, height:16 }} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsSlidesPanel() {
  const { status, data, error } = useAsyncData(() => adminService.getPortadaSlides(), []);
  const [slides, setSlides] = React.useState([]);
  React.useEffect(() => { if (status === 'success') setSlides(data || []); }, [status, data]);
  const update = (id, key, val) => setSlides(slides.map(s => s.id === id ? { ...s, [key]: val } : s));
  const remove = (id) => setSlides(slides.filter(s => s.id !== id));
  const add = () => setSlides([...slides, { id:Date.now(), title:'', category:'', desc:'', cta:'', bg:'' }]);

  if (status === 'loading') return <div className="adm-card"><LoadingState label="Cargando sliders…" /></div>;
  if (status === 'error') return <div className="adm-card"><ErrorState label="No pudimos cargar los sliders del hero." error={error} /></div>;

  return (
    <div className="adm-card" style={{ padding:20 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <div style={{ fontSize:15, fontWeight:700, color:'var(--navy-900,#021233)' }}>Sliders principales del hero</div>
        <button className="adm-mini-btn primary" onClick={add}><Icon name="plus" style={{width:13,height:13}} />Agregar slider</button>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {slides.map((s,i) => (
          <div key={s.id} style={{ border:'1px solid var(--gray-200)', borderRadius:12, padding:16, display:'flex', flexDirection:'column', gap:12 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:12, fontWeight:700, color:'var(--gray-400)' }}>Slider {i+1}</span>
              <button className="adm-mini-btn danger" onClick={() => remove(s.id)}><Icon name="trash-2" style={{width:13,height:13}} />Quitar</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Field label="Título"><input value={s.title} onChange={e => update(s.id,'title',e.target.value)} /></Field>
              <Field label="Categoría"><input value={s.category} onChange={e => update(s.id,'category',e.target.value)} /></Field>
            </div>
            <Field label="Texto descriptivo"><textarea style={{ minHeight:60 }} value={s.desc} onChange={e => update(s.id,'desc',e.target.value)}></textarea></Field>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Field label="Texto del CTA"><input value={s.cta} onChange={e => update(s.id,'cta',e.target.value)} /></Field>
              <Field label="Imagen de fondo">
                <div className="adm-upload" style={{ padding:12 }}>
                  <Icon name="image" style={{ width:18, height:18, marginBottom:4 }} />
                  <div style={{ fontSize:12 }}>{s.bg || 'Subir imagen de fondo'}</div>
                </div>
              </Field>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', justifyContent:'flex-end', marginTop:4 }}>
        <button className="adm-mini-btn primary"><Icon name="check" style={{width:13,height:13}} />Guardar cambios</button>
      </div>
    </div>
  );
}

function SettingsCatsPanel() {
  const { status, data, error } = useAsyncData(() => adminService.getPortadaCategoryBlocks(), []);
  const { data: iconLibrary } = useAsyncData(() => adminService.getIconLibrary(), []);
  const [cats, setCats] = React.useState([]);
  React.useEffect(() => { if (status === 'success') setCats(data || []); }, [status, data]);
  const update = (id, key, val) => setCats(cats.map(c => c.id === id ? { ...c, [key]: val } : c));

  if (status === 'loading') return <div className="adm-card"><LoadingState label="Cargando bloques de categorías…" /></div>;
  if (status === 'error') return <div className="adm-card"><ErrorState label="No pudimos cargar los bloques de categorías." error={error} /></div>;

  return (
    <div className="adm-card" style={{ padding:20 }}>
      <div style={{ fontSize:15, fontWeight:700, color:'var(--navy-900,#021233)', marginBottom:16 }}>Bloques de categorías (bajo el slider)</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {cats.map(c => (
          <div key={c.id} style={{ border:'1px solid var(--gray-200)', borderRadius:12, padding:16, display:'flex', flexDirection:'column', gap:10 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:'rgba(0,80,200,0.08)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon name={c.icon} style={{ width:15, height:15, color:'#0050C8' }} />
              </div>
              <span style={{ fontSize:12, fontWeight:700, color:'var(--gray-400)' }}>Bloque {c.id}</span>
            </div>
            <IconPicker value={c.icon} onChange={v => update(c.id,'icon',v)} iconLibrary={iconLibrary} />
            <Field label="Título"><input value={c.title} onChange={e => update(c.id,'title',e.target.value)} /></Field>
            <Field label="Tag"><input value={c.tag} onChange={e => update(c.id,'tag',e.target.value)} /></Field>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', justifyContent:'flex-end', marginTop:16 }}>
        <button className="adm-mini-btn primary"><Icon name="check" style={{width:13,height:13}} />Guardar cambios</button>
      </div>
    </div>
  );
}

function SettingsContactPanel() {
  const { status, data, error } = useAsyncData(() => adminService.getContactFormFields(), []);
  const [title, setTitle] = React.useState('¿Tienes algún proyecto en mente?');
  const [desc, setDesc] = React.useState('Cuéntanos sobre tu proyecto y un especialista de TIBOX te contactará dentro de 24 horas hábiles.');
  const [officeCl, setOfficeCl] = React.useState('Av. Pdte. Kennedy 5600, Oficina 1506, Vitacura, Santiago');
  const [officePe, setOfficePe] = React.useState('Grimaldo del Solar 162, URB LEURO INT. 407, Miraflores, Lima');
  const [ctaText, setCtaText] = React.useState('Enviar mensaje');
  const [fields, setFields] = React.useState([]);
  React.useEffect(() => { if (status === 'success') setFields(data || []); }, [status, data]);
  const updateField = (i, key, val) => setFields(fields.map((f,ix) => ix===i ? { ...f, [key]: val } : f));

  if (status === 'loading') return <div className="adm-card"><LoadingState label="Cargando configuración de contacto…" /></div>;
  if (status === 'error') return <div className="adm-card"><ErrorState label="No pudimos cargar la configuración de contacto." error={error} /></div>;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      <div className="adm-card" style={{ padding:20, display:'flex', flexDirection:'column', gap:14 }}>
        <div style={{ fontSize:15, fontWeight:700, color:'var(--navy-900,#021233)' }}>Encabezado de la sección de contacto</div>
        <Field label="Título"><input value={title} onChange={e => setTitle(e.target.value)} /></Field>
        <Field label="Descripción"><textarea value={desc} onChange={e => setDesc(e.target.value)}></textarea></Field>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <Field label="Datos de contacto — Chile"><textarea style={{ minHeight:60 }} value={officeCl} onChange={e => setOfficeCl(e.target.value)}></textarea></Field>
          <Field label="Datos de contacto — Perú"><textarea style={{ minHeight:60 }} value={officePe} onChange={e => setOfficePe(e.target.value)}></textarea></Field>
        </div>
      </div>
      <div className="adm-card" style={{ padding:20 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
          <div style={{ fontSize:15, fontWeight:700, color:'var(--navy-900,#021233)' }}>Campos del formulario</div>
          <button className="adm-mini-btn primary" onClick={() => setFields([...fields, { name:'', helper:'' }])}><Icon name="plus" style={{width:13,height:13}} />Agregar campo</button>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {fields.map((f,i) => (
            <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:10, alignItems:'end' }}>
              <Field label="Nombre del campo"><input value={f.name} onChange={e => updateField(i,'name',e.target.value)} /></Field>
              <Field label="Texto de ayuda"><input value={f.helper} onChange={e => updateField(i,'helper',e.target.value)} /></Field>
              <button className="adm-mini-btn danger" onClick={() => setFields(fields.filter((_,ix) => ix !== i))}><Icon name="trash-2" style={{width:13,height:13}} /></button>
            </div>
          ))}
        </div>
        <div style={{ marginTop:16, paddingTop:16, borderTop:'1px solid var(--gray-200)' }}>
          <Field label="Texto del botón (CTA)"><input style={{ maxWidth:280 }} value={ctaText} onChange={e => setCtaText(e.target.value)} /></Field>
        </div>
      </div>
      <div style={{ display:'flex', justifyContent:'flex-end' }}>
        <button className="adm-mini-btn primary"><Icon name="check" style={{width:13,height:13}} />Guardar cambios</button>
      </div>
    </div>
  );
}

// Ruta /admin/portada — configuración de la portada del portal público
// (hero slides, bloques de categoría, encabezado de contacto). Antes era la
// sección "settings" del admin (Fase 1); solo cambió el nombre/ruta.
export function PortadaPage() {
  const [tab, setTab] = React.useState('sliders');
  const tabs = [ { id:'sliders', label:'Sliders principales' }, { id:'cats', label:'Bloques de categorías' }, { id:'contact', label:'Contacto' } ];
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      <div style={{ display:'flex', gap:4, borderBottom:'1px solid var(--gray-200)' }}>
        {tabs.map(t => <div key={t.id} className={`adm-tab${tab===t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</div>)}
      </div>
      {tab === 'sliders' && <SettingsSlidesPanel />}
      {tab === 'cats' && <SettingsCatsPanel />}
      {tab === 'contact' && <SettingsContactPanel />}
    </div>
  );
}
