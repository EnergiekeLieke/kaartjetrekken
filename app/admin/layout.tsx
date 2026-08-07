import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { getTenantVoorIngelogdeAdmin } from '@/lib/tenant';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await auth.protect();
  const tenant = await getTenantVoorIngelogdeAdmin();

  if (!tenant) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <h1 className="text-xl font-semibold mb-2">Nog geen klant gekoppeld</h1>
        <p className="text-sm text-el-dark-slate/70">
          Dit account is nog niet gekoppeld aan een klant. Neem contact op met Energieke Lieke.
        </p>
      </div>
    );
  }

  const links = [
    { href: '/admin', label: 'Overzicht' },
    { href: '/admin/branding', label: 'Branding' },
    { href: '/admin/categorieen', label: 'Categorieën' },
    { href: '/admin/kaarten', label: 'Kaarten' },
    { href: '/admin/instellingen', label: 'Instellingen' },
  ];

  return (
    <div className="min-h-screen bg-el-cream">
      <header className="bg-el-dark-slate text-el-cream px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="leading-tight">
            <span className="font-salmon text-xl text-el-light-bg block">Kaartjetrekken</span>
            <span className="text-[11px] text-el-mid-green tracking-widest uppercase">door Energieke Lieke</span>
          </div>
          <a
            href={`/${tenant.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-el-orange hover:text-el-light-bg underline underline-offset-2"
          >
            Bekijk trekpagina →
          </a>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-salmon text-lg text-el-dark-slate mb-4">{tenant.naam}</h1>
        <nav className="flex flex-wrap gap-1 mb-8 border-b border-el-light-bg text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-2 text-el-dark-slate/70 hover:text-el-dark-red border-b-2 border-transparent hover:border-el-dark-red transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        {children}
      </div>
    </div>
  );
}
