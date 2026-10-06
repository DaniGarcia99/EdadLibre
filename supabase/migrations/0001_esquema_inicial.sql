-- ========== TABLAS ==========

create table perfiles (
  id uuid primary key references auth.users (id) on delete cascade,
  rol text not null check (rol in ('cuidadora', 'residente')),
  nombre text not null,
  created_at timestamptz not null default now()
);

create table residentes (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid unique references auth.users (id) on delete set null,
  nombre text not null,
  fecha_nacimiento date not null,
  apartamento int not null,
  programa text not null check (programa in ('Silver', 'Senior')),
  necesidades text[] not null default '{}',
  patologias text[] not null default '{}',
  alergias text[] not null default '{}',
  contacto text,
  foto_path text,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

create table medicaciones (
  id uuid primary key default gen_random_uuid(),
  residente_id uuid not null references residentes (id) on delete cascade,
  medicamento text not null,
  dosis text not null,
  hora time not null,
  activa boolean not null default true,
  created_at timestamptz not null default now()
);
create index on medicaciones (residente_id);

-- Registro de cada toma administrada (no se puede editar ni borrar)
create table administraciones (
  id uuid primary key default gen_random_uuid(),
  medicacion_id uuid not null references medicaciones (id) on delete cascade,
  fecha date not null default current_date,
  administrada_por uuid not null references auth.users (id),
  administrada_en timestamptz not null default now(),
  unique (medicacion_id, fecha)
);

create table citas (
  id uuid primary key default gen_random_uuid(),
  residente_id uuid not null references residentes (id) on delete cascade,
  especialidad text not null,
  fecha date not null,
  hora time not null,
  acompanante boolean not null default false,
  estado text not null default 'pendiente'
    check (estado in ('pendiente', 'confirmada', 'cancelada', 'realizada')),
  creada_por uuid references auth.users (id) default auth.uid(),
  created_at timestamptz not null default now()
);
create index on citas (fecha);
create index on citas (residente_id);

-- ========== FUNCIONES AUXILIARES DE PERMISOS ==========

create function es_cuidadora() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from perfiles where id = auth.uid() and rol = 'cuidadora'
  );
$$;

create function mi_residente_id() returns uuid
language sql stable security definer set search_path = public as $$
  select id from residentes where usuario_id = auth.uid();
$$;

revoke all on function es_cuidadora() from public;
revoke all on function mi_residente_id() from public;
grant execute on function es_cuidadora() to authenticated;
grant execute on function mi_residente_id() to authenticated;

-- ========== PERMISOS (ROW LEVEL SECURITY) ==========

alter table perfiles enable row level security;
alter table residentes enable row level security;
alter table medicaciones enable row level security;
alter table administraciones enable row level security;
alter table citas enable row level security;

-- perfiles
create policy "ver perfil propio o cuidadora" on perfiles
  for select to authenticated
  using (id = (select auth.uid()) or es_cuidadora());

-- residentes
create policy "cuidadoras gestionan residentes" on residentes
  for all to authenticated
  using (es_cuidadora()) with check (es_cuidadora());
create policy "residente ve su ficha" on residentes
  for select to authenticated
  using (usuario_id = (select auth.uid()));

-- medicaciones
create policy "cuidadoras gestionan medicacion" on medicaciones
  for all to authenticated
  using (es_cuidadora()) with check (es_cuidadora());
create policy "residente ve su medicacion" on medicaciones
  for select to authenticated
  using (residente_id = mi_residente_id());

-- administraciones: solo cuidadoras, y solo insertar y leer
create policy "cuidadoras ven administraciones" on administraciones
  for select to authenticated
  using (es_cuidadora());
create policy "cuidadoras registran administraciones" on administraciones
  for insert to authenticated
  with check (es_cuidadora() and administrada_por = (select auth.uid()));

-- citas
create policy "cuidadoras gestionan citas" on citas
  for all to authenticated
  using (es_cuidadora()) with check (es_cuidadora());
create policy "residente ve sus citas" on citas
  for select to authenticated
  using (residente_id = mi_residente_id());
create policy "residente pide sus citas" on citas
  for insert to authenticated
  with check (residente_id = mi_residente_id() and estado = 'pendiente');