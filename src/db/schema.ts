import { pgTable, serial, varchar, integer, timestamp, boolean, text } from "drizzle-orm/pg-core";

// ============================================
// TABLA DE USUARIOS
// Almacena los datos de cada participante
// ============================================
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  instagram: varchar("instagram", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  password: varchar("password", { length: 255 }).notNull(),
  totalPoints: integer("total_points").notNull().default(0),
  exactPredictions: integer("exact_predictions").notNull().default(0),
  predictionsCount: integer("predictions_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================
// TABLA DE PARTIDOS
// Cada partido del Mundial con sus datos
// ============================================
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  teamA: varchar("team_a", { length: 100 }).notNull(),
  teamB: varchar("team_b", { length: 100 }).notNull(),
  flagA: varchar("flag_a", { length: 10 }).notNull().default("⚽"),
  flagB: varchar("flag_b", { length: 10 }).notNull().default("⚽"),
  groupName: varchar("group_name", { length: 50 }).notNull(),
  matchDate: timestamp("match_date").notNull(),
  stage: varchar("stage", { length: 50 }).notNull().default("Fase de Grupos"),
  scoreA: integer("score_a"),
  scoreB: integer("score_b"),
  isFinished: boolean("is_finished").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================
// TABLA DE PREDICCIONES
// Las predicciones de cada usuario para cada partido
// ============================================
export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  matchId: integer("match_id").notNull(),
  predictedScoreA: integer("predicted_score_a").notNull(),
  predictedScoreB: integer("predicted_score_b").notNull(),
  pointsEarned: integer("points_earned").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
