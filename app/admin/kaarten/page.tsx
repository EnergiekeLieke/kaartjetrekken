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
      <p className="text-sm text-el-dark-slate/80">
        Maak eerst een categorie aan bij{' '}
        <a href="/admin/categorieen" className="text-el-dark-red underline underline-offset-2">
          Categorieën
        </a>{' '}
        voordat je kaartjes kunt toevoegen.
      </p>
    );
  }

  return (
    <div className="space-y-6 max-w-lg">
      {cats.map((cat) => {
        const catKaarten = kaartenLijst.filter((k) => k.categorieId === cat.id);
        return (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-el-light-bg shadow-sm p-5"
            style={{ borderLeftWidth: 4, borderLeftColor: cat.kleur }}
          >
            <h2 className="font-salmon text-base text-el-dark-slate mb-4 flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full shrink-0" style={{ background: cat.kleur }} />
              {cat.naam}
            </h2>

            <ul className="space-y-2 mb-4">
              {catKaarten.map((kaart) => (
                <li
                  key={kaart.id}
                  className="flex items-center gap-3 bg-el-cream/60 border border-el-light-bg rounded-lg p-3 text-sm"
                >
                  {kaart.afbeeldingUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={kaart.afbeeldingUrl} alt="" className="h-8 w-8 object-cover rounded shrink-0" />
                  )}
                  <span className="flex-1 text-el-dark-slate">{kaart.tekst}</span>
                  <form>
                    <input type="hidden" name="id" value={kaart.id} />
                    <VerwijderKnop
                      formAction={verwijderKaart}
                      bevestiging="Dit kaartje verwijderen?"
                      className="text-el-dark-red underline underline-offset-2 text-xs shrink-0"
                    />
                  </form>
                </li>
              ))}
              {catKaarten.length === 0 && (
                <p className="text-xs text-el-dark-slate/70">Nog geen kaartjes in deze categorie.</p>
              )}
            </ul>

            <form action={maakKaart} className="flex items-start gap-3">
              <input type="hidden" name="categorieId" value={cat.id} />
              <textarea
                name="tekst"
                required
                rows={2}
                placeholder="Tekst van het kaartje…"
                className="flex-1 border border-el-light-bg rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-el-dark-green"
              />
              <input type="file" name="afbeelding" accept="image/*" className="text-xs w-32 shrink-0" />
              <button
                type="submit"
                className="bg-el-dark-red text-el-cream rounded-lg px-4 py-2 text-sm hover:opacity-90 transition-opacity shrink-0"
              >
                Toevoegen
              </button>
            </form>
          </div>
        );
      })}
    </div>
  );
}
