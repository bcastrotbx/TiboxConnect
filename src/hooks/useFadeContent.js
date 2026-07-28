import { useEffect, useRef, useState } from 'react';

// Evita el parpadeo/salto abrupto al cambiar de categoría en los bloques con
// filtros (videoteca, infografías, noticias — ver ajuste posterior en
// FASE-06-07-08-CONTENIDO-REAL.md): useAsyncData vuelve a status:'loading'
// (con data:null) en cada cambio de dependencia, lo que hoy desmonta la
// grilla y muestra el spinner de carga en cada clic de filtro. Este hook
// sigue mostrando el último contenido cargado (con la opacidad reducida)
// mientras la nueva categoría carga, y hace un crossfade suave cuando llegan
// los datos nuevos. El spinner de carga real solo se usa en la carga
// inicial, cuando todavía no hay ningún dato previo que mantener en
// pantalla.
export function useFadeContent(status, data) {
  const [displayData, setDisplayData] = useState(data);
  const hadData = useRef(false);

  useEffect(() => {
    if (status === 'success') {
      setDisplayData(data);
      hadData.current = true;
    }
  }, [status, data]);

  return {
    displayData,
    isInitialLoad: status === 'loading' && !hadData.current,
    isRefreshing: status === 'loading' && hadData.current,
  };
}
