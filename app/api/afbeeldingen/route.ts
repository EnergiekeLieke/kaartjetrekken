import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getTenantVoorIngelogdeAdmin } from '@/lib/tenant';
import { getAfbeeldingenStore } from '@/lib/blob';

const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  await auth.protect();

  const tenant = await getTenantVoorIngelogdeAdmin();
  if (!tenant) {
    return NextResponse.json({ fout: 'Geen klant gekoppeld aan dit account' }, { status: 403 });
  }

  const form = await req.formData();
  const bestand = form.get('bestand');

  if (!(bestand instanceof File)) {
    return NextResponse.json({ fout: 'Geen bestand ontvangen' }, { status: 400 });
  }
  if (!bestand.type.startsWith('image/')) {
    return NextResponse.json({ fout: 'Alleen afbeeldingen zijn toegestaan' }, { status: 400 });
  }
  if (bestand.size > MAX_BYTES) {
    return NextResponse.json({ fout: 'Afbeelding is te groot (max 5MB)' }, { status: 400 });
  }

  const store = getAfbeeldingenStore();
  const key = `${tenant.slug}/${crypto.randomUUID()}-${bestand.name}`;
  await store.set(key, bestand, { metadata: { contentType: bestand.type } });

  return NextResponse.json({ url: `/api/afbeeldingen/${key}` });
}
