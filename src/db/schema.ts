import { pgTable, serial, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  telefono: varchar("telefono", { length: 50 }).notNull(),
  instagram: varchar("instagram", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  password: varchar("password", { length: 255 }).notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  puntos: integer("puntos").default(0).notNull(),
  exactos: integer("exactos").default(0).notNull(),
  jugados: integer("jugados").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  equipoA: varchar("equipo_a", { length: 100 }).notNull(),
  equipoB: varchar("equipo_b", { length: 100 }).notNull(),
  banderaA: varchar("bandera_a", { length: 20 }).notNull(),
  banderaB: varchar("bandera_b", { length: 20 }).notNull(),
  fechaHora: timestamp("fecha_hora").notNull(),
  ronda: varchar("ronda", { length: 100 }).notNull(),
  started: boolean("started").default(false).notNull(),
  finished: boolean("finished").default(false).notNull(),
  golesA: integer("goles_a"),
  golesB: integer("goles_b"),
});

export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  matchId: integer("match_id").references(() => matches.id, { onDelete: "cascade" }).notNull(),
  golesA: integer("goles_a").notNull(),
  golesB: integer("goles_b").notNull(),
  puntosObtenidos: integer("puntos_obtenidos").default(0).notNull(),
  calculado: boolean("calculado").default(false).notNull(),
});
