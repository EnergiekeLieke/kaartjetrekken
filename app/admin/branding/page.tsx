import { getTenantVoorIngelogdeAdmin } from '@/lib/tenant';
import { updateBranding } from '@/lib/admin-actions';
import KleurVeld from '@/components/KleurVeld';

export default async function BrandingPage() {
  const tenant = await getTenantVoorIngelogdeAdmin();
  if (!tenant) return null;

  return (
    <form
      action={updateBranding}
      className="space-y-6 max-w-lg bg-white rounded-2xl border border-el-light-bg p-6 shadow-sm"
    >
      <div>
        <label className="block text-sm font-medium text-el-dark-slate mb-1">Logo</label>
        {tenant.logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={tenant.logoUrl} alt="Huidig logo" className="h-12 mb-2 object-contain" />
        )}
        <input
          type="file"
          name="logo"
          accept="image/*"
          className="w-full text-sm text-el-dark-slate/80 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-el-dark-red file:px-4 file:py-2 file:text-sm file:font-medium file:text-el-cream hover:file:opacity-90 file:transition-opacity"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <KleurVeld name="kleurPrimair" defaultValue={tenant.kleurPrimair} label="Primaire kleur" />
        <KleurVeld name="kleurSecundair" defaultValue={tenant.kleurSecundair} label="Secundaire kleur" />
      </div>

      <div>
        <label className="block text-sm font-medium text-el-dark-slate mb-1">Introtekst (boven de kaartjes)</label>
        <textarea
          name="introTekst"
          defaultValue={tenant.introTekst ?? ''}
          rows={3}
          className="w-full border border-el-light-bg rounded-lg px-3 py-2 focus:outline-none focus:border-el-dark-green"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-el-dark-slate mb-1">Tekst call-to-action knop</label>
          <input
            type="text"
            name="ctaTekst"
            defaultValue={tenant.ctaTekst ?? ''}
            placeholder="Bijv. Boek een sessie"
            className="w-full border border-el-light-bg rounded-lg px-3 py-2 focus:outline-none focus:border-el-dark-green"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-el-dark-slate mb-1">Link call-to-action knop</label>
          <input
            type="url"
            name="ctaUrl"
            defaultValue={tenant.ctaUrl ?? ''}
            placeholder="https://…"
            className="w-full border border-el-light-bg rounded-lg px-3 py-2 focus:outline-none focus:border-el-dark-green"
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-el-dark-red text-el-cream rounded-lg px-5 py-2 text-sm hover:opacity-90 transition-opacity"
      >
        Opslaan
      </button>
    </form>
  );
}
