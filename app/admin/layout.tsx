import { auth } from '@clerk/nextjs/server';
import { getTenantVoorIngelogdeAdmin } from '@/lib/tenant';
import AdminNav from '@/components/AdminNav';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await auth.protect();
  const tenant = await getTenantVoorIngelogdeAdmin();

  if (!tenant) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <h1 className="text-xl font-semibold text-el-dark-slate mb-2">Nog geen klant gekoppeld</h1>
        <p className="text-sm text-el-dark-slate/85">
          Dit account is nog niet gekoppeld aan een klant. Neem contact op met Energieke Lieke.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-el-cream">
      <header className="bg-el-dark-slate text-el-cream px-4 sm:px-6 py-5 shadow-md">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="leading-tight">
            <span className="font-salmon text-2xl text-el-light-bg block">Kaartjetrekken</span>
            <span className="text-[11px] text-el-cream/70 tracking-widest uppercase">door Energieke Lieke</span>
          </div>
          <a
            href={`/${tenant.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-el-orange hover:text-el-light-bg underline underline-offset-2"
          >
            Bekijk speelpagina →
          </a>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10 text-el-dark-slate">
        <h1 className="font-salmon text-2xl text-el-dark-slate mb-6">{tenant.naam}</h1>
        <AdminNav />
        {children}
      </div>
    </div>
  );
}
