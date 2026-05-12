-- ========================================================================================
-- SCRIPT SQL DE SIEMBRA COMPLETA: FIXTURE OFICIAL MUNDIAL 2026 (104 PARTIDOS)
-- Penca Mundial Kanthus - Kanthus Smash Club
-- 
-- IMPORTANTE: Pega y ejecuta este script directamente en la pestaña "SQL Editor" de tu 
-- consola en Neon.tech para insertar/actualizar la tabla public.matches real.
-- ========================================================================================

TRUNCATE TABLE public.matches CASCADE;

INSERT INTO public.matches (equipo_a, equipo_b, bandera_a, bandera_b, fecha_hora, ronda, started, finished) VALUES
-- GRUPO A
('México', 'Sudáfrica', '🇲🇽', '🇿🇦', '2026-06-11 16:00:00', 'Grupo A', false, false),
('Corea del Sur', 'Chequia', '🇰🇷', '🇨🇿', '2026-06-11 23:00:00', 'Grupo A', false, false),
('Chequia', 'Sudáfrica', '🇨🇿', '🇿🇦', '2026-06-18 13:00:00', 'Grupo A', false, false),
('México', 'Corea del Sur', '🇲🇽', '🇰🇷', '2026-06-18 22:00:00', 'Grupo A', false, false),
('Sudáfrica', 'Corea del Sur', '🇿🇦', '🇰🇷', '2026-06-24 22:00:00', 'Grupo A', false, false),
('Chequia', 'México', '🇨🇿', '🇲🇽', '2026-06-24 22:00:00', 'Grupo A', false, false),

-- GRUPO B
('Canadá', 'Bosnia y Herzegovina', '🇨🇦', '🇧🇦', '2026-06-12 16:00:00', 'Grupo B', false, false),
('Catar', 'Suiza', '🇶🇦', '🇨🇭', '2026-06-13 16:00:00', 'Grupo B', false, false),
('Suiza', 'Bosnia y Herzegovina', '🇨🇭', '🇧🇦', '2026-06-18 16:00:00', 'Grupo B', false, false),
('Canadá', 'Catar', '🇨🇦', '🇶🇦', '2026-06-18 19:00:00', 'Grupo B', false, false),
('Suiza', 'Canadá', '🇨🇭', '🇨🇦', '2026-06-24 16:00:00', 'Grupo B', false, false),
('Bosnia y Herzegovina', 'Catar', '🇧🇦', '🇶🇦', '2026-06-24 16:00:00', 'Grupo B', false, false),

-- GRUPO C
('Brasil', 'Marruecos', '🇧🇷', '🇲🇦', '2026-06-13 19:00:00', 'Grupo C', false, false),
('Haití', 'Escocia', '🇭🇹', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', '2026-06-13 22:00:00', 'Grupo C', false, false),
('Escocia', 'Marruecos', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', '🇲🇦', '2026-06-19 19:00:00', 'Grupo C', false, false),
('Brasil', 'Haití', '🇧🇷', '🇭🇹', '2026-06-19 21:30:00', 'Grupo C', false, false),
('Marruecos', 'Haití', '🇲🇦', '🇭🇹', '2026-06-24 19:00:00', 'Grupo C', false, false),
('Escocia', 'Brasil', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', '🇧🇷', '2026-06-24 19:00:00', 'Grupo C', false, false),

-- GRUPO D
('Estados Unidos', 'Paraguay', '🇺🇸', '🇵🇾', '2026-06-12 22:00:00', 'Grupo D', false, false),
('Australia', 'Turquía', '🇦🇺', '🇹🇷', '2026-06-14 01:00:00', 'Grupo D', false, false),
('Estados Unidos', 'Australia', '🇺🇸', '🇦🇺', '2026-06-19 16:00:00', 'Grupo D', false, false),
('Turquía', 'Paraguay', '🇹🇷', '🇵🇾', '2026-06-20 00:00:00', 'Grupo D', false, false),
('Turquía', 'Estados Unidos', '🇹🇷', '🇺🇸', '2026-06-25 23:00:00', 'Grupo D', false, false),
('Paraguay', 'Australia', '🇵🇾', '🇦🇺', '2026-06-25 23:00:00', 'Grupo D', false, false),

-- GRUPO E
('Alemania', 'Curazao', '🇩🇪', '🇨🇼', '2026-06-14 14:00:00', 'Grupo E', false, false),
('Costa de Marfil', 'Ecuador', '🇨🇮', '🇪🇨', '2026-06-14 20:00:00', 'Grupo E', false, false),
('Alemania', 'Costa de Marfil', '🇩🇪', '🇨🇮', '2026-06-20 17:00:00', 'Grupo E', false, false),
('Ecuador', 'Curazao', '🇪🇨', '🇨🇼', '2026-06-20 21:00:00', 'Grupo E', false, false),
('Curazao', 'Costa de Marfil', '🇨🇼', '🇨🇮', '2026-06-25 17:00:00', 'Grupo E', false, false),
('Ecuador', 'Alemania', '🇪🇨', '🇩🇪', '2026-06-25 17:00:00', 'Grupo E', false, false),

-- GRUPO F
('Países Bajos', 'Japón', '🇳🇱', '🇯🇵', '2026-06-14 17:00:00', 'Grupo F', false, false),
('Suecia', 'Túnez', '🇸🇪', '🇹🇳', '2026-06-14 23:00:00', 'Grupo F', false, false),
('Países Bajos', 'Suecia', '🇳🇱', '🇸🇪', '2026-06-20 14:00:00', 'Grupo F', false, false),
('Túnez', 'Japón', '🇹🇳', '🇯🇵', '2026-06-21 01:00:00', 'Grupo F', false, false),
('Túnez', 'Países Bajos', '🇹🇳', '🇳🇱', '2026-06-25 20:00:00', 'Grupo F', false, false),
('Japón', 'Suecia', '🇯🇵', '🇸🇪', '2026-06-25 20:00:00', 'Grupo F', false, false),

-- GRUPO G
('Bélgica', 'Egipto', '🇧🇪', '🇪🇬', '2026-06-15 16:00:00', 'Grupo G', false, false),
('Irán', 'Nueva Zelanda', '🇮🇷', '🇳🇿', '2026-06-15 22:00:00', 'Grupo G', false, false),
('Bélgica', 'Irán', '🇧🇪', '🇮🇷', '2026-06-21 16:00:00', 'Grupo G', false, false),
('Nueva Zelanda', 'Egipto', '🇳🇿', '🇪🇬', '2026-06-21 22:00:00', 'Grupo G', false, false),
('Nueva Zelanda', 'Bélgica', '🇳🇿', '🇧🇪', '2026-06-27 00:00:00', 'Grupo G', false, false),
('Egipto', 'Irán', '🇪🇬', '🇮🇷', '2026-06-27 00:00:00', 'Grupo G', false, false),

-- GRUPO H
('España', 'Cabo Verde', '🇪🇸', '🇨🇻', '2026-06-15 13:00:00', 'Grupo H', false, false),
('Arabia Saudita', 'Uruguay', '🇸🇦', '🇺🇾', '2026-06-15 19:00:00', 'Grupo H', false, false),
('España', 'Arabia Saudita', '🇪🇸', '🇸🇦', '2026-06-21 13:00:00', 'Grupo H', false, false),
('Uruguay', 'Cabo Verde', '🇺🇾', '🇨🇻', '2026-06-21 19:00:00', 'Grupo H', false, false),
('Cabo Verde', 'Arabia Saudita', '🇨🇻', '🇸🇦', '2026-06-26 21:00:00', 'Grupo H', false, false),
('Uruguay', 'España', '🇺🇾', '🇪🇸', '2026-06-26 21:00:00', 'Grupo H', false, false),

-- GRUPO I
('Francia', 'Senegal', '🇫🇷', '🇸🇳', '2026-06-16 16:00:00', 'Grupo I', false, false),
('Irak', 'Noruega', '🇮逃', '🇳🇴', '2026-06-16 19:00:00', 'Grupo I', false, false),
('Francia', 'Irak', '🇫🇷', '🇮逃', '2026-06-22 18:00:00', 'Grupo I', false, false),
('Noruega', 'Senegal', '🇳🇴', '🇸🇳', '2026-06-22 21:00:00', 'Grupo I', false, false),
('Noruega', 'Francia', '🇳🇴', '🇫🇷', '2026-06-26 16:00:00', 'Grupo I', false, false),
('Senegal', 'Irak', '🇸🇳', '🇮逃', '2026-06-26 16:00:00', 'Grupo I', false, false),

-- GRUPO J
('Argentina', 'Argelia', '🇦🇷', '🇩🇿', '2026-06-16 22:00:00', 'Grupo J', false, false),
('Austria', 'Jordania', '🇦🇹', '🇯🇴', '2026-06-17 01:00:00', 'Grupo J', false, false),
('Argentina', 'Austria', '🇦🇷', '🇦🇹', '2026-06-22 14:00:00', 'Grupo J', false, false),
('Jordania', 'Argelia', '🇯🇴', '🇩🇿', '2026-06-23 00:00:00', 'Grupo J', false, false),
('Argelia', 'Austria', '🇩🇿', '🇦🇹', '2026-06-27 23:00:00', 'Grupo J', false, false),
('Jordania', 'Argentina', '🇯🇴', '🇦🇷', '2026-06-27 23:00:00', 'Grupo J', false, false),

-- GRUPO K
('Portugal', 'RD Congo', '🇵🇹', '🇨🇩', '2026-06-17 14:00:00', 'Grupo K', false, false),
('Uzbekistán', 'Colombia', '🇺🇿', '🇨🇴', '2026-06-17 23:00:00', 'Grupo K', false, false),
('Portugal', 'Uzbekistán', '🇵🇹', '🇺🇿', '2026-06-23 14:00:00', 'Grupo K', false, false),
('Colombia', 'RD Congo', '🇨🇴', '🇨🇩', '2026-06-23 23:00:00', 'Grupo K', false, false),
('Colombia', 'Portugal', '🇨🇴', '🇵🇹', '2026-06-27 20:30:00', 'Grupo K', false, false),
('RD Congo', 'Uzbekistán', '🇨🇩', '🇺🇿', '2026-06-27 20:30:00', 'Grupo K', false, false),

-- GRUPO L
('Inglaterra', 'Croacia', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🇭🇷', '2026-06-17 17:00:00', 'Grupo L', false, false),
('Ghana', 'Panamá', '🇬🇭', '🇵🇦', '2026-06-17 20:00:00', 'Grupo L', false, false),
('Inglaterra', 'Ghana', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🇬🇭', '2026-06-23 17:00:00', 'Grupo L', false, false),
('Panamá', 'Croacia', '🇵🇦', '🇭🇷', '2026-06-23 20:00:00', 'Grupo L', false, false),
('Panamá', 'Inglaterra', '🇵🇦', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '2026-06-27 18:00:00', 'Grupo L', false, false),
('Croacia', 'Ghana', '🇭🇷', '🇬🇭', '2026-06-27 18:00:00', 'Grupo L', false, false),

-- ELIMINATORIA DE 32 (16 partidos)
('A definir', 'A definir', '⚽', '⚽', '2026-06-28 16:00:00', 'Eliminatoria de 32', false, false),
('A definir', 'A definir', '⚽', '⚽', '2026-06-29 14:00:00', 'Eliminatoria de 32', false, false),
('A definir', 'A definir', '⚽', '⚽', '2026-06-29 17:30:00', 'Eliminatoria de 32', false, false),
('A definir', 'A definir', '⚽', '⚽', '2026-06-29 22:00:00', 'Eliminatoria de 32', false, false),
('A definir', 'A definir', '⚽', '⚽', '2026-06-30 14:00:00', 'Eliminatoria de 32', false, false),
('A definir', 'A definir', '⚽', '⚽', '2026-06-30 18:00:00', 'Eliminatoria de 32', false, false),
('A definir', 'A definir', '⚽', '⚽', '2026-06-30 22:00:00', 'Eliminatoria de 32', false, false),
('A definir', 'A definir', '⚽', '⚽', '2026-07-01 13:00:00', 'Eliminatoria de 32', false, false),
('A definir', 'A definir', '⚽', '⚽', '2026-07-01 17:00:00', 'Eliminatoria de 32', false, false),
('A definir', 'A definir', '⚽', '⚽', '2026-07-01 21:00:00', 'Eliminatoria de 32', false, false),
('A definir', 'A definir', '⚽', '⚽', '2026-07-02 16:00:00', 'Eliminatoria de 32', false, false),
('A definir', 'A definir', '⚽', '⚽', '2026-07-02 20:00:00', 'Eliminatoria de 32', false, false),
('A definir', 'A definir', '⚽', '⚽', '2026-07-03 00:00:00', 'Eliminatoria de 32', false, false),
('A definir', 'A definir', '⚽', '⚽', '2026-07-03 15:00:00', 'Eliminatoria de 32', false, false),
('A definir', 'A definir', '⚽', '⚽', '2026-07-03 19:00:00', 'Eliminatoria de 32', false, false),
('A definir', 'A definir', '⚽', '⚽', '2026-07-03 22:30:00', 'Eliminatoria de 32', false, false),

-- OCTAVOS DE FINAL (8 partidos)
('A definir', 'A definir', '🔥', '🔥', '2026-07-04 14:00:00', 'Octavos de Final', false, false),
('A definir', 'A definir', '🔥', '🔥', '2026-07-04 18:00:00', 'Octavos de Final', false, false),
('A definir', 'A definir', '🔥', '🔥', '2026-07-05 17:00:00', 'Octavos de Final', false, false),
('A definir', 'A definir', '🔥', '🔥', '2026-07-05 21:00:00', 'Octavos de Final', false, false),
('A definir', 'A definir', '🔥', '🔥', '2026-07-06 16:00:00', 'Octavos de Final', false, false),
('A definir', 'A definir', '🔥', '🔥', '2026-07-06 21:00:00', 'Octavos de Final', false, false),
('A definir', 'A definir', '🔥', '🔥', '2026-07-07 13:00:00', 'Octavos de Final', false, false),
('A definir', 'A definir', '🔥', '🔥', '2026-07-07 17:00:00', 'Octavos de Final', false, false),

-- CUARTOS DE FINAL (4 partidos)
('A definir', 'A definir', '⭐', '⭐', '2026-07-09 17:00:00', 'Cuartos de Final', false, false),
('A definir', 'A definir', '⭐', '⭐', '2026-07-09 21:00:00', 'Cuartos de Final', false, false),
('A definir', 'A definir', '⭐', '⭐', '2026-07-10 17:00:00', 'Cuartos de Final', false, false),
('A definir', 'A definir', '⭐', '⭐', '2026-07-10 21:00:00', 'Cuartos de Final', false, false),

-- SEMIFINALES (2 partidos)
('A definir', 'A definir', '⚡', '⚡', '2026-07-14 19:00:00', 'Semifinal', false, false),
('A definir', 'A definir', '⚡', '⚡', '2026-07-15 19:00:00', 'Semifinal', false, false),

-- TERCER PUESTO (1 partido)
('A definir', 'A definir', '🥉', '🥉', '2026-07-18 16:00:00', 'Tercer Puesto', false, false),

-- FINAL (1 partido)
('A definir', 'A definir', '🏆', '🏆', '2026-07-19 16:00:00', 'Final', false, false);
