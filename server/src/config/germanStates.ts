// Base URL for kita.de Bundesland pages
const KITA_DE_BASE_URL = 'https://www.kita.de';

export const GERMAN_STATES = [
  { value: "baden-wuerttemberg", label: "Baden-Württemberg", dbValue: "Baden-Württemberg", url: `${KITA_DE_BASE_URL}/kitas/baden-wuerttemberg/` },
  { value: "bayern", label: "Bayern", dbValue: "Bayern", url: `${KITA_DE_BASE_URL}/kitas/bayern/` },
  { value: "berlin", label: "Berlin", dbValue: "Berlin", url: `${KITA_DE_BASE_URL}/kitas/berlin/` },
  { value: "brandenburg", label: "Brandenburg", dbValue: "Brandenburg", url: `${KITA_DE_BASE_URL}/kitas/brandenburg/` },
  { value: "bremen", label: "Bremen", dbValue: "Bremen", url: `${KITA_DE_BASE_URL}/kitas/bremen/` },
  { value: "hamburg", label: "Hamburg", dbValue: "Hamburg", url: `${KITA_DE_BASE_URL}/kitas/hamburg/` },
  { value: "hessen", label: "Hessen", dbValue: "Hessen", url: `${KITA_DE_BASE_URL}/kitas/hessen/` },
  { value: "mecklenburg-vorpommern", label: "Mecklenburg-Vorpommern", dbValue: "Mecklenburg-Vorpommern", url: `${KITA_DE_BASE_URL}/kitas/mecklenburg-vorpommern/` },
  { value: "niedersachsen", label: "Niedersachsen", dbValue: "Niedersachsen", url: `${KITA_DE_BASE_URL}/kitas/niedersachsen/` },
  { value: "nordrhein-westfalen", label: "Nordrhein-Westfalen", dbValue: "Nordrhein-Westfalen", url: `${KITA_DE_BASE_URL}/kitas/nordrhein-westfalen/` },
  { value: "rheinland-pfalz", label: "Rheinland-Pfalz", dbValue: "Rheinland-Pfalz", url: `${KITA_DE_BASE_URL}/kitas/rheinland-pfalz/` },
  { value: "saarland", label: "Saarland", dbValue: "Saarland", url: `${KITA_DE_BASE_URL}/kitas/saarland/` },
  { value: "sachsen", label: "Sachsen", dbValue: "Sachsen", url: `${KITA_DE_BASE_URL}/kitas/sachsen/` },
  { value: "sachsen-anhalt", label: "Sachsen-Anhalt", dbValue: "Sachsen-Anhalt", url: `${KITA_DE_BASE_URL}/kitas/sachsen-anhalt/` },
  { value: "schleswig-holstein", label: "Schleswig-Holstein", dbValue: "Schleswig-Holstein", url: `${KITA_DE_BASE_URL}/kitas/schleswig-holstein/` },
  { value: "thueringen", label: "Thüringen", dbValue: "Thüringen", url: `${KITA_DE_BASE_URL}/kitas/thueringen/` },
];

export function mapToBundeslandDbValue(input: string): string | undefined {
  if (!input) return undefined;
  // Normalize input for comparison
  const normalized = input.trim().toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
  // Try to match by dbValue, label, or value
  const found = GERMAN_STATES.find(state => {
    return (
      state.dbValue.toLowerCase() === normalized ||
      state.label.toLowerCase() === normalized ||
      state.value === normalized
    );
  });
  return found ? found.dbValue : undefined;
}
