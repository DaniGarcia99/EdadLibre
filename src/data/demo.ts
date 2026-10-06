export type Residente = {
  id: string;
  nombre: string;
  fechaNacimiento: string;
  apartamento: number;
  programa: 'Silver' | 'Senior';
  necesidades: string[];
  patologias: string[];
  alergias: string[];
  contacto: string;
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
  {
    id: 'r1',
    nombre: 'Antonio García',
    fechaNacimiento: '1944-03-12',
    apartamento: 3,
    programa: 'Senior',
    necesidades: ['Ayuda para desplazarse fuera del piso', 'Letra grande'],
    patologias: ['Hipertensión', 'Artrosis'],
    alergias: ['Penicilina'],
    contacto: 'Hija: Lucía García · 600 000 001',
  },
  {
    id: 'r2',
    nombre: 'Carmen López',
    fechaNacimiento: '1947-09-30',
    apartamento: 5,
    programa: 'Senior',
    necesidades: ['Usa audífono', 'Necesita acompañante a citas'],
    patologias: ['Diabetes tipo 2'],
    alergias: ['Frutos secos', 'Látex'],
    contacto: 'Hijo: Pablo Ruiz · 600 000 002',
  },
  {
    id: 'r3',
    nombre: 'Manuel Ruiz',
    fechaNacimiento: '1966-01-05',
    apartamento: 2,
    programa: 'Silver',
    necesidades: ['Totalmente autónomo'],
    patologias: [],
    alergias: [],
    contacto: 'Hermana: Elena Ruiz · 600 000 003',
  },
];

export const medicaciones: Medicacion[] = [
  { id: 'm1', residenteId: 'r1', medicamento: 'Sintrom', dosis: '2 mg', hora: '14:00' },
  { id: 'm2', residenteId: 'r1', medicamento: 'Enalapril', dosis: '10 mg', hora: '09:00' },
  { id: 'm3', residenteId: 'r2', medicamento: 'Metformina', dosis: '850 mg', hora: '13:30' },
];

export const citasHoy: Cita[] = [
  { id: 'c1', residenteId: 'r2', especialidad: 'Traumatología', hora: '17:30', acompanante: true },
  { id: 'c2', residenteId: 'r3', especialidad: 'Análisis', hora: '09:00', acompanante: false },
];