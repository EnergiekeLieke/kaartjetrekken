import { eq, asc } from 'drizzle-orm';
import { getTenantVoorIngelogdeAdmin } from '@/lib/tenant';
import { getDb } from '@/lib/db';
import { categorieen, kaarten } from '@/lib/db/schema';
import { maakKaart, verwijderKaart } from '@/lib/admin-actions';
import VerwijderKnop from '@/components/VerwijderKnop';

export default async function KaartenPage() {
  const tenant = await getTenantVoorIngelogdeAdmin();
  if (!tenant) return null;

  const db = getDb();
  const [cats, kaartenLijst] = await Promise.all([
    db.select().from(categorieen).where(eq(categorieen.tenantId, tenant.id)).orderBy(asc(categorieen.volgorde)),
    db.select().from(kaarten).where(eq(kaarten.tenantId, tenant.id)).orderBy(asc(kaarten.volgorde)),
  ]);

  if (cats.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Maak eerst een categorie aan bij{' '}
        <a href="/admin/categorieen" className="underline">
          Categorieën
        </a>{' '}
        voordat je kaartjes kunt toevoegen.
      </p>
    );
  }

  return (
    <div className="space-y-10 max-w-lg">
      {cats.map((cat) => {
        const catKaarten = kaartenLijst.filter((k) => k.categorieId === cat.id);
        return (
          <div key={cat.id}>
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full" style={{ background: cat.kleur }} />
              {cat.naam}
            </h2>
            <ul className="space-y-2 mb-4">
              {catKaarten.map((kaart) => (
                <li key={kaart.id} className="flex items-center gap-3 border rounded-lg p-3 text-sm">
                  {kaart.afbeeldingUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={kaart.afbeeldingUrl} alt="" className="h-8 w-8 object-cover rounded shrink-0" />
                  )}
                  <span className="flex-1">{kaart.tekst}</span>
                  <form>
                    <input type="hidden" name="id" value={kaart.id} />
                    <VerwijderKnop
                      formAction={verwijderKaart}
                      bevestiging="Dit kaartje verwijderen?"
                      className="text-red-600 underline text-xs shrink-0"
                    />
                  </form>
                </li>
              ))}
              {catKaarten.length === 0 && <p className="text-xs text-gray-400">Nog geen kaartjes in deze categorie.</p>}
            </ul>
            <form action={maakKaart} className="flex items-start gap-3">
              <input type="hidden" name="categorieId" value={cat.id} />
              <textarea
                name="tekst"
                required
                rows={2}
                placeholder="Tekst van het kaartje…"
                className="flex-1 border rounded-lg px-3 py-1.5 text-sm"
              />
              <input type="file" name="afbeelding" accept="image/*" className="text-xs w-32 shrink-0" />
              <button type="submit" className="bg-gray-900 text-white rounded-lg px-4 py-2 text-sm shrink-0">
                Toevoegen
              </button>
            </form>
          </div>
        );
      })}
    </div>
  );
}
