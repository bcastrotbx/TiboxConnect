import { supabase } from '../lib/supabase.js';

// Ajuste posterior: /admin/perfil era enteramente decorativo — nombre,
// cargo, correo, teléfono y el botón "Guardar cambios" no tocaban Supabase
// para nada; "Cambiar contraseña" y la foto de perfil tampoco hacían nada.
// Este servicio conecta lo que el pedido dejó en el alcance: nombre, correo,
// contraseña y foto de perfil. Cargo/teléfono/2FA/preferencias se quitaron
// de la UI en vez de conectarse (ver PerfilPage.jsx).

export async function updateFullName(userId, fullName) {
  const { error } = await supabase.from('profiles').update({ full_name: fullName }).eq('id', userId);
  if (error) throw error;
}

export async function updateAvatar(userId, avatarUrl) {
  const { error } = await supabase.from('profiles').update({ avatar_url: avatarUrl }).eq('id', userId);
  if (error) throw error;
}

// supabase.auth.updateUser({ email }) no cambia el correo de inmediato: por
// defecto Supabase exige confirmar el cambio desde un link enviado a la
// dirección nueva (a veces también a la vieja, según la configuración del
// proyecto) antes de que auth.users.email se actualice de verdad. No hay
// nada que este servicio deba "esperar" — el aviso al admin se arma en
// PerfilPage a partir de que la llamada no tiró error.
export async function requestEmailChange(newEmail) {
  const { error } = await supabase.auth.updateUser({ email: newEmail });
  if (error) throw error;
}

// Reautentica con la contraseña actual antes de cambiarla — supabase-js no
// expone una forma de "verificar la contraseña actual" sin pasar por un
// signIn real. Si la contraseña actual es incorrecta, signInWithPassword
// devuelve error y nunca se llega a llamar updateUser(); la sesión actual
// no se pierde en el intento (mismo usuario, solo se renuevan los tokens).
export async function changePassword(email, currentPassword, newPassword) {
  const { error: reauthError } = await supabase.auth.signInWithPassword({ email, password: currentPassword });
  if (reauthError) throw new Error('La contraseña actual no es correcta.');

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}
