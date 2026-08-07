import { getTenantVoorIngelogdeAdmin } from '@/lib/tenant';
import { updateInstellingen } from '@/lib/admin-actions';

export default async function InstellingenPage() {
  const tenant = await getTenantVoorIngelogdeAdmin();
  if (!tenant) return null;

  return (
    <form
      action={updateInstellingen}
      className="space-y-6 max-w-sm bg-white rounded-2xl border border-el-light-bg p-6 shadow-sm"
    >
      <div>
        <label className="block text-sm font-medium text-el-dark-slate mb-1">Aantal kaartjes per trekking</label>
        <input
          type="number"
          name="aantalKaartjesPerTrek"
          min={1}
          max={20}
          defaultValue={tenant.aantalKaartjesPerTrek}
          className="w-full border border-el-light-bg rounded-lg px-3 py-2 focus:outline-none focus:border-el-dark-green"
        />
      </div>

      <fieldset>
        <legend className="block text-sm font-medium text-el-dark-slate mb-2">Toegang tot de trekpagina</legend>
        <label className="flex items-center gap-2 mb-2 text-sm text-el-dark-slate">
          <input type="radio" name="toegang" value="open" defaultChecked={tenant.toegang === 'open'} />
          Open link, geen code nodig
        </label>
        <label className="flex items-center gap-2 mb-3 text-sm text-el-dark-slate">
          <input type="radio" name="toegang" value="code" defaultChecked={tenant.toegang === 'code'} />
          Alleen met toegangscode
        </label>
        <input
          type="text"
          name="toegangscode"
          defaultValue={tenant.toegangscode ?? ''}
          placeholder="Toegangscode"
          className="w-full border border-el-light-bg rounded-lg px-3 py-2 focus:outline-none focus:border-el-dark-green"
        />
      </fieldset>

      <button
        type="submit"
        className="bg-el-dark-red text-el-cream rounded-lg px-5 py-2 text-sm hover:opacity-90 transition-opacity"
      >
        Opslaan
      </button>
    </form>
  );
}
