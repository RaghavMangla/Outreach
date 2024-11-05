import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const contacts = pgTable("contacts", {
  id: text('id').primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email"),
  company: varchar("company"),
  information: varchar("information"),
  created_at: timestamp("created_at").defaultNow()
});