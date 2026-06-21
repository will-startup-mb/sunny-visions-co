import { pgTable, uuid, text, boolean, integer, date, timestamp } from 'drizzle-orm/pg-core';

export const companies = pgTable('companies', {
  id: uuid('id').defaultRandom().primaryKey(),
  company_name: text('company_name').notNull(),
  website: text('website'),
  city_region: text('city_region'),
  primary_industry: text('primary_industry'),
  secondary_industry: text('secondary_industry'),
  stage: text('stage'),
  estimated_employees: text('estimated_employees'),
  funding_raised: text('funding_raised'),
  company_description: text('company_description'),
  contact_name: text('contact_name'),
  contact_email: text('contact_email'),
  founder_names: text('founder_names'),
  founder_overview: text('founder_overview'),
  founder_linkedin_url: text('founder_linkedin_url'),
  company_linkedin_url: text('company_linkedin_url'),
  has_about_page: boolean('has_about_page'),
  has_team_page: boolean('has_team_page'),
  social_media_active: boolean('social_media_active'),
  press_coverage: boolean('press_coverage'),
  innovation_score: integer('innovation_score'),
  opportunity_score: integer('opportunity_score'),
  interview_priority: text('interview_priority'),
  founder_status: text('founder_status').default('Not Contacted'),
  last_contact_date: date('last_contact_date'),
  outreach_linkedin_draft: text('outreach_linkedin_draft'),
  outreach_notes: text('outreach_notes'),
  interviewed: boolean('interviewed').default(false),
  podcast_episode: text('podcast_episode'),
  logo_url: text('logo_url'),
  logo_upload_url: text('logo_upload_url'),
  logo_bg_color: text('logo_bg_color').default('#FFFFFF'),
  source_list: text('source_list'),
  research_date: date('research_date'),
  research_notes: text('research_notes'),
  slug: text('slug').unique(),
  is_published: boolean('is_published').default(false),
  confidence_scores: text('confidence_scores'), // JSON: { field: 'high'|'medium'|'low' }
  field_refresh_dates: text('field_refresh_dates'), // JSON: { field: 'YYYY-MM-DD' }
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;

export const suggestions = pgTable('suggestions', {
  id: uuid('id').defaultRandom().primaryKey(),
  company_name: text('company_name').notNull(),
  website: text('website'),
  description: text('description'),
  submitter_name: text('submitter_name').notNull(),
  submitter_email: text('submitter_email').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  status: text('status').notNull().default('pending'),
  accepted_at: timestamp('accepted_at'),
});

export type Suggestion = typeof suggestions.$inferSelect;

export const researchHistory = pgTable('research_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  company_id: uuid('company_id'),
  company_name: text('company_name').notNull(),
  run_at: timestamp('run_at').defaultNow().notNull(),
  status: text('status').notNull(), // 'success' | 'failed'
  estimated_cost_usd: text('estimated_cost_usd').notNull(),
  input_tokens: integer('input_tokens'),
  output_tokens: integer('output_tokens'),
  cache_read_tokens: integer('cache_read_tokens'),
  cache_write_tokens: integer('cache_write_tokens'),
  run_type: text('run_type').default('single'), // 'single' | 'batch'
  batch_job_id: uuid('batch_job_id'),
  error_message: text('error_message'),
});

export type ResearchHistory = typeof researchHistory.$inferSelect;

export const batchJobs = pgTable('batch_jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  anthropic_batch_id: text('anthropic_batch_id').notNull().unique(),
  company_ids: text('company_ids').notNull(), // JSON: [{ id, name }]
  status: text('status').notNull().default('pending'), // pending|processing|complete|failed
  total_companies: integer('total_companies').notNull(),
  completed_companies: integer('completed_companies').default(0),
  estimated_cost_usd: text('estimated_cost_usd'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  completed_at: timestamp('completed_at'),
});

export type BatchJob = typeof batchJobs.$inferSelect;

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull().default(''),
  excerpt: text('excerpt'),
  published: boolean('published').notNull().default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

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
