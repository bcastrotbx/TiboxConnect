import { useEffect, useState } from 'react';

// Patrón estándar de loading/success/error para datos que hoy vienen de
// src/services/* (locales, con un delay simulado) y en una fase futura
// vendrán de un backend real. `fetcher` debe ser una función sin argumentos
// que devuelve una Promise — pásala como closure si necesita parámetros:
// useAsyncData(() => contentService.getVideos({ category }), [category]).
export function useAsyncData(fetcher, deps = []) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null });

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading', data: null, error: null });
    fetcher()
      .then((data) => { if (!cancelled) setState({ status: 'success', data, error: null }); })
      .catch((error) => { if (!cancelled) setState({ status: 'error', data: null, error }); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
