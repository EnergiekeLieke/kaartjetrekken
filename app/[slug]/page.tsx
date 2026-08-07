import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { getTenantMetInhoud } from '@/lib/queries';
import { trekKaarten } from '@/lib/trekken';
import ToegangsGate from '@/components/ToegangsGate';
import Speelpagina from '@/components/Speelpagina';

export default async function KlantPagina({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tenant = await getTenantMetInhoud(slug);
  if (!tenant) notFound();

  const cookieStore = await cookies();
  const heeftToegang = tenant.toegang === 'open' || cookieStore.get(`toegang-${slug}`)?.value === '1';

  if (!heeftToegang) {
    return (
      <ToegangsGate
        slug={slug}
        tenantNaam={tenant.naam}
        logoUrl={tenant.logoUrl}
        kleurAchtergrond={tenant.kleurAchtergrond}
      />
    );
  }

  const initieleKaarten = trekKaarten(tenant.categorieen, tenant.kaarten, tenant.aantalKaartjesPerTrek);

  return (
    <Speelpagina
      naam={tenant.naam}
      logoUrl={tenant.logoUrl}
      kleurPrimair={tenant.kleurPrimair}
      kleurAchtergrond={tenant.kleurAchtergrond}
      introTekst={tenant.introTekst}
      ctaTekst={tenant.ctaTekst}
      ctaUrl={tenant.ctaUrl}
      aantalKaartjesPerTrek={tenant.aantalKaartjesPerTrek}
      categorieen={tenant.categorieen}
      kaarten={tenant.kaarten}
      initieleKaarten={initieleKaarten}
    />
  );
}
