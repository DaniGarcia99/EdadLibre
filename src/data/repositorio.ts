import { residentes, medicaciones, citas, aISO } from './demo';
import type { Residente, Medicacion, Cita } from './demo';

export { fechaISO } from './demo';

// Única puerta de entrada a los datos.
// Hoy lee datos de prueba; más adelante leerá de Supabase
// sin tener que tocar las pantallas.

export async function getResidentes(): Promise<Residente[]> {
  return residentes;
}

export async function getMedicacion(residenteId: string): Promise<Medicacion[]> {
  return medicaciones.filter((m) => m.residenteId === residenteId);
}

export async function getCitas(residenteId?: string): Promise<Cita[]> {
  return residenteId ? citas.filter((c) => c.residenteId === residenteId) : citas;
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