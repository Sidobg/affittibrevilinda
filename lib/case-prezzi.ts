// Le 16 case, allineate al sito linda-affitti-brevi (stesso slug).
// Quando il DB e collegato, questa lista si potra leggere da apartments.
export type CasaPrezzo = { slug: string; nome: string; citta: string };

export const CASE: CasaPrezzo[] = [
  { slug: "vivi-bergamo-stay", nome: "Vivi Bergamo Stay", citta: "Bergamo" },
  { slug: "villa-prato-ovest", nome: "Villa Prato Ovest", citta: "Bratto" },
  { slug: "villa-prato-est", nome: "Villa Prato Est", citta: "Bratto" },
  { slug: "residenza-cadorna", nome: "Residenza Cadorna", citta: "Bratto" },
  { slug: "chalet-presolana", nome: "Chalet Presolana", citta: "Bratto" },
  { slug: "villetta-indipendente-bratto", nome: "Villetta Indipendente", citta: "Bratto" },
  { slug: "castione-home", nome: "Castione Home", citta: "Castione della Presolana" },
  { slug: "casa-la-pietra", nome: "Casa la Pietra", citta: "Bratto" },
  { slug: "comfort-house", nome: "Comfort House", citta: "Clusone" },
  { slug: "casa-la-corte", nome: "Casa La Corte", citta: "Clusone" },
  { slug: "terrazza-su-crosio", nome: "Terrazza su Crosio", citta: "Clusone" },
  { slug: "prestige-piazza-manzu", nome: "Prestige Piazza Manzù", citta: "Clusone" },
  { slug: "casa-delle-concerie", nome: "Casa delle Concerie", citta: "Clusone" },
  { slug: "casa-dei-prati", nome: "Casa dei Prati", citta: "Dorga" },
  { slug: "il-nido-tra-le-montagne", nome: "Il Nido tra le Montagne", citta: "Onore" },
  { slug: "bilocale-brugai", nome: "Bilocale Brugai", citta: "Onore" },
];
