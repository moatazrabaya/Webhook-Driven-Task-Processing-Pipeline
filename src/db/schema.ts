import {
  pgTable,
  timestamp,
  varchar,
  uuid,
  jsonb,
  text,
  integer,
} from "drizzle-orm/pg-core";

export const pipelines = pgTable("pipelines", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  sourceKey: varchar("source_key", { length: 50 }).unique().notNull(),
  actionType: varchar("action_type", { length: 50 }).notNull(),
  config: jsonb("config"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Pipeline = typeof pipelines.$inferSelect; // The "Output" Type: use this when you are reading a pipeline
export type NewPipeline = typeof pipelines.$inferInsert; // The "Input" Type: data coming out of the database

export const subscribers = pgTable("subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  pipelineId: uuid("pipeline_id")
    .references(() => pipelines.id, { onDelete: "cascade" })
    .notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Subscriber = typeof subscribers.$inferSelect;
export type NewSubscriber = typeof subscribers.$inferInsert;

export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  pipelineId: uuid("pipeline_id")
    .references(() => pipelines.id, { onDelete: "cascade" })
    .notNull(),
  payload: jsonb("payload").notNull(),
  result: jsonb("result").$type<Record<string, unknown> | null>(),
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  processedAt: timestamp("processed_at"),
});

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;

export const deliveryAttempts = pgTable("delivery_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobId: uuid("job_id")
    .references(() => jobs.id, { onDelete: "cascade" })
    .notNull(),
  subscriberUrl: text("url").notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  attemptNumber: integer("attempt_number").notNull(),
  response: text("response").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type DeliveryAttempt = typeof deliveryAttempts.$inferSelect;
export type NewDeliveryAttempt = typeof deliveryAttempts.$inferInsert;
