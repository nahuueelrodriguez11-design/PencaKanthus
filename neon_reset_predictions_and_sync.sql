-- ========================================================================================
-- SCRIPT SQL DE RESETEO DE PREDICTIONS Y VERIFICACIÓN DE ESQUEMA EN NEON
-- Penca Mundial Kanthus - Kanthus Smash Club
-- 
-- IMPORTANTE: Pega y ejecuta este script directamente en la pestaña "SQL Editor" de tu 
-- consola en Neon.tech para limpiar y sincronizar la tabla public.predictions real.
-- ========================================================================================

-- 1. Eliminamos de raíz la tabla vieja de predicciones para destruir cualquier registro desincronizado
DROP TABLE IF EXISTS public.predictions CASCADE;

-- 2. Recreamos la tabla de predicciones asegurando de manera estricta y absoluta las 7 columnas requeridas
CREATE TABLE public.predictions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    match_id INTEGER NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    goles_a INTEGER NOT NULL,
    goles_b INTEGER NOT NULL,
    puntos_obtenidos INTEGER DEFAULT 0 NOT NULL,
    calculado BOOLEAN DEFAULT false NOT NULL
);

-- Creamos índices para acelerar las consultas de los usuarios y partidos en Netlify
CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON public.predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_match_id ON public.predictions(match_id);

-- Confirmación de esquema recreado exitosamente
