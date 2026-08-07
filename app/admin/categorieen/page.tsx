import { eq, asc } from 'drizzle-orm';
import { getTenantVoorIngelogdeAdmin } from '@/lib/tenant';
import { getDb } from '@/lib/db';
import { categorieen } from '@/lib/db/schema';
import { maakCategorie, updateCategorie, verwijderCategorie } from '@/lib/admin-actions';
import VerwijderKnop from '@/components/VerwijderKnop';

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
    <div className="space-y-8 max-w-lg">
      <div className="space-y-3">
        {lijst.map((cat) => (
          <form key={cat.id} action={updateCategorie} className="flex items-center gap-3 border rounded-lg p-3">
            <input type="hidden" name="id" value={cat.id} />
            <input type="color" name="kleur" defaultValue={cat.kleur} className="h-9 w-12 shrink-0" />
            <input type="text" name="naam" defaultValue={cat.naam} className="flex-1 border rounded-lg px-3 py-1.5 text-sm" />
            <button type="submit" className="text-sm text-gray-600 underline shrink-0">
              Opslaan
            </button>
            <VerwijderKnop
              formAction={verwijderCategorie}
              bevestiging={`Categorie "${cat.naam}" en al haar kaartjes verwijderen?`}
              className="text-sm text-red-600 underline shrink-0"
            />
          </form>
        ))}
        {lijst.length === 0 && <p className="text-sm text-gray-500">Nog geen categorieën. Voeg er hieronder een toe.</p>}
      </div>

      <form action={maakCategorie} className="flex items-end gap-3 border-t pt-6">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Kleur</label>
          <input type="color" name="kleur" defaultValue="#1a4a7a" className="h-9 w-12" />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">Naam</label>
          <input
            type="text"
            name="naam"
            required
            placeholder="Bijv. Geld, Tijd, Affirmatie…"
            className="w-full border rounded-lg px-3 py-1.5 text-sm"
          />
        </div>
        <button type="submit" className="bg-gray-900 text-white rounded-lg px-4 py-2 text-sm shrink-0">
          Toevoegen
        </button>
      </form>
    </div>
  );
}
