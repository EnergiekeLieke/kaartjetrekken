import { getTenantVoorIngelogdeAdmin } from '@/lib/tenant';

export default async function AdminOverzicht() {
  const tenant = await getTenantVoorIngelogdeAdmin();
  if (!tenant) return null;

  return (
    <div className="space-y-2 text-sm text-el-dark-slate/70 bg-white rounded-2xl border border-el-light-bg p-6 shadow-sm">
      <p>Welkom terug! Gebruik het menu hierboven om je branding, categorieën, kaartjes en instellingen te beheren.</p>
      <p>
        Je trekpagina staat live op{' '}
        <code className="bg-el-light-bg2 text-el-dark-slate px-1.5 py-0.5 rounded">/{tenant.slug}</code>.
      </p>
    </div>
  );
}
