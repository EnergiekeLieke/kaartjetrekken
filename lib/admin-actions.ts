'use server';

import { eq } from 'drizzle-orm';
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
      kleurPrimair: String(formData.get('kleurPrimair')),
      kleurSecundair: String(formData.get('kleurSecundair')),
      introTekst: leegNaarNull(formData.get('introTekst')),
      ctaTekst: leegNaarNull(formData.get('ctaTekst')),
      ctaUrl: leegNaarNull(formData.get('ctaUrl')),
      logoUrl,
    })
    .where(eq(tenants.id, tenant.id));

  revalidatePath('/admin/branding');
  revalidatePath(`/${tenant.slug}`);
}

export async function updateInstellingen(formData: FormData) {
  const tenant = await vereisTenant();
  const db = getDb();

  const aantal = Number(formData.get('aantalKaartjesPerTrek'));
  const toegang = String(formData.get('toegang')) as (typeof toegangEnum.enumValues)[number];

  await db
    .update(tenants)
    .set({
      aantalKaartjesPerTrek: Number.isFinite(aantal) && aantal > 0 ? aantal : tenant.aantalKaartjesPerTrek,
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

  await db.insert(categorieen).values({
    tenantId: tenant.id,
    naam: String(formData.get('naam')),
    kleur: String(formData.get('kleur')),
  });

  revalidatePath('/admin/categorieen');
  revalidatePath(`/${tenant.slug}`);
}

export async function updateCategorie(formData: FormData) {
  const tenant = await vereisTenant();
  const db = getDb();
  const id = Number(formData.get('id'));

  await db
    .update(categorieen)
    .set({ naam: String(formData.get('naam')), kleur: String(formData.get('kleur')) })
    .where(eq(categorieen.id, id));

  revalidatePath('/admin/categorieen');
  revalidatePath(`/${tenant.slug}`);
}

export async function verwijderCategorie(formData: FormData) {
  const tenant = await vereisTenant();
  const db = getDb();
  const id = Number(formData.get('id'));

  await db.delete(categorieen).where(eq(categorieen.id, id));

  revalidatePath('/admin/categorieen');
  revalidatePath('/admin/kaarten');
  revalidatePath(`/${tenant.slug}`);
}

export async function maakKaart(formData: FormData) {
  const tenant = await vereisTenant();
  const db = getDb();

  let afbeeldingUrl: string | null = null;
  const afbeelding = formData.get('afbeelding');
  if (afbeelding instanceof File && afbeelding.size > 0) {
    afbeeldingUrl = await slaAfbeeldingOp(tenant.slug, afbeelding);
  }

  await db.insert(kaarten).values({
    tenantId: tenant.id,
    categorieId: Number(formData.get('categorieId')),
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

  await db.delete(kaarten).where(eq(kaarten.id, id));

  revalidatePath('/admin/kaarten');
  revalidatePath(`/${tenant.slug}`);
}
