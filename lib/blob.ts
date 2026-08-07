import { getStore } from '@netlify/blobs';

const MAX_BYTES = 5 * 1024 * 1024;

export function getAfbeeldingenStore() {
  return getStore('afbeeldingen');
}

export async function slaAfbeeldingOp(prefix: string, bestand: File): Promise<string> {
  if (!bestand.type.startsWith('image/')) {
    throw new Error('Alleen afbeeldingen zijn toegestaan');
  }
  if (bestand.size > MAX_BYTES) {
    throw new Error('Afbeelding is te groot (max 5MB)');
  }

  const store = getAfbeeldingenStore();
  const key = `${prefix}/${crypto.randomUUID()}-${bestand.name}`;
  await store.set(key, bestand, { metadata: { contentType: bestand.type } });

  return `/api/afbeeldingen/${key}`;
}
