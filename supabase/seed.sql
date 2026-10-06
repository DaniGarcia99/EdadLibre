insert into residentes
  (nombre, fecha_nacimiento, apartamento, programa, necesidades, patologias, alergias, contacto)
values
  ('Antonio García', '1944-03-12', 3, 'Senior',
    array['Ayuda para desplazarse fuera del piso', 'Letra grande'],
    array['Hipertensión', 'Artrosis'], array['Penicilina'],
    'Hija: Lucía García · 600 000 001'),
  ('Carmen López', '1947-09-30', 5, 'Senior',
    array['Usa audífono', 'Necesita acompañante a citas'],
    array['Diabetes tipo 2'], array['Frutos secos', 'Látex'],
    'Hijo: Pablo Ruiz · 600 000 002'),
  ('Manuel Ruiz', '1966-01-05', 2, 'Silver',
    array['Totalmente autónomo'],
    array[]::text[], array[]::text[],
    'Hermana: Elena Ruiz · 600 000 003');

insert into medicaciones (residente_id, medicamento, dosis, hora)
select r.id, v.med, v.dosis, v.hora::time
from (values
  ('Antonio García', 'Sintrom', '2 mg', '14:00'),
  ('Antonio García', 'Enalapril', '10 mg', '09:00'),
  ('Carmen López', 'Metformina', '850 mg', '13:30')
) as v(nombre, med, dosis, hora)
join residentes r on r.nombre = v.nombre;

insert into citas (residente_id, especialidad, fecha, hora, acompanante)
select r.id, v.esp, current_date + v.dias, v.hora::time, v.acomp
from (values
  ('Carmen López', 'Traumatología', 0, '17:30', true),
  ('Manuel Ruiz', 'Análisis', 0, '09:00', false),
  ('Antonio García', 'Cardiología', 1, '11:00', true),
  ('Antonio García', 'Revisión Sintrom', 2, '10:15', false),
  ('Carmen López', 'Oftalmología', 3, '12:00', true),
  ('Manuel Ruiz', 'Dentista', 3, '16:00', false)
) as v(nombre, esp, dias, hora, acomp)
join residentes r on r.nombre = v.nombre;