import { getTenantVoorIngelogdeAdmin } from '@/lib/tenant';

export default async function AdminPage() {
  const tenant = await getTenantVoorIngelogdeAdmin();

  if (!tenant) {
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
      <h1 className="text-2xl font-semibold mb-2">Welkom, {tenant.naam}</h1>
      <p className="text-sm text-gray-600">Admin-omgeving volgt hier binnenkort.</p>
    </div>
  );
}
