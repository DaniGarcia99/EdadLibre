import { supabase } from './supabase';
import { aISO, fechaISO } from './demo';
import type { Residente, Medicacion, Cita } from './demo';

export { fechaISO };

// Única puerta de entrada a los datos: las pantallas no saben de dónde vienen.

const hhmm = (t: string) => t.slice(0, 5);

function aResidente(r: any): Residente {
  return {
    id: r.id,
    nombre: r.nombre,
    fechaNacimiento: r.fecha_nacimiento,
    apartamento: r.apartamento,
    programa: r.programa,
    necesidades: r.necesidades ?? [],
    patologias: r.patologias ?? [],
    alergias: r.alergias ?? [],
    contacto: r.contacto ?? '',
  };
}

function aMedicacion(m: any): Medicacion {
  return {
    id: m.id,
    residenteId: m.residente_id,
    medicamento: m.medicamento,
    dosis: m.dosis,
    hora: hhmm(m.hora),
  };
}

function aCita(c: any): Cita {
  return {
    id: c.id,
    residenteId: c.residente_id,
    especialidad: c.especialidad,
    fecha: c.fecha,
    hora: hhmm(c.hora),
    acompanante: c.acompanante,
  };
}

export async function getResidentes(): Promise<Residente[]> {
  const { data, error } = await supabase
    .from('residentes')
    .select('*')
    .eq('activo', true)
    .order('nombre');
  if (error) throw error;
  return (data ?? []).map(aResidente);
}

export async function getMedicacion(residenteId: string): Promise<Medicacion[]> {
  const { data, error } = await supabase
    .from('medicaciones')
    .select('*')
    .eq('residente_id', residenteId)
    .eq('activa', true)
    .order('hora');
  if (error) throw error;
  return (data ?? []).map(aMedicacion);
}

export async function getMedicacionActiva(): Promise<Medicacion[]> {
  const { data, error } = await supabase
    .from('medicaciones')
    .select('*')
    .eq('activa', true)
    .order('hora');
  if (error) throw error;
  return (data ?? []).map(aMedicacion);
}

export async function getCitas(residenteId?: string): Promise<Cita[]> {
  let consulta = supabase.from('citas').select('*').order('fecha').order('hora');
  if (residenteId) consulta = consulta.eq('residente_id', residenteId);
  const { data, error } = await consulta;
  if (error) throw error;
  return (data ?? []).map(aCita);
}

export async function getCitasDia(fecha: string): Promise<Cita[]> {
  const { data, error } = await supabase
    .from('citas')
    .select('*')
    .eq('fecha', fecha)
    .order('hora');
  if (error) throw error;
  return (data ?? []).map(aCita);
}

export async function getAdministradasHoy(): Promise<string[]> {
  const { data, error } = await supabase
    .from('administraciones')
    .select('medicacion_id')
    .eq('fecha', fechaISO(0));
  if (error) throw error;
  return (data ?? []).map((a: any) => a.medicacion_id);
}

export async function marcarAdministrada(medicacionId: string): Promise<void> {
  const { data: sesion } = await supabase.auth.getSession();
  const usuario = sesion.session?.user;
  if (!usuario) throw new Error('Sin sesión');
  const { error } = await supabase.from('administraciones').insert({
    medicacion_id: medicacionId,
    fecha: fechaISO(0),
    administrada_por: usuario.id,
  });
  // 23505 = ya estaba registrada hoy: no es un problema
  if (error && error.code !== '23505') throw error;
}

export function calcularEdad(fechaNacimiento: string): number {
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const aunNoCumple =
    hoy.getMonth() < nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate());
  if (aunNoCumple) edad -= 1;
  return edad;
}

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

// Mediodía para evitar problemas con cambios de hora
function aFecha(fecha: string): Date {
  return new Date(`${fecha}T12:00:00`);
}

export function sumarDias(fecha: string, dias: number): string {
  const d = aFecha(fecha);
  d.setDate(d.getDate() + dias);
  return aISO(d);
}

export function inicioSemana(fecha: string): string {
  const desdeLunes = (aFecha(fecha).getDay() + 6) % 7;
  return sumarDias(fecha, -desdeLunes);
}

export function nombreDia(fecha: string): string {
  return DIAS[aFecha(fecha).getDay()];
}

export function fechaLarga(fecha: string): string {
  const d = aFecha(fecha);
  return `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`;
}