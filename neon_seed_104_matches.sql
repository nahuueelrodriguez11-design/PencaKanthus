-- ========================================================================================
-- SCRIPT SQL DE SIEMBRA COMPLETA: FIXTURE OFICIAL MUNDIAL 2026 (104 PARTIDOS REALES)
-- Penca Mundial Kanthus - Kanthus Smash Club
-- 
-- IMPORTANTE: Pega y ejecuta este script directamente en la pestaña "SQL Editor" de tu 
-- consola en Neon.tech para insertar/actualizar la tabla public.matches real.
-- ========================================================================================

TRUNCATE TABLE public.matches CASCADE;

INSERT INTO public.matches (id, equipo_a, equipo_b, bandera_a, bandera_b, fecha_hora, ronda, started, finished) OVERRIDING SYSTEM VALUE VALUES
-- GRUPO A
(1, 'México', 'Sudáfrica', '🇲🇽', '🇿🇦', '2026-06-11 16:00:00', 'Grupo A', false, false),
(2, 'Corea del Sur', 'Chequia', '🇰🇷', '🇨🇿', '2026-06-11 23:00:00', 'Grupo A', false, false),
(3, 'Chequia', 'Sudáfrica', '🇨🇿', '🇿🇦', '2026-06-18 13:00:00', 'Grupo A', false, false),
(4, 'México', 'Corea del Sur', '🇲🇽', '🇰🇷', '2026-06-18 22:00:00', 'Grupo A', false, false),
(5, 'Sudáfrica', 'Corea del Sur', '🇿🇦', '🇰🇷', '2026-06-24 22:00:00', 'Grupo A', false, false),
(6, 'Chequia', 'México', '🇨🇿', '🇲🇽', '2026-06-24 22:00:00', 'Grupo A', false, false),

-- GRUPO B
(7, 'Canadá', 'Bosnia y Herzegovina', '🇨🇦', '🇧🇦', '2026-06-12 16:00:00', 'Grupo B', false, false),
(8, 'Catar', 'Suiza', '🇶🇦', '🇨🇭', '2026-06-13 16:00:00', 'Grupo B', false, false),
(9, 'Suiza', 'Bosnia y Herzegovina', '🇨🇭', '🇧🇦', '2026-06-18 16:00:00', 'Grupo B', false, false),
(10, 'Canadá', 'Catar', '🇨🇦', '🇶🇦', '2026-06-18 19:00:00', 'Grupo B', false, false),
(11, 'Suiza', 'Canadá', '🇨🇭', '🇨🇦', '2026-06-24 16:00:00', 'Grupo B', false, false),
(12, 'Bosnia y Herzegovina', 'Catar', '🇧🇦', '🇶🇦', '2026-06-24 16:00:00', 'Grupo B', false, false),

-- GRUPO C
(13, 'Brasil', 'Marruecos', '🇧🇷', '🇲🇦', '2026-06-13 19:00:00', 'Grupo C', false, false),
(14, 'Haití', 'Escocia', '🇭🇹', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', '2026-06-13 22:00:00', 'Grupo C', false, false),
(15, 'Escocia', 'Marruecos', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', '🇲🇦', '2026-06-19 19:00:00', 'Grupo C', false, false),
(16, 'Brasil', 'Haití', '🇧🇷', '🇭🇹', '2026-06-19 21:30:00', 'Grupo C', false, false),
(17, 'Marruecos', 'Haití', '🇲🇦', '🇭🇹', '2026-06-24 19:00:00', 'Grupo C', false, false),
(18, 'Escocia', 'Brasil', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', '🇧🇷', '2026-06-24 19:00:00', 'Grupo C', false, false),

-- GRUPO D
(19, 'Estados Unidos', 'Paraguay', '🇺🇸', '🇵🇾', '2026-06-12 22:00:00', 'Grupo D', false, false),
(20, 'Australia', 'Turquía', '🇦🇺', '🇹🇷', '2026-06-14 01:00:00', 'Grupo D', false, false),
(21, 'Estados Unidos', 'Australia', '🇺🇸', '🇦🇺', '2026-06-19 16:00:00', 'Grupo D', false, false),
(22, 'Turquía', 'Paraguay', '🇹🇷', '🇵🇾', '2026-06-20 00:00:00', 'Grupo D', false, false),
(23, 'Turquía', 'Estados Unidos', '🇹🇷', '🇺🇸', '2026-06-25 23:00:00', 'Grupo D', false, false),
(24, 'Paraguay', 'Australia', '🇵🇾', '🇦🇺', '2026-06-25 23:00:00', 'Grupo D', false, false),

-- GRUPO E
(25, 'Alemania', 'Curazao', '🇩🇪', '🇨🇼', '2026-06-14 14:00:00', 'Grupo E', false, false),
(26, 'Costa de Marfil', 'Ecuador', '🇨🇮', '🇪🇨', '2026-06-14 20:00:00', 'Grupo E', false, false),
(27, 'Alemania', 'Costa de Marfil', '🇩🇪', '🇨🇮', '2026-06-20 17:00:00', 'Grupo E', false, false),
(28, 'Ecuador', 'Curazao', '🇪🇨', '🇨🇼', '2026-06-20 21:00:00', 'Grupo E', false, false),
(29, 'Curazao', 'Costa de Marfil', '🇨🇼', '🇨🇮', '2026-06-25 17:00:00', 'Grupo E', false, false),
(30, 'Ecuador', 'Alemania', '🇪🇨', '🇩🇪', '2026-06-25 17:00:00', 'Grupo E', false, false),

-- GRUPO F
(31, 'Países Bajos', 'Japón', '🇳🇱', '🇯🇵', '2026-06-14 17:00:00', 'Grupo F', false, false),
(32, 'Suecia', 'Túnez', '🇸🇪', '🇹🇳', '2026-06-14 23:00:00', 'Grupo F', false, false),
(33, 'Países Bajos', 'Suecia', '🇳🇱', '🇸🇪', '2026-06-20 14:00:00', 'Grupo F', false, false),
(34, 'Túnez', 'Japón', '🇹🇳', '🇯🇵', '2026-06-21 01:00:00', 'Grupo F', false, false),
(35, 'Túnez', 'Países Bajos', '🇹🇳', '🇳🇱', '2026-06-25 20:00:00', 'Grupo F', false, false),
(36, 'Japón', 'Suecia', '🇯🇵', '🇸🇪', '2026-06-25 20:00:00', 'Grupo F', false, false),

-- GRUPO G
(37, 'Bélgica', 'Egipto', '🇧🇪', '🇪🇬', '2026-06-15 16:00:00', 'Grupo G', false, false),
(38, 'Irán', 'Nueva Zelanda', '🇮🇷', '🇳🇿', '2026-06-15 22:00:00', 'Grupo G', false, false),
(39, 'Bélgica', 'Irán', '🇧🇪', '🇮🇷', '2026-06-21 16:00:00', 'Grupo G', false, false),
(40, 'Nueva Zelanda', 'Egipto', '🇳🇿', '🇪🇬', '2026-06-21 22:00:00', 'Grupo G', false, false),
(41, 'Nueva Zelanda', 'Bélgica', '🇳🇿', '🇧🇪', '2026-06-27 00:00:00', 'Grupo G', false, false),
(42, 'Egipto', 'Irán', '🇪🇬', '🇮🇷', '2026-06-27 00:00:00', 'Grupo G', false, false),

-- GRUPO H
(43, 'España', 'Cabo Verde', '🇪🇸', '🇨🇻', '2026-06-15 13:00:00', 'Grupo H', false, false),
(44, 'Arabia Saudita', 'Uruguay', '🇸🇦', '🇺🇾', '2026-06-15 19:00:00', 'Grupo H', false, false),
(45, 'España', 'Arabia Saudita', '🇪🇸', '🇸🇦', '2026-06-21 13:00:00', 'Grupo H', false, false),
(46, 'Uruguay', 'Cabo Verde', '🇺🇾', '🇨🇻', '2026-06-21 19:00:00', 'Grupo H', false, false),
(47, 'Cabo Verde', 'Arabia Saudita', '🇨🇻', '🇸🇦', '2026-06-26 21:00:00', 'Grupo H', false, false),
(48, 'Uruguay', 'España', '🇺🇾', '🇪🇸', '2026-06-26 21:00:00', 'Grupo H', false, false),

-- GRUPO I
(49, 'Francia', 'Senegal', '🇫🇷', '🇸🇳', '2026-06-16 16:00:00', 'Grupo I', false, false),
(50, 'Irak', 'Noruega', '🇮逃', '🇳🇴', '2026-06-16 19:00:00', 'Grupo I', false, false),
(51, 'Francia', 'Irak', '🇫🇷', '🇮逃', '2026-06-22 18:00:00', 'Grupo I', false, false),
(52, 'Noruega', 'Senegal', '🇳🇴', '🇸🇳', '2026-06-22 21:00:00', 'Grupo I', false, false),
(53, 'Noruega', 'Francia', '🇳🇴', '🇫🇷', '2026-06-26 16:00:00', 'Grupo I', false, false),
(54, 'Senegal', 'Irak', '🇸🇳', '🇮逃', '2026-06-26 16:00:00', 'Grupo I', false, false),

-- GRUPO J
(55, 'Argentina', 'Argelia', '🇦🇷', '🇩🇿', '2026-06-16 22:00:00', 'Grupo J', false, false),
(56, 'Austria', 'Jordania', '🇦🇹', '🇯🇴', '2026-06-17 01:00:00', 'Grupo J', false, false),
(57, 'Argentina', 'Austria', '🇦🇷', '🇦🇹', '2026-06-22 14:00:00', 'Grupo J', false, false),
(58, 'Jordania', 'Argelia', '🇯🇴', '🇩🇿', '2026-06-23 00:00:00', 'Grupo J', false, false),
(59, 'Argelia', 'Austria', '🇩🇿', '🇦🇹', '2026-06-27 23:00:00', 'Grupo J', false, false),
(60, 'Jordania', 'Argentina', '🇯🇴', '🇦🇷', '2026-06-27 23:00:00', 'Grupo J', false, false),

-- GRUPO K
(61, 'Portugal', 'RD Congo', '🇵🇹', '🇨🇩', '2026-06-17 14:00:00', 'Grupo K', false, false),
(62, 'Uzbekistán', 'Colombia', '🇺🇿', '🇨🇴', '2026-06-17 23:00:00', 'Grupo K', false, false),
(63, 'Portugal', 'Uzbekistán', '🇵🇹', '🇺🇿', '2026-06-23 14:00:00', 'Grupo K', false, false),
(64, 'Colombia', 'RD Congo', '🇨🇴', '🇨🇩', '2026-06-23 23:00:00', 'Grupo K', false, false),
(65, 'Colombia', 'Portugal', '🇨🇴', '🇵🇹', '2026-06-27 20:30:00', 'Grupo K', false, false),
(66, 'RD Congo', 'Uzbekistán', '🇨🇩', '🇺🇿', '2026-06-27 20:30:00', 'Grupo K', false, false),

-- GRUPO L
(67, 'Inglaterra', 'Croacia', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🇭🇷', '2026-06-17 17:00:00', 'Grupo L', false, false),
(68, 'Ghana', 'Panamá', '🇬🇭', '🇵🇦', '2026-06-17 20:00:00', 'Grupo L', false, false),
(69, 'Inglaterra', 'Ghana', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🇬🇭', '2026-06-23 17:00:00', 'Grupo L', false, false),
(70, 'Panamá', 'Croacia', '🇵🇦', '🇭🇷', '2026-06-23 20:00:00', 'Grupo L', false, false),
(71, 'Panamá', 'Inglaterra', '🇵🇦', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '2026-06-27 18:00:00', 'Grupo L', false, false),
(72, 'Croacia', 'Ghana', '🇭🇷', '🇬🇭', '2026-06-27 18:00:00', 'Grupo L', false, false),

-- ELIMINATORIA DE 32 (16 partidos limpios, sin códigos)
(73, '1° Grupo A', '2° Grupo B', '⚽', '⚽', '2026-06-28 16:00:00', 'Eliminatoria de 32 - M73', false, false),
(74, '1° Grupo E', '3° Grupo A/B/C/D/F', '⚽', '⚽', '2026-06-28 20:00:00', 'Eliminatoria de 32 - M74', false, false),
(75, '1° Grupo F', '2° Grupo C', '⚽', '⚽', '2026-06-29 14:00:00', 'Eliminatoria de 32 - M75', false, false),
(76, '1° Grupo C', '2° Grupo F', '⚽', '⚽', '2026-06-29 17:30:00', 'Eliminatoria de 32 - M76', false, false),
(77, '1° Grupo I', '3° Grupo C/D/F/G/H', '⚽', '⚽', '2026-06-29 22:00:00', 'Eliminatoria de 32 - M77', false, false),
(78, '2° Grupo E', '2° Grupo I', '⚽', '⚽', '2026-06-30 14:00:00', 'Eliminatoria de 32 - M78', false, false),
(79, '1° Grupo A', '3° Grupo C/E/F/H/I', '⚽', '⚽', '2026-06-30 18:00:00', 'Eliminatoria de 32 - M79', false, false),
(80, '1° Grupo L', '3° Grupo E/H/I/J/K', '⚽', '⚽', '2026-06-30 22:00:00', 'Eliminatoria de 32 - M80', false, false),
(81, '1° Grupo D', '3° Grupo B/E/F/I/J', '⚽', '⚽', '2026-07-01 13:00:00', 'Eliminatoria de 32 - M81', false, false),
(82, '1° Grupo G', '3° Grupo A/E/H/I/J', '⚽', '⚽', '2026-07-01 17:00:00', 'Eliminatoria de 32 - M82', false, false),
(83, '2° Grupo K', '2° Grupo L', '⚽', '⚽', '2026-07-01 21:00:00', 'Eliminatoria de 32 - M83', false, false),
(84, '1° Grupo H', '2° Grupo J', '⚽', '⚽', '2026-07-02 16:00:00', 'Eliminatoria de 32 - M84', false, false),
(85, '1° Grupo B', '3° Grupo E/F/G/I/J', '⚽', '⚽', '2026-07-02 20:00:00', 'Eliminatoria de 32 - M85', false, false),
(86, '1° Grupo J', '2° Grupo H', '⚽', '⚽', '2026-07-03 00:00:00', 'Eliminatoria de 32 - M86', false, false),
(87, '1° Grupo K', '3° Grupo D/E/I/J/L', '⚽', '⚽', '2026-07-03 15:00:00', 'Eliminatoria de 32 - M87', false, false),
(88, '2° Grupo D', '2° Grupo G', '⚽', '⚽', '2026-07-03 19:00:00', 'Eliminatoria de 32 - M88', false, false),

-- OCTAVOS DE FINAL (8 partidos limpios)
(89, 'Ganador M73', 'Ganador M75', '🔥', '🔥', '2026-07-04 14:00:00', 'Octavos de Final - M89', false, false),
(90, 'Ganador M74', 'Ganador M77', '🔥', '🔥', '2026-07-04 18:00:00', 'Octavos de Final - M90', false, false),
(91, 'Ganador M76', 'Ganador M78', '🔥', '🔥', '2026-07-05 17:00:00', 'Octavos de Final - M91', false, false),
(92, 'Ganador M79', 'Ganador M80', '🔥', '🔥', '2026-07-05 21:00:00', 'Octavos de Final - M92', false, false),
(93, 'Ganador M83', 'Ganador M84', '🔥', '🔥', '2026-07-06 16:00:00', 'Octavos de Final - M93', false, false),
(94, 'Ganador M81', 'Ganador M82', '🔥', '🔥', '2026-07-06 21:00:00', 'Octavos de Final - M94', false, false),
(95, 'Ganador M86', 'Ganador M88', '🔥', '🔥', '2026-07-07 13:00:00', 'Octavos de Final - M95', false, false),
(96, 'Ganador M85', 'Ganador M87', '🔥', '🔥', '2026-07-07 17:00:00', 'Octavos de Final - M96', false, false),

-- CUARTOS DE FINAL (4 partidos limpios)
(97, 'Ganador M89', 'Ganador M90', '⭐', '⭐', '2026-07-09 17:00:00', 'Cuartos de Final - M97', false, false),
(98, 'Ganador M93', 'Ganador M94', '⭐', '⭐', '2026-07-09 21:00:00', 'Cuartos de Final - M98', false, false),
(99, 'Ganador M91', 'Ganador M92', '⭐', '⭐', '2026-07-10 17:00:00', 'Cuartos de Final - M99', false, false),
(100, 'Ganador M95', 'Ganador M96', '⭐', '⭐', '2026-07-10 21:00:00', 'Cuartos de Final - M100', false, false),

-- SEMIFINALES (2 partidos limpios)
(101, 'Ganador M97', 'Ganador M98', '⚡', '⚡', '2026-07-14 19:00:00', 'Semifinal - M101', false, false),
(102, 'Ganador M99', 'Ganador M100', '⚡', '⚡', '2026-07-15 19:00:00', 'Semifinal - M102', false, false),

-- TERCER PUESTO (1 partido limpio)
(103, 'Perdedor M101', 'Perdedor M102', '🥉', '🥉', '2026-07-18 16:00:00', 'Tercer Puesto - M103', false, false),

-- FINAL (1 partido limpio)
(104, 'Ganador M101', 'Ganador M102', '🏆', '🏆', '2026-07-19 16:00:00', 'Final - M104', false, false);
