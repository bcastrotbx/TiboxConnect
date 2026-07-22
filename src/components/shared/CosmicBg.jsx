import React from 'react';

// Cosmic / Universe SVG backgrounds (used by modals & services)
export function CosmicBg({ variant = 0 }) {
  const uid = React.useId().replace(/:/g, '');
  const stars = React.useMemo(() => {
    let s = 71 + variant * 137; const r = () => { s=(s*9301+49297)%233280; return s/233280; };
    return Array.from({length:140},()=>({x:r()*100,y:r()*100,rad:r()*1.4+0.2,o:r()*0.7+0.12,c:r()>0.85?'#9fd4ff':'white'}));
  },[variant]);

  const PAL = [
    { neb:[['72%','35%','55%','#0a63d6',0.4],['12%','72%','45%','#163a8a',0.34],['46%','6%','38%','#00c8fa',0.18]] },
    { neb:[['32%','42%','50%','#1d4ed8',0.42],['82%','28%','42%','#0891b2',0.3],['58%','86%','40%','#3b1f8a',0.24]] },
    { neb:[['86%','70%','55%','#0050c8',0.45],['18%','24%','40%','#0ea5e9',0.3],['50%','100%','45%','#11235e',0.4]] },
  ];
  const pal = PAL[variant % PAL.length];

  return (
    <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}} preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {pal.neb.map((n,i)=>(
          <radialGradient key={i} id={`${uid}n${i}`} cx={n[0]} cy={n[1]} r={n[2]}>
            <stop offset="0%" stopColor={n[3]} stopOpacity={n[4]}/>
            <stop offset="100%" stopColor={n[3]} stopOpacity="0"/>
          </radialGradient>
        ))}
        <radialGradient id={`${uid}gal`} cx="32%" cy="42%" r="44%">
          <stop offset="0%" stopColor="#cfe6ff" stopOpacity="0.6"/>
          <stop offset="28%" stopColor="#3f7bd6" stopOpacity="0.35"/>
          <stop offset="65%" stopColor="#1b2f6b" stopOpacity="0.12"/>
          <stop offset="100%" stopColor="#1b2f6b" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id={`${uid}planet`} cx="40%" cy="36%" r="70%">
          <stop offset="0%" stopColor="#2b6fd6" stopOpacity="1"/>
          <stop offset="60%" stopColor="#10306e" stopOpacity="1"/>
          <stop offset="100%" stopColor="#050f2e" stopOpacity="1"/>
        </radialGradient>
        <radialGradient id={`${uid}rim`} cx="78%" cy="78%" r="62%">
          <stop offset="68%" stopColor="#00c8fa" stopOpacity="0"/>
          <stop offset="90%" stopColor="#3fd0ff" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#3fd0ff" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {pal.neb.map((n,i)=><rect key={i} width="100%" height="100%" fill={`url(#${uid}n${i})`}/>)}

      {variant===1 && (
        <g transform="rotate(-22 270 150)" opacity="0.85">
          <ellipse cx="270" cy="150" rx="260" ry="78" fill={`url(#${uid}gal)`}/>
          <ellipse cx="270" cy="150" rx="150" ry="40" fill={`url(#${uid}gal)`}/>
          <circle cx="270" cy="150" r="6" fill="#ffffff" fillOpacity="0.9"/>
        </g>
      )}
      {variant===2 && (
        <g>
          <circle cx="86%" cy="118%" r="190" fill={`url(#${uid}planet)`}/>
          <circle cx="86%" cy="118%" r="190" fill={`url(#${uid}rim)`}/>
        </g>
      )}

      {stars.map((s,i)=><circle key={i} cx={s.x+'%'} cy={s.y+'%'} r={s.rad} fill={s.c} fillOpacity={s.o}/>)}
      <circle cx="10%" cy="18%" r="1.8" fill="#00C8FA" fillOpacity="0.75"/>
      <circle cx="82%" cy="22%" r="1.6" fill="white"   fillOpacity="0.9"/>
      <circle cx="60%" cy="14%" r="2.0" fill="#a8d8ff" fillOpacity="0.65"/>
    </svg>
  );
}
