import { eq, asc } from 'drizzle-orm';
import { getDb } from './db';
import { tenants, categorieen, kaarten } from './db/schema';

export async function getTenantMetInhoud(slug: string) {
  const db = getDb();

  const [tenant] = await db.select().from(tenants).where(eq(tenants.slug, slug)).limit(1);
  if (!tenant) return null;

  const [tenantCategorieen, tenantKaarten] = await Promise.all([
    db.select().from(categorieen).where(eq(categorieen.tenantId, tenant.id)).orderBy(asc(categorieen.volgorde)),
    db.select().from(kaarten).where(eq(kaarten.tenantId, tenant.id)).orderBy(asc(kaarten.volgorde)),
  ]);

  return { ...tenant, categorieen: tenantCategorieen, kaarten: tenantKaarten };
}

export type TenantMetInhoud = NonNullable<Awaited<ReturnType<typeof getTenantMetInhoud>>>;
