'use server';

import { eq, and, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getDb } from './db';
import { tenants, categorieen, kaarten, type toegangEnum } from './db/schema';
import { getTenantVoorIngelogdeAdmin } from './tenant';
import { slaAfbeeldingOp } from './blob';

async function vereisTenant() {
  const tenant = await getTenantVoorIngelogdeAdmin();
  if (!tenant) throw new Error('Geen klant gekoppeld aan dit account');
  return tenant;
}

function leegNaarNull(waarde: FormDataEntryValue | null): string | null {
  const tekst = String(waarde ?? '').trim();
  return tekst === '' ? null : tekst;
}

const HEX_KLEUR = /^#[0-9a-fA-F]{6}$/;
function geldigeKleur(waarde: FormDataEntryValue | null, fallback: string): string {
  const tekst = String(waarde ?? '').trim();
  return HEX_KLEUR.test(tekst) ? tekst : fallback;
}

export async function updateBranding(formData: FormData) {
  const tenant = await vereisTenant();
  const db = getDb();

  let logoUrl = tenant.logoUrl;
  const logoBestand = formData.get('logo');
  if (logoBestand instanceof File && logoBestand.size > 0) {
    logoUrl = await slaAfbeeldingOp(tenant.slug, logoBestand);
  }

  await db
    .update(tenants)
    .set({
      kleurPrimair: geldigeKleur(formData.get('kleurPrimair'), tenant.kleurPrimair),
      kleurSecundair: geldigeKleur(formData.get('kleurSecundair'), tenant.kleurSecundair),
      kleurAchtergrond: geldigeKleur(formData.get('kleurAchtergrond'), tenant.kleurAchtergrond),
      introTekst: leegNaarNull(formData.get('introTekst')),
      ctaTekst: leegNaarNull(formData.get('ctaTekst')),
      ctaUrl: leegNaarNull(formData.get('ctaUrl')),
      logoUrl,
    })
    .where(eq(tenants.id, tenant.id));

  revalidatePath('/admin/branding');
  revalidatePath(`/${tenant.slug}`);
}

const MAX_KAARTJES_PER_TREK = 20;

export async function updateInstellingen(formData: FormData) {
  const tenant = await vereisTenant();
  const db = getDb();

  const aantal = Number(formData.get('aantalKaartjesPerTrek'));
  const aantalBegrensd = Number.isFinite(aantal)
    ? Math.min(MAX_KAARTJES_PER_TREK, Math.max(1, Math.round(aantal)))
    : tenant.aantalKaartjesPerTrek;
  const toegang = String(formData.get('toegang')) as (typeof toegangEnum.enumValues)[number];

  await db
    .update(tenants)
    .set({
      aantalKaartjesPerTrek: aantalBegrensd,
      toegang,
      toegangscode: toegang === 'code' ? leegNaarNull(formData.get('toegangscode')) : null,
    })
    .where(eq(tenants.id, tenant.id));

  revalidatePath('/admin/instellingen');
  revalidatePath(`/${tenant.slug}`);
}

export async function maakCategorie(formData: FormData) {
  const tenant = await vereisTenant();
  const db = getDb();

  let achtergrondUrl: string | null = null;
  const achtergrond = formData.get('achtergrond');
  if (achtergrond instanceof File && achtergrond.size > 0) {
    achtergrondUrl = await slaAfbeeldingOp(tenant.slug, achtergrond);
  }

  await db.insert(categorieen).values({
    tenantId: tenant.id,
    naam: String(formData.get('naam')),
    kleur: geldigeKleur(formData.get('kleur'), '#1a4a7a'),
    achtergrondUrl,
  });

  revalidatePath('/admin/categorieen');
  revalidatePath(`/${tenant.slug}`);
}

export async function updateCategorie(formData: FormData) {
  const tenant = await vereisTenant();
  const db = getDb();
  const id = Number(formData.get('id'));

  const [bestaande] = await db
    .select()
    .from(categorieen)
    .where(and(eq(categorieen.id, id), eq(categorieen.tenantId, tenant.id)))
    .limit(1);
  if (!bestaande) return;

  let achtergrondUrl = bestaande.achtergrondUrl;
  const achtergrond = formData.get('achtergrond');
  if (achtergrond instanceof File && achtergrond.size > 0) {
    achtergrondUrl = await slaAfbeeldingOp(tenant.slug, achtergrond);
  }

  await db
    .update(categorieen)
    .set({
      naam: String(formData.get('naam')),
      kleur: geldigeKleur(formData.get('kleur'), bestaande.kleur),
      achtergrondUrl,
    })
    .where(and(eq(categorieen.id, id), eq(categorieen.tenantId, tenant.id)));

  revalidatePath('/admin/categorieen');
  revalidatePath(`/${tenant.slug}`);
}

export async function verwijderCategorie(formData: FormData) {
  const tenant = await vereisTenant();
  const db = getDb();
  const id = Number(formData.get('id'));

  await db.delete(categorieen).where(and(eq(categorieen.id, id), eq(categorieen.tenantId, tenant.id)));

  revalidatePath('/admin/categorieen');
  revalidatePath('/admin/kaarten');
  revalidatePath(`/${tenant.slug}`);
}

export async function verplaatsCategorie(richting: 'omhoog' | 'omlaag', formData: FormData) {
  const tenant = await vereisTenant();
  const db = getDb();
  const id = Number(formData.get('id'));

  const lijst = await db
    .select()
    .from(categorieen)
    .where(eq(categorieen.tenantId, tenant.id))
    .orderBy(asc(categorieen.volgorde), asc(categorieen.id));

  const index = lijst.findIndex((c) => c.id === id);
  const nieuweIndex = richting === 'omhoog' ? index - 1 : index + 1;
  if (index === -1 || nieuweIndex < 0 || nieuweIndex >= lijst.length) return;

  [lijst[index], lijst[nieuweIndex]] = [lijst[nieuweIndex], lijst[index]];
  await Promise.all(lijst.map((cat, i) => db.update(categorieen).set({ volgorde: i }).where(eq(categorieen.id, cat.id))));

  revalidatePath('/admin/categorieen');
  revalidatePath(`/${tenant.slug}`);
}

export async function maakKaart(formData: FormData) {
  const tenant = await vereisTenant();
  const db = getDb();
  const categorieId = Number(formData.get('categorieId'));

  const [categorie] = await db
    .select()
    .from(categorieen)
    .where(and(eq(categorieen.id, categorieId), eq(categorieen.tenantId, tenant.id)))
    .limit(1);
  if (!categorie) return;

  let afbeeldingUrl: string | null = null;
  const afbeelding = formData.get('afbeelding');
  if (afbeelding instanceof File && afbeelding.size > 0) {
    afbeeldingUrl = await slaAfbeeldingOp(tenant.slug, afbeelding);
  }

  await db.insert(kaarten).values({
    tenantId: tenant.id,
    categorieId: categorie.id,
    tekst: String(formData.get('tekst')),
    afbeeldingUrl,
  });

  revalidatePath('/admin/kaarten');
  revalidatePath(`/${tenant.slug}`);
}

export async function verwijderKaart(formData: FormData) {
  const tenant = await vereisTenant();
  const db = getDb();
  const id = Number(formData.get('id'));

  await db.delete(kaarten).where(and(eq(kaarten.id, id), eq(kaarten.tenantId, tenant.id)));

  revalidatePath('/admin/kaarten');
  revalidatePath(`/${tenant.slug}`);
}

export async function verplaatsKaart(richting: 'omhoog' | 'omlaag', formData: FormData) {
  const tenant = await vereisTenant();
  const db = getDb();
  const id = Number(formData.get('id'));
  const categorieId = Number(formData.get('categorieId'));

  const lijst = await db
    .select()
    .from(kaarten)
    .where(and(eq(kaarten.tenantId, tenant.id), eq(kaarten.categorieId, categorieId)))
    .orderBy(asc(kaarten.volgorde), asc(kaarten.id));

  const index = lijst.findIndex((k) => k.id === id);
  const nieuweIndex = richting === 'omhoog' ? index - 1 : index + 1;
  if (index === -1 || nieuweIndex < 0 || nieuweIndex >= lijst.length) return;

  [lijst[index], lijst[nieuweIndex]] = [lijst[nieuweIndex], lijst[index]];
  await Promise.all(lijst.map((kaart, i) => db.update(kaarten).set({ volgorde: i }).where(eq(kaarten.id, kaart.id))));

  revalidatePath('/admin/kaarten');
  revalidatePath(`/${tenant.slug}`);
}
