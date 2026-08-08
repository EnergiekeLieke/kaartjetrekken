import { eq, asc } from 'drizzle-orm';
import { getTenantVoorIngelogdeAdmin } from '@/lib/tenant';
import { getDb } from '@/lib/db';
import { categorieen, kaarten } from '@/lib/db/schema';
import { maakKaart, verwijderKaart, verplaatsKaart } from '@/lib/admin-actions';
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
              {catKaarten.map((kaart, index) => (
                <li
                  key={kaart.id}
                  className="flex items-center gap-3 bg-el-cream/60 border border-el-light-bg rounded-lg p-3 text-sm"
                >
                  {kaart.afbeeldingUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={kaart.afbeeldingUrl} alt="" className="h-8 w-8 object-cover rounded shrink-0" />
                  )}
                  <span className="flex-1 text-el-dark-slate">{kaart.tekst}</span>
                  <form className="flex items-center gap-2 shrink-0">
                    <input type="hidden" name="id" value={kaart.id} />
                    <input type="hidden" name="categorieId" value={cat.id} />
                    <div className="flex flex-col">
                      <button
                        type="submit"
                        formAction={verplaatsKaart.bind(null, 'omhoog')}
                        disabled={index === 0}
                        className="text-el-dark-slate/60 hover:text-el-dark-red disabled:opacity-20 disabled:hover:text-el-dark-slate/60 leading-none text-xs px-1"
                        aria-label="Naar boven verplaatsen"
                      >
                        ▲
                      </button>
                      <button
                        type="submit"
                        formAction={verplaatsKaart.bind(null, 'omlaag')}
                        disabled={index === catKaarten.length - 1}
                        className="text-el-dark-slate/60 hover:text-el-dark-red disabled:opacity-20 disabled:hover:text-el-dark-slate/60 leading-none text-xs px-1"
                        aria-label="Naar beneden verplaatsen"
                      >
                        ▼
                      </button>
                    </div>
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

            <form action={maakKaart} className="space-y-3">
              <input type="hidden" name="categorieId" value={cat.id} />
              <textarea
                name="tekst"
                required
                rows={2}
                placeholder="Tekst van het kaartje…"
                className="w-full border border-el-light-bg rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-el-dark-green"
              />
              <div className="flex items-center justify-between gap-3">
                <input
                  type="file"
                  name="afbeelding"
                  accept="image/*"
                  className="min-w-0 flex-1 text-xs text-el-dark-slate/80 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-el-dark-slate file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-el-cream hover:file:opacity-90 file:transition-opacity"
                />
                <button
                  type="submit"
                  className="bg-el-dark-red text-el-cream rounded-lg px-4 py-2 text-sm hover:opacity-90 transition-opacity shrink-0"
                >
                  Toevoegen
                </button>
              </div>
            </form>
          </div>
        );
      })}
    </div>
  );
}
