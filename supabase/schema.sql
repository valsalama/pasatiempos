-- =====================================================================
-- Pasatiempos · base de datos en Supabase
-- Pegá TODO este archivo en Supabase → SQL Editor → New query → Run.
-- Se puede correr más de una vez sin romper nada.
--
-- Seguridad, en resumen:
--  * Nadie escribe directo en las tablas: solo a través de funciones que validan todo.
--  * El mail vive en el sistema de login de Supabase y nunca se expone: el ranking solo muestra el apodo.
--  * La fecha del desafío la decide el servidor (hora de Argentina), no el celu de cada persona.
--  * Un solo resultado por persona, por juego y por día.
-- =====================================================================

-- ---------- Tablas ----------
create table if not exists public.perfiles (
  id             uuid primary key references auth.users (id) on delete cascade,
  apodo          text not null,
  creado         timestamptz not null default now(),
  apodo_cambiado timestamptz not null default 'epoch',
  constraint perfiles_apodo_formato check (
    apodo = btrim(apodo)
    and apodo !~ '  '
    and apodo ~ '^[A-Za-z0-9ÁÉÍÓÚÜÑáéíóúüñ _.-]{3,20}$'
  )
);
create unique index if not exists perfiles_apodo_unico on public.perfiles (lower(apodo));

create table if not exists public.resultados (
  id      bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  juego   text not null,
  fecha   date not null,
  valor   integer not null,
  creado  timestamptz not null default now(),
  constraint resultados_juego check (juego in
    ('sudoku','crucigrama','sopa-de-letras','buscaminas','2048','nonogramas','laberinto','ahorcado','wordle','conexiones')),
  constraint resultados_valor check (valor > 0),
  constraint resultados_uno_por_dia unique (user_id, juego, fecha)
);
create index if not exists resultados_ranking on public.resultados (juego, fecha, valor);

-- ---------- Permisos: cerrado por defecto ----------
alter table public.perfiles   enable row level security;
alter table public.resultados enable row level security;
alter table public.perfiles   force row level security;
alter table public.resultados force row level security;

revoke all on public.perfiles   from anon, authenticated;
revoke all on public.resultados from anon, authenticated;

-- Cada persona puede LEER solo lo suyo (nada de insert/update/delete directo).
grant select on public.perfiles   to authenticated;
grant select on public.resultados to authenticated;

drop policy if exists perfiles_leer_el_propio on public.perfiles;
create policy perfiles_leer_el_propio on public.perfiles
  for select to authenticated using (id = (select auth.uid()));

drop policy if exists resultados_leer_los_propios on public.resultados;
create policy resultados_leer_los_propios on public.resultados
  for select to authenticated using (user_id = (select auth.uid()));

-- ---------- Funciones ----------
create or replace function public.fecha_de_hoy()
returns date
language sql stable
set search_path = ''
as $$ select (now() at time zone 'America/Argentina/Buenos_Aires')::date $$;

-- Elegir o cambiar el apodo (como mucho una vez cada 24 h después del primero)
create or replace function public.guardar_apodo(p_apodo text)
returns text
language plpgsql security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  limpio text := btrim(coalesce(p_apodo, ''));
  actual public.perfiles%rowtype;
begin
  if uid is null then raise exception 'Tenés que iniciar sesión' using errcode = '28000'; end if;
  if limpio !~ '^[A-Za-z0-9ÁÉÍÓÚÜÑáéíóúüñ _.-]{3,20}$' or limpio ~ '  ' then
    raise exception 'El apodo debe tener de 3 a 20 caracteres: letras, números, espacio, punto, guion o guion bajo' using errcode = '22023';
  end if;
  if lower(limpio) ~ '(admin|moderador|soporte|supabase)' then
    raise exception 'Ese apodo no está disponible' using errcode = '22023';
  end if;

  select * into actual from public.perfiles where id = uid;
  if found then
    if lower(actual.apodo) = lower(limpio) then
      update public.perfiles set apodo = limpio where id = uid;   -- solo cambia mayúsculas
      return limpio;
    end if;
    if actual.apodo_cambiado > now() - interval '24 hours' then
      raise exception 'Podés cambiar el apodo una vez por día' using errcode = '22023';
    end if;
    update public.perfiles set apodo = limpio, apodo_cambiado = now() where id = uid;
  else
    insert into public.perfiles (id, apodo) values (uid, limpio);
  end if;
  return limpio;
exception when unique_violation then
  raise exception 'Ese apodo ya lo usa otra persona' using errcode = '23505';
end $$;

-- Mínimos y máximos razonables por juego (en milisegundos, o puntos en 2048 y ahorcado)
create or replace function public.valor_plausible(p_juego text, p_valor integer)
returns boolean
language sql immutable
set search_path = ''
as $$
  select case p_juego
    when 'sudoku'         then p_valor between 45000 and 21600000
    when 'crucigrama'     then p_valor between 60000 and 21600000
    when 'sopa-de-letras' then p_valor between 20000 and 21600000
    when 'buscaminas'     then p_valor between 12000 and 21600000
    when 'nonogramas'     then p_valor between 40000 and 21600000
    when 'laberinto'      then p_valor between 4000  and 21600000
    when '2048'           then p_valor between 20    and 3000000
    when 'ahorcado'       then p_valor between 10    and 100000
    when 'wordle'         then p_valor between 1     and 6
    when 'conexiones'     then p_valor between 4     and 7
    else false
  end
$$;

-- Guardar el resultado del desafío de HOY. Devuelve true si es el primero del día (el que cuenta).
create or replace function public.enviar_resultado(p_juego text, p_valor integer)
returns boolean
language plpgsql security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  filas integer;
begin
  if uid is null then raise exception 'Tenés que iniciar sesión' using errcode = '28000'; end if;
  if not exists (select 1 from public.perfiles where id = uid) then
    raise exception 'Primero elegí un apodo' using errcode = '22023';
  end if;
  if p_juego is null or p_valor is null or not public.valor_plausible(p_juego, p_valor) then
    raise exception 'Resultado no válido' using errcode = '22023';
  end if;
  insert into public.resultados (user_id, juego, fecha, valor)
  values (uid, p_juego, public.fecha_de_hoy(), p_valor)
  on conflict (user_id, juego, fecha) do nothing;
  get diagnostics filas = row_count;
  return filas = 1;
end $$;

-- Ranking de un juego para un día (por defecto hoy): los 50 mejores y, si no estás, tu fila.
-- Tiempos: menor es mejor. 2048 y ahorcado (puntos): mayor es mejor.
create or replace function public.ranking_dia(p_juego text, p_fecha date default null)
returns table (pos bigint, apodo text, valor integer, yo boolean)
language sql stable security definer
set search_path = ''
as $$
  with dia as (select coalesce(p_fecha, public.fecha_de_hoy()) as f),
  ordenado as (
    select rank() over (
             order by case when p_juego in ('2048','ahorcado') then -r.valor else r.valor end, r.creado
           ) as pos,
           p.apodo, r.valor, (r.user_id = auth.uid()) as yo
    from public.resultados r
    join public.perfiles p on p.id = r.user_id, dia
    where r.juego = p_juego and r.fecha = dia.f
      and p_juego in ('sudoku','crucigrama','sopa-de-letras','buscaminas','2048','nonogramas','laberinto','ahorcado','wordle','conexiones')
  )
  select o.pos, o.apodo, o.valor, o.yo from ordenado o
  where o.pos <= 50 or o.yo
  order by o.pos, o.apodo
$$;

-- Ranking de rachas: días seguidos con al menos un desafío resuelto (la racha sigue viva si jugaste hoy o ayer)
create or replace function public.ranking_rachas()
returns table (pos bigint, apodo text, dias integer, yo boolean)
language sql stable security definer
set search_path = ''
as $$
  with dias as (
    select distinct user_id, fecha from public.resultados
  ),
  grupos as (
    select user_id, fecha, fecha - (row_number() over (partition by user_id order by fecha))::integer as g
    from dias
  ),
  rachas as (
    select user_id, count(*)::integer as dias, max(fecha) as ultima from grupos group by user_id, g
  ),
  vigentes as (
    select user_id, dias from rachas where ultima >= public.fecha_de_hoy() - 1
  ),
  mejor as (select user_id, max(dias) as dias from vigentes group by user_id),
  ordenado as (
    select rank() over (order by m.dias desc) as pos, p.apodo, m.dias, (m.user_id = auth.uid()) as yo
    from mejor m join public.perfiles p on p.id = m.user_id
  )
  select o.pos, o.apodo, o.dias, o.yo from ordenado o where o.pos <= 50 or o.yo order by o.pos, o.apodo
$$;

-- Borrar la cuenta y todo lo asociado (apodo y resultados) — derecho a irse
create or replace function public.borrar_mi_cuenta()
returns void
language plpgsql security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'Tenés que iniciar sesión' using errcode = '28000'; end if;
  delete from auth.users where id = auth.uid();   -- borra en cascada perfil y resultados
end $$;

-- ---------- Quién puede llamar a qué ----------
revoke all on function public.guardar_apodo(text)             from public, anon, authenticated;
revoke all on function public.enviar_resultado(text, integer) from public, anon, authenticated;
revoke all on function public.ranking_dia(text, date)         from public, anon, authenticated;
revoke all on function public.ranking_rachas()                from public, anon, authenticated;
revoke all on function public.borrar_mi_cuenta()              from public, anon, authenticated;
revoke all on function public.valor_plausible(text, integer)  from public, anon, authenticated;
revoke all on function public.fecha_de_hoy()                  from public, anon, authenticated;

grant execute on function public.guardar_apodo(text)             to authenticated;
grant execute on function public.enviar_resultado(text, integer) to authenticated;
grant execute on function public.borrar_mi_cuenta()              to authenticated;
grant execute on function public.ranking_dia(text, date)         to anon, authenticated;
grant execute on function public.ranking_rachas()                to anon, authenticated;
