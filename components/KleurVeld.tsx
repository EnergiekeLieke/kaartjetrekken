'use client';

import { useState } from 'react';

const HEX_PATRONEN = /^#[0-9a-fA-F]{6}$/;

export default function KleurVeld({
  name,
  defaultValue,
  label,
}: {
  name: string;
  defaultValue: string;
  label?: string;
}) {
  const [waarde, setWaarde] = useState(defaultValue);
  const geldigeKleur = HEX_PATRONEN.test(waarde) ? waarde : '#000000';

  return (
    <div className="min-w-0">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <div className="flex items-center gap-2 min-w-0">
        <input
          type="text"
          name={name}
          value={waarde}
          onChange={(e) => setWaarde(e.target.value)}
          maxLength={7}
          pattern="^#[0-9A-Fa-f]{6}$"
          title="Een hexcode van 6 tekens, bijvoorbeeld #1A4A7A"
          className="min-w-0 flex-1 border rounded-lg px-3 py-2 font-mono text-sm uppercase"
        />
        <input
          type="color"
          value={geldigeKleur}
          onChange={(e) => setWaarde(e.target.value)}
          aria-label={label ? `${label} (kleurkiezer)` : 'Kleurkiezer'}
          className="h-10 w-12 shrink-0 border rounded"
        />
      </div>
    </div>
  );
}
