import { pgTable, timestamp, varchar, uuid, jsonb, text } from "drizzle-orm/pg-core";

export const pipelines = pgTable("pipelines", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  sourceKey: varchar("source_key", {length: 50}).unique().notNull(),
  actionType: varchar("action_type", {length: 50}).notNull(),
  config: jsonb("config"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export type Pipeline = typeof pipelines.$inferSelect;
