import { getTenantVoorIngelogdeAdmin } from '@/lib/tenant';
import { updateInstellingen } from '@/lib/admin-actions';

export default async function InstellingenPage() {
  const tenant = await getTenantVoorIngelogdeAdmin();
  if (!tenant) return null;

  return (
    <form action={updateInstellingen} className="space-y-6 max-w-sm">
      <div>
        <label className="block text-sm font-medium mb-1">Aantal kaartjes per trekking</label>
        <input
          type="number"
          name="aantalKaartjesPerTrek"
          min={1}
          max={20}
          defaultValue={tenant.aantalKaartjesPerTrek}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <fieldset>
        <legend className="block text-sm font-medium mb-2">Toegang tot de trekpagina</legend>
        <label className="flex items-center gap-2 mb-2 text-sm">
          <input type="radio" name="toegang" value="open" defaultChecked={tenant.toegang === 'open'} />
          Open link, geen code nodig
        </label>
        <label className="flex items-center gap-2 mb-3 text-sm">
          <input type="radio" name="toegang" value="code" defaultChecked={tenant.toegang === 'code'} />
          Alleen met toegangscode
        </label>
        <input
          type="text"
          name="toegangscode"
          defaultValue={tenant.toegangscode ?? ''}
          placeholder="Toegangscode"
          className="w-full border rounded-lg px-3 py-2"
        />
      </fieldset>

      <button type="submit" className="bg-gray-900 text-white rounded-lg px-5 py-2 text-sm">
        Opslaan
      </button>
    </form>
  );
}
