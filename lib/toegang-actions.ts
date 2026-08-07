'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getTenantMetInhoud } from './queries';

export async function verifieerToegangscode(slug: string, _prevState: { fout?: string }, formData: FormData) {
  const code = String(formData.get('code') ?? '');
  const tenant = await getTenantMetInhoud(slug);

  if (!tenant) return { fout: 'Klant niet gevonden' };
  if (tenant.toegang !== 'code') return { fout: undefined };
  if (!tenant.toegangscode || code !== tenant.toegangscode) {
    return { fout: 'Onjuiste code, probeer het nog eens' };
  }

  const cookieStore = await cookies();
  cookieStore.set(`toegang-${slug}`, '1', {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });

  redirect(`/${slug}`);
}
