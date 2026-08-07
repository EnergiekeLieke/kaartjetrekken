export type Categorie = { id: number; naam: string; kleur: string };
export type Kaart = { id: number; categorieId: number; tekst: string; afbeeldingUrl: string | null };

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function trekKaarten(categorieen: Categorie[], kaarten: Kaart[], aantal: number): Kaart[] {
  const verplicht: Kaart[] = [];
  for (const cat of categorieen) {
    const opties = kaarten.filter((k) => k.categorieId === cat.id);
    if (opties.length > 0) {
      verplicht.push(opties[Math.floor(Math.random() * opties.length)]);
    }
  }

  const rest = kaarten.filter((k) => !verplicht.some((v) => v.id === k.id));
  const aanvulling = shuffle(rest).slice(0, Math.max(0, aantal - verplicht.length));

  return shuffle([...verplicht, ...aanvulling]);
}
