export type Residente = {
    id: string;
    nombre: string;
    apartamento: number;
    programa: 'Silver' | 'Senior';
  };
  
  export type Medicacion = {
    id: string;
    residenteId: string;
    medicamento: string;
    dosis: string;
    hora: string;
  };
  
  export type Cita = {
    id: string;
    residenteId: string;
    especialidad: string;
    hora: string;
    acompanante: boolean;
  };
  
  export const residentes: Residente[] = [
    { id: 'r1', nombre: 'Antonio García', apartamento: 3, programa: 'Senior' },
    { id: 'r2', nombre: 'Carmen López', apartamento: 5, programa: 'Senior' },
    { id: 'r3', nombre: 'Manuel Ruiz', apartamento: 2, programa: 'Silver' },
  ];
  
  export const medicaciones: Medicacion[] = [
    { id: 'm1', residenteId: 'r1', medicamento: 'Sintrom', dosis: '2 mg', hora: '14:00' },
  ];
  
  export const citasHoy: Cita[] = [
    { id: 'c1', residenteId: 'r2', especialidad: 'Traumatología', hora: '17:30', acompanante: true },
    { id: 'c2', residenteId: 'r3', especialidad: 'Análisis', hora: '09:00', acompanante: false },
  ];