// ============================================
// HEALTH CHECK — Simple, sin dependencia de DB
// Netlify verifica este endpoint para confirmar
// que las funciones serverless están activas
// ============================================
export async function GET() {
  return Response.json({
    ok: true,
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
}
