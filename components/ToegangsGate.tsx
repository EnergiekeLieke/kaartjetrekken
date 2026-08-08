'use client';

import { useActionState } from 'react';
import { verifieerToegangscode } from '@/lib/toegang-actions';

export default function ToegangsGate({
  slug,
  tenantNaam,
  logoUrl,
  kleurAchtergrond,
}: {
  slug: string;
  tenantNaam: string;
  logoUrl: string | null;
  kleurAchtergrond: string;
}) {
  const actie = verifieerToegangscode.bind(null, slug);
  const [state, formAction, pending] = useActionState(actie, { fout: undefined as string | undefined });

  return (
    <div className="min-h-screen" style={{ background: kleurAchtergrond }}>
      <div className="max-w-sm mx-auto py-20 px-4 text-center">
        {logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt={tenantNaam} className="h-16 mx-auto mb-4 object-contain" />
        )}
        <p className="text-sm text-gray-600 mb-6">Vul de toegangscode in om een kaartje te trekken.</p>
        <form action={formAction} className="space-y-3">
          <input
            type="text"
            name="code"
            placeholder="Toegangscode"
            className="w-full border rounded-lg px-3 py-2 text-center"
            autoFocus
          />
          {state.fout && <p className="text-sm text-red-600">{state.fout}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full bg-gray-900 text-white rounded-lg py-2 disabled:opacity-50"
          >
            {pending ? 'Bezig…' : 'Ontgrendel'}
          </button>
        </form>
      </div>
    </div>
  );
}
