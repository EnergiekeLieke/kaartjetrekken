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
        <p className="text-sm text-gray-600">
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
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-lg font-semibold">{tenant.naam}</h1>
        <a
          href={`/${tenant.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 underline"
        >
          Bekijk trekpagina →
        </a>
      </div>
      <nav className="flex gap-4 mb-8 border-b pb-3 text-sm">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="text-gray-600 hover:text-gray-900">
            {l.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
