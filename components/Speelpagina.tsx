'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { trekKaarten, type Categorie, type Kaart } from '@/lib/trekken';

// Achtergrondpatroon (optioneel per categorie) wordt automatisch passend uitgesneden
// via background-size: cover, zonder kleurtint erover. Zonder patroon valt terug op
// de meegegeven achtergrondkleur (fallback).
function achtergrondStijl(fallback: string, achtergrondUrl: string | null): CSSProperties {
  if (!achtergrondUrl) return { background: fallback };
  return {
    backgroundImage: `url(${achtergrondUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };
}

type Props = {
  naam: string;
  logoUrl: string | null;
  kleurPrimair: string;
  kleurAchtergrond: string;
  introTekst: string | null;
  ctaTekst: string | null;
  ctaUrl: string | null;
  aantalKaartjesPerTrek: number;
  categorieen: Categorie[];
  kaarten: Kaart[];
  initieleKaarten: Kaart[];
};

export default function Speelpagina({
  naam,
  logoUrl,
  kleurPrimair,
  kleurAchtergrond,
  introTekst,
  ctaTekst,
  ctaUrl,
  aantalKaartjesPerTrek,
  categorieen,
  kaarten,
  initieleKaarten,
}: Props) {
  // De eerste set komt als prop mee vanaf de server, zodat server- en client-render
  // exact dezelfde (willekeurige) kaarten tonen. Zelf trekken met Math.random() tijdens
  // de eerste render zou een hydration-mismatch geven (server en client trekken dan elk apart).
  const [set, setSet] = useState<Kaart[]>(initieleKaarten);
  const [gekozen, setGekozen] = useState<number | null>(null);
  const [overlayZichtbaar, setOverlayZichtbaar] = useState(false);
  const [isGeflipt, setIsGeflipt] = useState(false);
  const categorieMap = new Map(categorieen.map((c) => [c.id, c]));

  // Zodra een kaartje gekozen wordt: overlay laten instappen, en kort daarna omdraaien.
  useEffect(() => {
    if (gekozen === null) return;
    setOverlayZichtbaar(false);
    setIsGeflipt(false);
    const t1 = setTimeout(() => setOverlayZichtbaar(true), 20);
    const t2 = setTimeout(() => setIsGeflipt(true), 420);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [gekozen]);

  function trekOpnieuw() {
    setSet(trekKaarten(categorieen, kaarten, aantalKaartjesPerTrek));
    setGekozen(null);
  }

  if (kaarten.length === 0) {
    return (
      <div className="min-h-screen" style={{ background: kleurAchtergrond }}>
        <div className="max-w-md mx-auto py-20 px-4 text-center">
          <h1 className="text-xl font-semibold mb-2">{naam}</h1>
          <p className="text-sm text-gray-600">Er staan nog geen kaartjes klaar. Kom later terug!</p>
        </div>
      </div>
    );
  }

  const gekozenKaart = gekozen !== null ? set[gekozen] : null;
  const gekozenCategorie = gekozenKaart ? categorieMap.get(gekozenKaart.categorieId) : undefined;
  const gekozenKleur = gekozenCategorie?.kleur ?? '#333333';

  return (
    <div className="min-h-screen" style={{ background: kleurAchtergrond }}>
      <div className="max-w-xl mx-auto py-12 px-4 space-y-8">
        <div className="text-center space-y-2">
          {logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={naam} className="h-16 mx-auto object-contain" />
          )}
          <h1 className="text-2xl font-semibold">{naam}</h1>
          {introTekst && <p className="text-gray-600 text-sm max-w-md mx-auto">{introTekst}</p>}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {set.map((kaart, i) => {
            const cat = categorieMap.get(kaart.categorieId);
            const kleur = cat?.kleur ?? '#333333';
            const isGekozen = gekozen === i;

            return (
              <button
                key={kaart.id}
                onClick={() => gekozen === null && setGekozen(i)}
                disabled={gekozen !== null}
                className={`w-24 sm:w-28 aspect-[3/4] rounded-xl border-2 shadow-sm flex flex-col items-center justify-center gap-1 p-2 transition-opacity duration-300 ${
                  isGekozen ? 'opacity-0' : gekozen !== null ? 'opacity-30' : ''
                }`}
                style={{ borderColor: kleur, ...achtergrondStijl(`${kleur}14`, cat?.achtergrondUrl ?? null) }}
              >
                <span
                  className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-center leading-tight"
                  style={{ color: kleur }}
                >
                  {cat?.naam ?? ''}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button onClick={trekOpnieuw} className="text-sm text-gray-500 underline underline-offset-2">
            Trek een nieuwe kaart
          </button>
        </div>

        {gekozenKaart && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
            overlayZichtbaar ? 'bg-black/60 opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div
            className={`flex flex-col items-center gap-5 transition-all duration-300 ${
              overlayZichtbaar ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
            }`}
          >
            <div className="kk-flip-container w-72 h-96 sm:w-80 sm:h-[26rem]">
              <div className={`kk-flip-inner ${isGeflipt ? 'is-flipped' : ''}`}>
                <div
                  className="kk-flip-face rounded-2xl shadow-xl flex flex-col items-center justify-center gap-2 p-6"
                  style={achtergrondStijl(gekozenKleur, gekozenCategorie?.achtergrondUrl ?? null)}
                >
                  <span className="text-lg font-semibold uppercase tracking-wide text-white/90 text-center">
                    {gekozenCategorie?.naam ?? ''}
                  </span>
                </div>
                <div
                  className="kk-flip-face kk-flip-face-back rounded-2xl shadow-xl flex flex-col items-center justify-center gap-4 p-8"
                  style={{ background: gekozenKleur }}
                >
                  {gekozenKaart.afbeeldingUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={gekozenKaart.afbeeldingUrl} alt="" className="max-h-24 object-contain shrink-0" />
                  )}
                  <span className="text-lg sm:text-xl text-white text-center leading-relaxed">
                    {gekozenKaart.tekst}
                  </span>
                </div>
              </div>
            </div>

            {isGeflipt && ctaTekst && ctaUrl && (
              <a
                href={ctaUrl}
                className="text-white rounded-full px-6 py-3 text-sm font-medium"
                style={{ background: kleurPrimair }}
              >
                {ctaTekst}
              </a>
            )}

            <button onClick={trekOpnieuw} className="text-sm text-white/80 hover:text-white underline underline-offset-2">
              Trek een nieuwe kaart
            </button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
