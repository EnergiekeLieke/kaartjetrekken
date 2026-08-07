'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin', label: 'Overzicht' },
  { href: '/admin/branding', label: 'Branding' },
  { href: '/admin/categorieen', label: 'Categorieën' },
  { href: '/admin/kaarten', label: 'Kaarten' },
  { href: '/admin/instellingen', label: 'Instellingen' },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1 mb-8 border-b border-el-light-bg text-sm">
      {links.map((l) => {
        const actief = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`px-3 py-2 border-b-2 -mb-px transition-colors ${
              actief
                ? 'text-el-dark-red border-el-dark-red font-semibold'
                : 'text-el-dark-slate/80 border-transparent hover:text-el-dark-red hover:border-el-dark-red/40'
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
