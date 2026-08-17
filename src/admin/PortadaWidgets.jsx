import React from 'react';
import { Icon } from '../components/shared/Icon.jsx';
import { LoadingState, ErrorState } from '../components/shared/AsyncState.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import * as adminService from '../services/adminService.js';
import * as adminPortadaService from '../services/adminPortadaService.js';
import { uploadPortalImage, InvalidImageError } from '../services/portalImageUploadService.js';
import { Field, ConfirmDialog } from './AdminWidgets.jsx';

// Fase 6/7/8 (Portada real) — los 3 tabs de /admin/portada ahora persisten
// contra Supabase. Antes leían datos de ejemplo y "Guardar cambios" no
// tenía onClick — cualquier edición se perdía al recargar.

// Ajuste posterior: sube a comunidad.tiboxlab.cl/imagenes-portal/
// (portalImageUploadService, mismo destino que ya usaba la galería de
// eventos) en vez de a Supabase Storage.
function ImageUploadField({ label, value, onChange }) {
  const [uploading, setUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState('');
  const inputRef = React.useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadError('');
    setUploading(true);
    try {
      const url = await uploadPortalImage(file);
      onChange(url);
    } catch (err) {
      setUploadError(err instanceof InvalidImageError ? err.message : 'No se pudo subir la imagen.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Field label={label}>
      <div className="adm-upload" style={{ padding:12, cursor:'pointer' }} onClick={() => inputRef.current?.click()}>
        {value
          ? <img src={value} alt="" style={{ width:'100%', height:80, objectFit:'cover', borderRadius:8, marginBottom:6 }} />
          : <Icon name="image" style={{ width:18, height:18, marginBottom:4 }} />}
        <div style={{ fontSize:12 }}>{uploading ? 'Subiendo…' : (value ? 'Cambiar imagen' : 'Subir imagen')}</div>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display:'none' }} onChange={handleFile} />
      </div>
      {uploadError && <div style={{ fontSize:11.5, color:'#E23131', marginTop:4 }}>{uploadError}</div>}
    </Field>
  );
}

function SettingsSlidesPanel() {
  const { status, data, error } = useAsyncData(() => adminPortadaService.listHeroSlides(), []);
  const [slides, setSlides] = React.useState([]);
  const [dirty, setDirty] = React.useState(new Set());
  const [confirming, setConfirming] = React.useState(null);
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState('');
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => { if (status === 'success') setSlides(data || []); }, [status, data]);

  const update = (id, key, val) => {
    setSlides(slides.map(s => s.id === id ? { ...s, [key]: val } : s));
    setDirty(prev => new Set(prev).add(id));
    setSaved(false);
  };

  const add = async () => {
    setSaveError('');
    try {
      const created = await adminPortadaService.createHeroSlide({
        title: 'Nuevo slider', sort_order: slides.length, is_active: true,
      });
      setSlides([...slides, created]);
    } catch (err) {
      setSaveError(err.message || 'No se pudo crear el slider.');
    }
  };

  const confirmRemove = async () => {
    const id = confirming;
    setConfirming(null);
    try {
      await adminPortadaService.deleteHeroSlide(id);
      setSlides(slides.filter(s => s.id !== id));
      setDirty(prev => { const next = new Set(prev); next.delete(id); return next; });
    } catch (err) {
      setSaveError(err.message || 'No se pudo eliminar el slider.');
    }
  };

  const save = async () => {
    setSaving(true);
    setSaveError('');
    try {
      await Promise.all([...dirty].map(id => {
        const s = slides.find(x => x.id === id);
        if (!s) return null;
        return adminPortadaService.updateHeroSlide(id, {
          eyebrow: s.eyebrow, title: s.title, highlight_text: s.highlightText,
          description: s.description, button_label: s.buttonLabel, button_url: s.buttonUrl,
          image_url: s.imageUrl,
        });
      }));
      setDirty(new Set());
      setSaved(true);
    } catch (err) {
      setSaveError(err.message || 'No se pudieron guardar los cambios.');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading') return <div className="adm-card"><LoadingState label="Cargando sliders…" /></div>;
  if (status === 'error') return <div className="adm-card"><ErrorState label="No pudimos cargar los sliders del hero." error={error} onRetry={() => window.location.reload()} /></div>;

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
              <button className="adm-mini-btn danger" onClick={() => setConfirming(s.id)}><Icon name="trash-2" style={{width:13,height:13}} />Quitar</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Field label="Eyebrow"><input value={s.eyebrow} onChange={e => update(s.id,'eyebrow',e.target.value)} /></Field>
              <Field label="Título"><input value={s.title} onChange={e => update(s.id,'title',e.target.value)} /></Field>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Field label="Texto destacado"><input value={s.highlightText} onChange={e => update(s.id,'highlightText',e.target.value)} /></Field>
              <Field label="Texto del botón"><input value={s.buttonLabel} onChange={e => update(s.id,'buttonLabel',e.target.value)} /></Field>
            </div>
            <Field label="Texto descriptivo"><textarea style={{ minHeight:60 }} value={s.description} onChange={e => update(s.id,'description',e.target.value)}></textarea></Field>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Field label="URL del botón"><input value={s.buttonUrl} onChange={e => update(s.id,'buttonUrl',e.target.value)} /></Field>
              <ImageUploadField label="Imagen de fondo" value={s.imageUrl} onChange={v => update(s.id,'imageUrl',v)} />
            </div>
          </div>
        ))}
        {slides.length === 0 && <div style={{ fontSize:13, color:'var(--gray-400)' }}>No hay sliders todavía.</div>}
      </div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:12, marginTop:16 }}>
        {saveError && <span style={{ fontSize:12, color:'#E23131' }}>{saveError}</span>}
        {saved && <span style={{ fontSize:12, color:'#1B9C5A' }}>Cambios guardados.</span>}
        <button className="adm-mini-btn primary" onClick={save} disabled={saving || dirty.size === 0}>
          <Icon name="check" style={{width:13,height:13}} />{saving ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>
      {confirming !== null && (
        <ConfirmDialog title="Quitar slider" message="¿Seguro que deseas quitar este slider del hero? Esta acción no se puede deshacer."
          confirmLabel="Quitar" onConfirm={confirmRemove} onCancel={() => setConfirming(null)} />
      )}
    </div>
  );
}

function SettingsCatsPanel() {
  const { status, data, error } = useAsyncData(() => adminPortadaService.listCategories(), []);
  const { data: iconLibrary } = useAsyncData(() => adminService.getIconLibrary(), []);
  const [cats, setCats] = React.useState([]);
  const [dirty, setDirty] = React.useState(new Set());
  const [confirming, setConfirming] = React.useState(null);
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState('');
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => { if (status === 'success') setCats(data || []); }, [status, data]);

  const update = (id, key, val) => {
    setCats(cats.map(c => c.id === id ? { ...c, [key]: val } : c));
    setDirty(prev => new Set(prev).add(id));
    setSaved(false);
  };

  const add = async () => {
    setSaveError('');
    try {
      const created = await adminPortadaService.createCategory({
        name: 'Nueva categoría', slug: `categoria-${Date.now()}`, icon: 'grid-3x3', sort_order: cats.length, is_active: true,
      });
      setCats([...cats, created]);
    } catch (err) {
      setSaveError(err.message || 'No se pudo crear la categoría.');
    }
  };

  const confirmRemove = async () => {
    const id = confirming;
    setConfirming(null);
    try {
      await adminPortadaService.deleteCategory(id);
      setCats(cats.filter(c => c.id !== id));
      setDirty(prev => { const next = new Set(prev); next.delete(id); return next; });
    } catch (err) {
      setSaveError(err.message || 'No se pudo eliminar la categoría.');
    }
  };

  const save = async () => {
    setSaving(true);
    setSaveError('');
    try {
      await Promise.all([...dirty].map(id => {
        const c = cats.find(x => x.id === id);
        if (!c) return null;
        return adminPortadaService.updateCategory(id, { name: c.name, icon: c.icon, color: c.color, description: c.description });
      }));
      setDirty(new Set());
      setSaved(true);
    } catch (err) {
      setSaveError(err.message || 'No se pudieron guardar los cambios.');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading') return <div className="adm-card"><LoadingState label="Cargando categorías…" /></div>;
  if (status === 'error') return <div className="adm-card"><ErrorState label="No pudimos cargar las categorías." error={error} onRetry={() => window.location.reload()} /></div>;

  return (
    <div className="adm-card" style={{ padding:20 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
        <div style={{ fontSize:15, fontWeight:700, color:'var(--navy-900,#021233)' }}>Categorías de contenido</div>
        <button className="adm-mini-btn primary" onClick={add}><Icon name="plus" style={{width:13,height:13}} />Agregar categoría</button>
      </div>
      <div style={{ fontSize:12.5, color:'var(--gray-500)', marginBottom:16 }}>
        Estas son las categorías usadas para clasificar videos, infografías y noticias en todo el portal (filtros, etiquetas de tarjetas, etc.) — no son los bloques de navegación bajo el slider, que son fijos.
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {cats.map(c => (
          <div key={c.id} style={{ border:'1px solid var(--gray-200)', borderRadius:12, padding:16, display:'flex', flexDirection:'column', gap:10 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:'rgba(0,80,200,0.08)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon name={c.icon} style={{ width:15, height:15, color:'#0050C8' }} />
                </div>
                <span style={{ fontSize:12, fontWeight:700, color:'var(--gray-400)' }}>{c.slug}</span>
              </div>
              <button className="adm-mini-btn danger" onClick={() => setConfirming(c.id)}><Icon name="trash-2" style={{width:13,height:13}} /></button>
            </div>
            <div className="adm-field">
              <label>Ícono</label>
              <div className="adm-icon-lib">
                {(iconLibrary || []).map(ic => (
                  <button type="button" key={ic} className={`adm-icon-opt${c.icon===ic ? ' active' : ''}`} onClick={() => update(c.id,'icon',ic)} title={ic}>
                    <Icon name={ic} style={{ width:16, height:16 }} />
                  </button>
                ))}
              </div>
            </div>
            <Field label="Nombre"><input value={c.name} onChange={e => update(c.id,'name',e.target.value)} /></Field>
            <Field label="Descripción"><input value={c.description} onChange={e => update(c.id,'description',e.target.value)} /></Field>
          </div>
        ))}
        {cats.length === 0 && <div style={{ fontSize:13, color:'var(--gray-400)' }}>No hay categorías todavía.</div>}
      </div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:12, marginTop:16 }}>
        {saveError && <span style={{ fontSize:12, color:'#E23131' }}>{saveError}</span>}
        {saved && <span style={{ fontSize:12, color:'#1B9C5A' }}>Cambios guardados.</span>}
        <button className="adm-mini-btn primary" onClick={save} disabled={saving || dirty.size === 0}>
          <Icon name="check" style={{width:13,height:13}} />{saving ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>
      {confirming !== null && (
        <ConfirmDialog title="Eliminar categoría" message="¿Seguro que deseas eliminar esta categoría? El contenido que la usa quedará sin categoría."
          confirmLabel="Eliminar" onConfirm={confirmRemove} onCancel={() => setConfirming(null)} />
      )}
    </div>
  );
}

function SettingsContactPanel() {
  const { status, data, error } = useAsyncData(() => adminPortadaService.getContactSettings(), []);
  const [form, setForm] = React.useState(null);
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState('');
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => { if (status === 'success') setForm(data || {}); }, [status, data]);

  const set = (key, val) => { setForm(f => ({ ...f, [key]: val })); setSaved(false); };

  const save = async () => {
    setSaving(true);
    setSaveError('');
    try {
      await adminPortadaService.updateContactSettings(form);
      setSaved(true);
    } catch (err) {
      setSaveError(err.message || 'No se pudieron guardar los cambios.');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || !form) return <div className="adm-card"><LoadingState label="Cargando configuración de contacto…" /></div>;
  if (status === 'error') return <div className="adm-card"><ErrorState label="No pudimos cargar la configuración de contacto." error={error} onRetry={() => window.location.reload()} /></div>;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      <div className="adm-card" style={{ padding:20, display:'flex', flexDirection:'column', gap:14 }}>
        <div style={{ fontSize:15, fontWeight:700, color:'var(--navy-900,#021233)' }}>Encabezado de la sección de contacto</div>
        <Field label="Título"><input value={form.title || ''} onChange={e => set('title', e.target.value)} /></Field>
        <Field label="Descripción"><textarea value={form.description || ''} onChange={e => set('description', e.target.value)}></textarea></Field>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <Field label="Datos de contacto — Chile"><textarea style={{ minHeight:60 }} value={form.officeCl || ''} onChange={e => set('officeCl', e.target.value)}></textarea></Field>
          <Field label="Datos de contacto — Perú"><textarea style={{ minHeight:60 }} value={form.officePe || ''} onChange={e => set('officePe', e.target.value)}></textarea></Field>
        </div>
        <Field label="Texto del botón (CTA)"><input style={{ maxWidth:280 }} value={form.ctaText || ''} onChange={e => set('ctaText', e.target.value)} /></Field>
      </div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:12 }}>
        {saveError && <span style={{ fontSize:12, color:'#E23131' }}>{saveError}</span>}
        {saved && <span style={{ fontSize:12, color:'#1B9C5A' }}>Cambios guardados.</span>}
        <button className="adm-mini-btn primary" onClick={save} disabled={saving}>
          <Icon name="check" style={{width:13,height:13}} />{saving ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  );
}

// Ruta /admin/portada — configuración de la portada del portal público
// (hero slides, categorías de contenido, encabezado de contacto). Antes era
// la sección "settings" del admin (Fase 1); solo cambió el nombre/ruta.
export function PortadaPage() {
  const [tab, setTab] = React.useState('sliders');
  const tabs = [ { id:'sliders', label:'Sliders principales' }, { id:'cats', label:'Categorías de contenido' }, { id:'contact', label:'Contacto' } ];
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
