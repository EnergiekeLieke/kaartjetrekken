'use client';

import { useState } from 'react';
import { trekKaarten, type Categorie, type Kaart } from '@/lib/trekken';

type Props = {
  naam: string;
  logoUrl: string | null;
  kleurPrimair: string;
  introTekst: string | null;
  ctaTekst: string | null;
  ctaUrl: string | null;
  aantalKaartjesPerTrek: number;
  categorieen: Categorie[];
  kaarten: Kaart[];
};

export default function Speelpagina({
  naam,
  logoUrl,
  kleurPrimair,
  introTekst,
  ctaTekst,
  ctaUrl,
  aantalKaartjesPerTrek,
  categorieen,
  kaarten,
}: Props) {
  const [set, setSet] = useState<Kaart[]>(() => trekKaarten(categorieen, kaarten, aantalKaartjesPerTrek));
  const [omgedraaid, setOmgedraaid] = useState<number | null>(null);
  const categorieMap = new Map(categorieen.map((c) => [c.id, c]));

  function trekOpnieuw() {
    setSet(trekKaarten(categorieen, kaarten, aantalKaartjesPerTrek));
    setOmgedraaid(null);
  }

  if (kaarten.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h1 className="text-xl font-semibold mb-2">{naam}</h1>
        <p className="text-sm text-gray-600">Er staan nog geen kaartjes klaar. Kom later terug!</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-8">
      <div className="text-center space-y-2">
        {logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt={naam} className="h-16 mx-auto object-contain" />
        )}
        <h1 className="text-2xl font-semibold">{naam}</h1>
        {introTekst && <p className="text-gray-600 text-sm max-w-md mx-auto">{introTekst}</p>}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {set.map((kaart, i) => {
          const cat = categorieMap.get(kaart.categorieId);
          const kleur = cat?.kleur ?? '#333333';
          const isGeflipt = omgedraaid === i;
          const disabled = omgedraaid !== null && !isGeflipt;

          return (
            <button
              key={kaart.id}
              onClick={() => omgedraaid === null && setOmgedraaid(i)}
              disabled={disabled}
              className={`kk-flip-container block w-full aspect-[3/4] ${disabled ? 'opacity-40' : ''}`}
            >
              <div className={`kk-flip-inner ${isGeflipt ? 'is-flipped' : ''}`}>
                <div
                  className="kk-flip-face rounded-xl border-2 flex flex-col items-center justify-center gap-2 p-2"
                  style={{ borderColor: kleur, background: `${kleur}1A` }}
                >
                  <span
                    className="text-xs font-semibold uppercase tracking-wide text-center"
                    style={{ color: kleur }}
                  >
                    {cat?.naam ?? ''}
                  </span>
                </div>
                <div
                  className="kk-flip-face kk-flip-face-back rounded-xl border-2 flex flex-col items-center justify-center gap-2 p-3 overflow-hidden"
                  style={{ borderColor: kleur, background: kleur }}
                >
                  {kaart.afbeeldingUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={kaart.afbeeldingUrl} alt="" className="max-h-16 object-contain" />
                  )}
                  <span className="text-xs text-white text-center leading-snug">{kaart.tekst}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-3">
        {omgedraaid !== null && ctaTekst && ctaUrl && (
          <a
            href={ctaUrl}
            className="text-white rounded-full px-6 py-3 text-sm font-medium"
            style={{ background: kleurPrimair }}
          >
            {ctaTekst}
          </a>
        )}
        <button onClick={trekOpnieuw} className="text-sm text-gray-500 underline underline-offset-2">
          Trek opnieuw
        </button>
      </div>
    </div>
  );
}
