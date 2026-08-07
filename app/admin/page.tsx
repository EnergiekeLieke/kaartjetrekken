import { getTenantVoorIngelogdeAdmin } from '@/lib/tenant';

export default async function AdminOverzicht() {
  const tenant = await getTenantVoorIngelogdeAdmin();
  if (!tenant) return null;

  return (
    <div className="space-y-2 text-sm text-gray-600">
      <p>Welkom terug! Gebruik het menu hierboven om je branding, categorieën, kaartjes en instellingen te beheren.</p>
      <p>
        Je trekpagina staat live op <code className="bg-gray-100 px-1 rounded">/{tenant.slug}</code>.
      </p>
    </div>
  );
}
