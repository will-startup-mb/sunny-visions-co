import { pgTable, uuid, text, boolean, decimal, date, timestamp } from 'drizzle-orm/pg-core';

export const clients = pgTable('clients', {
  id: uuid('id').defaultRandom().primaryKey(),
  client_name: text('client_name').notNull(),
  slug: text('slug').unique(),
  email: text('email'),
  phone: text('phone'),
  service_type: text('service_type'), // Video / Graphic Design / Photography / Wedding / Other
  status: text('status').default('Lead'), // Lead / Proposal Sent / Active / Complete / Lost
  project_value: decimal('project_value', { precision: 10, scale: 2 }),
  project_description: text('project_description'),
  outreach_notes: text('outreach_notes'),
  last_contact_date: date('last_contact_date'),
  became_client: boolean('became_client').default(false),
  portfolio_published: boolean('portfolio_published').default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;

export const projectCosts = pgTable('project_costs', {
  id: uuid('id').defaultRandom().primaryKey(),
  client_id: uuid('client_id').references(() => clients.id),
  description: text('description'),
  amount: decimal('amount', { precision: 10, scale: 2 }),
  cost_date: date('cost_date'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export type ProjectCost = typeof projectCosts.$inferSelect;
export type NewProjectCost = typeof projectCosts.$inferInsert;

export const inquiries = pgTable('inquiries', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  status: text('status').notNull().default('New'), // New / Reviewed / Replied
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export type Inquiry = typeof inquiries.$inferSelect;

export const adminSettings = pgTable('admin_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type AdminSetting = typeof adminSettings.$inferSelect;

export const siteContent = pgTable('site_content', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type SiteContent = typeof siteContent.$inferSelect;
