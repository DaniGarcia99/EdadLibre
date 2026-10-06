import { residentes, medicaciones, citasHoy } from './demo';
import type { Residente, Medicacion, Cita } from './demo';

// Única puerta de entrada a los datos.
// Hoy lee datos de prueba; más adelante leerá de Supabase
// sin tener que tocar las pantallas.

export async function getResidentes(): Promise<Residente[]> {
  return residentes;
}

export async function getMedicacion(residenteId: string): Promise<Medicacion[]> {
  return medicaciones.filter((m) => m.residenteId === residenteId);
}

export async function getCitas(residenteId: string): Promise<Cita[]> {
  return citasHoy.filter((c) => c.residenteId === residenteId);
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