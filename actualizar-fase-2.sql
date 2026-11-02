-- =====================================================================
-- Pasatiempos · actualización de la base para Wordle y Conexiones (fase 2)
-- Pegá TODO este archivo en Supabase → SQL Editor → New query → Run.
-- Se puede correr más de una vez sin romper nada, y no toca tus datos actuales.
-- =====================================================================

-- 1) Permitir los dos juegos nuevos en la tabla de resultados
alter table public.resultados drop constraint if exists resultados_juego;
alter table public.resultados add constraint resultados_juego check (juego in
  ('sudoku','crucigrama','sopa-de-letras','buscaminas','2048','nonogramas','laberinto','ahorcado','wordle','conexiones'));

-- 2) Valores razonables: Wordle de 1 a 6 intentos, Conexiones de 4 a 7 intentos
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

-- 3) El ranking del día tiene que conocer los juegos nuevos (en ambos gana el menor número)
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

-- 4) Mismos permisos que antes
revoke all on function public.valor_plausible(text, integer) from public, anon, authenticated;
revoke all on function public.ranking_dia(text, date)        from public, anon, authenticated;
grant execute on function public.ranking_dia(text, date)     to anon, authenticated;
