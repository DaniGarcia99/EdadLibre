import { supabase } from './supabase';

export type Rol = 'cuidadora' | 'residente';

export async function getRol(): Promise<Rol | null> {
  const { data: sesion } = await supabase.auth.getSession();
  const usuario = sesion.session?.user;
  if (!usuario) return null;
  const { data } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('id', usuario.id)
    .maybeSingle();
  return (data?.rol as Rol) ?? null;
}

export async function iniciarSesion(email: string, password: string): Promise<Rol> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error('Email o contraseña incorrectos');
  const rol = await getRol();
  if (!rol) throw new Error('Tu usuario todavía no tiene un perfil asignado');
  return rol;
}

export async function cerrarSesion(): Promise<void> {
  await supabase.auth.signOut();
}