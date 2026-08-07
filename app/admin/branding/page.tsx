import { getTenantVoorIngelogdeAdmin } from '@/lib/tenant';
import { updateBranding } from '@/lib/admin-actions';

export default async function BrandingPage() {
  const tenant = await getTenantVoorIngelogdeAdmin();
  if (!tenant) return null;

  return (
    <form action={updateBranding} className="space-y-6 max-w-lg">
      <div>
        <label className="block text-sm font-medium mb-1">Logo</label>
        {tenant.logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={tenant.logoUrl} alt="Huidig logo" className="h-12 mb-2 object-contain" />
        )}
        <input type="file" name="logo" accept="image/*" className="text-sm" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Primaire kleur</label>
          <input type="color" name="kleurPrimair" defaultValue={tenant.kleurPrimair} className="h-10 w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Secundaire kleur</label>
          <input type="color" name="kleurSecundair" defaultValue={tenant.kleurSecundair} className="h-10 w-full" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Introtekst (boven de kaartjes)</label>
        <textarea
          name="introTekst"
          defaultValue={tenant.introTekst ?? ''}
          rows={3}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tekst call-to-action knop</label>
          <input
            type="text"
            name="ctaTekst"
            defaultValue={tenant.ctaTekst ?? ''}
            placeholder="Bijv. Boek een sessie"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Link call-to-action knop</label>
          <input
            type="url"
            name="ctaUrl"
            defaultValue={tenant.ctaUrl ?? ''}
            placeholder="https://…"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
      </div>

      <button type="submit" className="bg-gray-900 text-white rounded-lg px-5 py-2 text-sm">
        Opslaan
      </button>
    </form>
  );
}
