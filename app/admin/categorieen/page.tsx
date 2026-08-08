import { eq, asc } from 'drizzle-orm';
import { getTenantVoorIngelogdeAdmin } from '@/lib/tenant';
import { getDb } from '@/lib/db';
import { categorieen } from '@/lib/db/schema';
import { maakCategorie, updateCategorie, verwijderCategorie, verplaatsCategorie } from '@/lib/admin-actions';
import VerwijderKnop from '@/components/VerwijderKnop';
import KleurVeld from '@/components/KleurVeld';

export default async function CategorieenPage() {
  const tenant = await getTenantVoorIngelogdeAdmin();
  if (!tenant) return null;

  const db = getDb();
  const lijst = await db
    .select()
    .from(categorieen)
    .where(eq(categorieen.tenantId, tenant.id))
    .orderBy(asc(categorieen.volgorde));

  return (
    <div className="space-y-10 max-w-lg">
      <div>
        <h2 className="font-salmon text-base text-el-dark-slate mb-3">Bestaande categorieën</h2>
        <div className="space-y-4">
          {lijst.map((cat, index) => (
            <form
              key={cat.id}
              action={updateCategorie}
              className="bg-white border border-el-light-bg rounded-xl p-4 shadow-sm space-y-3"
            >
              <input type="hidden" name="id" value={cat.id} />
              <div className="flex items-center gap-3">
                <div className="flex flex-col shrink-0">
                  <button
                    type="submit"
                    formAction={verplaatsCategorie.bind(null, 'omhoog')}
                    disabled={index === 0}
                    className="text-el-dark-slate/60 hover:text-el-dark-red disabled:opacity-20 disabled:hover:text-el-dark-slate/60 leading-none px-1"
                    aria-label="Naar boven verplaatsen"
                  >
                    ▲
                  </button>
                  <button
                    type="submit"
                    formAction={verplaatsCategorie.bind(null, 'omlaag')}
                    disabled={index === lijst.length - 1}
                    className="text-el-dark-slate/60 hover:text-el-dark-red disabled:opacity-20 disabled:hover:text-el-dark-slate/60 leading-none px-1"
                    aria-label="Naar beneden verplaatsen"
                  >
                    ▼
                  </button>
                </div>
                <div className="w-36 shrink-0">
                  <KleurVeld name="kleur" defaultValue={cat.kleur} />
                </div>
                <input
                  type="text"
                  name="naam"
                  defaultValue={cat.naam}
                  className="min-w-0 flex-1 border border-el-light-bg rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-el-dark-green"
                />
              </div>
              <div>
                <label className="block text-xs text-el-dark-slate/80 mb-1">
                  Achtergrondpatroon op de kaartjes (optioneel)
                </label>
                {cat.achtergrondUrl && (
                  <div className="flex items-center gap-2 mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cat.achtergrondUrl}
                      alt="Huidig achtergrondpatroon"
                      className="h-16 w-24 rounded-lg object-cover shrink-0 border border-el-light-bg"
                    />
                    <span className="text-xs text-el-dark-slate/60">Huidig patroon</span>
                  </div>
                )}
                <input
                  type="file"
                  name="achtergrond"
                  accept="image/*"
                  className="w-full text-xs text-el-dark-slate/80 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-el-dark-slate file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-el-cream hover:file:opacity-90 file:transition-opacity"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button type="submit" className="text-sm text-el-dark-green underline underline-offset-2">
                  Opslaan
                </button>
                <VerwijderKnop
                  formAction={verwijderCategorie}
                  bevestiging={`Categorie "${cat.naam}" en al haar kaartjes verwijderen?`}
                  className="text-sm text-el-dark-red underline underline-offset-2"
                />
              </div>
            </form>
          ))}
          {lijst.length === 0 && (
            <p className="text-sm text-el-dark-slate/80">Nog geen categorieën. Voeg er hieronder een toe.</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="font-salmon text-base text-el-dark-slate mb-3">Nieuwe categorie</h2>
        <form
          action={maakCategorie}
          className="bg-white border border-el-light-bg rounded-xl p-4 shadow-sm space-y-3"
        >
          <div className="flex items-end gap-3">
            <div className="w-36 shrink-0">
              <KleurVeld name="kleur" defaultValue="#1a4a7a" label="Kleur" />
            </div>
            <div className="min-w-0 flex-1">
              <label className="block text-xs text-el-dark-slate/80 mb-1">Naam</label>
              <input
                type="text"
                name="naam"
                required
                placeholder="Bijv. Geld, Tijd, Affirmatie…"
                className="w-full border border-el-light-bg rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-el-dark-green"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-el-dark-slate/80 mb-1">
              Achtergrondpatroon op de kaartjes (optioneel)
            </label>
            <input
              type="file"
              name="achtergrond"
              accept="image/*"
              className="w-full text-xs text-el-dark-slate/80 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-el-dark-slate file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-el-cream hover:file:opacity-90 file:transition-opacity"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-el-dark-red text-el-cream rounded-lg px-4 py-2 text-sm hover:opacity-90 transition-opacity"
            >
              Toevoegen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
