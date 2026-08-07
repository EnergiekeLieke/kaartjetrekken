import { eq, asc } from 'drizzle-orm';
import { getTenantVoorIngelogdeAdmin } from '@/lib/tenant';
import { getDb } from '@/lib/db';
import { categorieen } from '@/lib/db/schema';
import { maakCategorie, updateCategorie, verwijderCategorie } from '@/lib/admin-actions';
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
        <div className="space-y-3">
          {lijst.map((cat) => (
            <form
              key={cat.id}
              action={updateCategorie}
              className="flex items-center gap-3 bg-white border border-el-light-bg rounded-xl p-3 shadow-sm"
            >
              <input type="hidden" name="id" value={cat.id} />
              <div className="w-28 shrink-0">
                <KleurVeld name="kleur" defaultValue={cat.kleur} />
              </div>
              <input
                type="text"
                name="naam"
                defaultValue={cat.naam}
                className="flex-1 border border-el-light-bg rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-el-dark-green"
              />
              <button type="submit" className="text-sm text-el-dark-green underline underline-offset-2 shrink-0">
                Opslaan
              </button>
              <VerwijderKnop
                formAction={verwijderCategorie}
                bevestiging={`Categorie "${cat.naam}" en al haar kaartjes verwijderen?`}
                className="text-sm text-el-dark-red underline underline-offset-2 shrink-0"
              />
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
          className="flex items-end gap-3 bg-white border border-el-light-bg rounded-xl p-4 shadow-sm"
        >
          <div className="w-28 shrink-0">
            <KleurVeld name="kleur" defaultValue="#1a4a7a" label="Kleur" />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-el-dark-slate/80 mb-1">Naam</label>
            <input
              type="text"
              name="naam"
              required
              placeholder="Bijv. Geld, Tijd, Affirmatie…"
              className="w-full border border-el-light-bg rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-el-dark-green"
            />
          </div>
          <button
            type="submit"
            className="bg-el-dark-red text-el-cream rounded-lg px-4 py-2 text-sm hover:opacity-90 transition-opacity shrink-0"
          >
            Toevoegen
          </button>
        </form>
      </div>
    </div>
  );
}
