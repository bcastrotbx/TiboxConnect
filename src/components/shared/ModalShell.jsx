import React from 'react';

// Reusable modal shell
export function ModalShell({ onClose, children, maxWidth = 460 }) {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div style={{
      position:'fixed',inset:0,zIndex:600,
      background:'rgba(2,18,51,0.55)',backdropFilter:'blur(4px)',
      display:'flex',alignItems:'center',justifyContent:'center',padding:24,
      animation:'tbxFade 160ms ease-out',
    }} onClick={onClose}>
      <div style={{
        background:'white',borderRadius:20,
        width:'100%',maxWidth,maxHeight:'90vh',overflowY:'auto',
        boxShadow:'0 24px 64px rgba(0,0,0,0.28)',
        animation:'tbxPop 180ms cubic-bezier(0.2,0.8,0.3,1)',
      }} onClick={e=>e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
