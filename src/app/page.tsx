import { db } from "@/db";
import { users, matches, predictions } from "@/db/schema";
import { ensureSeedData } from "@/lib/seedData";
import PencaDashboard from "@/components/PencaDashboard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Aseguramos que existan partidos iniciales premium y usuarios demo para que la penca esté 100% activa
  await ensureSeedData();

  // Obtenemos los usuarios, partidos y predicciones actuales desde PostgreSQL
  const initialUsersList = await db.select().from(users);
  const initialMatchesList = await db.select().from(matches).orderBy(matches.fechaHora);
  const initialPredictionsList = await db.select().from(predictions);

  return (
    <PencaDashboard 
      initialUsers={initialUsersList}
      initialMatches={initialMatchesList}
      initialPredictions={initialPredictionsList}
    />
  );
}
