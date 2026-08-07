import { pgTable, serial, text, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const toegangEnum = pgEnum('toegang', ['open', 'code']);

export const tenants = pgTable('tenants', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  naam: text('naam').notNull(),
  logoUrl: text('logo_url'),
  kleurPrimair: text('kleur_primair').notNull().default('#1a4a7a'),
  kleurSecundair: text('kleur_secundair').notNull().default('#d56119'),
  aantalKaartjesPerTrek: integer('aantal_kaartjes_per_trek').notNull().default(6),
  toegang: toegangEnum('toegang').notNull().default('open'),
  toegangscode: text('toegangscode'),
  introTekst: text('intro_tekst'),
  ctaTekst: text('cta_tekst'),
  ctaUrl: text('cta_url'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const tenantAdmins = pgTable('tenant_admins', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  clerkUserId: text('clerk_user_id').notNull().unique(),
});

export const categorieen = pgTable('categorieen', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  naam: text('naam').notNull(),
  kleur: text('kleur').notNull(),
  volgorde: integer('volgorde').notNull().default(0),
});

export const kaarten = pgTable('kaarten', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  categorieId: integer('categorie_id').notNull().references(() => categorieen.id, { onDelete: 'cascade' }),
  tekst: text('tekst').notNull(),
  afbeeldingUrl: text('afbeelding_url'),
  volgorde: integer('volgorde').notNull().default(0),
});
