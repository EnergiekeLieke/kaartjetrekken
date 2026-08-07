import { currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { tenantAdmins, tenants } from '@/lib/db/schema';

export default async function AdminPage() {
  const user = await currentUser();
  if (!user) return null;

  const db = getDb();
  const [koppeling] = await db
    .select({ tenant: tenants })
    .from(tenantAdmins)
    .innerJoin(tenants, eq(tenantAdmins.tenantId, tenants.id))
    .where(eq(tenantAdmins.clerkUserId, user.id))
    .limit(1);

  if (!koppeling) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <h1 className="text-xl font-semibold mb-2">Nog geen klant gekoppeld</h1>
        <p className="text-sm text-gray-600">
          Dit account is nog niet gekoppeld aan een klant. Neem contact op met Energieke Lieke.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-2xl font-semibold mb-2">Welkom, {koppeling.tenant.naam}</h1>
      <p className="text-sm text-gray-600">Admin-omgeving volgt hier binnenkort.</p>
    </div>
  );
}
