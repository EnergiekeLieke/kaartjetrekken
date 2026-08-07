import { currentUser } from '@clerk/nextjs/server';
import { eq, and, isNull } from 'drizzle-orm';
import { getDb } from './db';
import { tenantAdmins, tenants } from './db/schema';

/**
 * Zoekt de klant (tenant) bij het ingelogde Clerk-account.
 * Bij eerste login na een uitnodiging (clerkUserId nog leeg) wordt de
 * tenant_admins-rij geclaimd op basis van het e-mailadres.
 */
export async function getTenantVoorIngelogdeAdmin() {
  const user = await currentUser();
  if (!user) return null;

  const db = getDb();

  const [gekoppeld] = await db
    .select({ tenant: tenants })
    .from(tenantAdmins)
    .innerJoin(tenants, eq(tenantAdmins.tenantId, tenants.id))
    .where(eq(tenantAdmins.clerkUserId, user.id))
    .limit(1);

  if (gekoppeld) return gekoppeld.tenant;

  const email = user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress;
  if (!email) return null;

  const [uitnodiging] = await db
    .select({ id: tenantAdmins.id, tenant: tenants })
    .from(tenantAdmins)
    .innerJoin(tenants, eq(tenantAdmins.tenantId, tenants.id))
    .where(and(eq(tenantAdmins.email, email), isNull(tenantAdmins.clerkUserId)))
    .limit(1);

  if (!uitnodiging) return null;

  await db.update(tenantAdmins).set({ clerkUserId: user.id }).where(eq(tenantAdmins.id, uitnodiging.id));

  return uitnodiging.tenant;
}
