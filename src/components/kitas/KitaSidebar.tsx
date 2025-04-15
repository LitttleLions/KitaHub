
import React, { useState, useEffect } from 'react'; // Korrigierter Import
import { Filter, Award, MapPinned } from 'lucide-react'; // MapPinned importieren
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { GERMAN_STATES } from '@/lib/constants'; // Importiere die zentrale Konstante
import { fetchBezirkeByBundesland } from '@/services/metaService'; // Importiere die neue Service-Funktion

interface KitaSidebarProps {
  bundesland: string;
  handleBundeslandChange: (value: string) => void;
  selectedBezirk: string; // Bezirk State Prop
  handleBezirkChange: (value: string) => void; // Bezirk Handler Prop
  showPremiumOnly: boolean;
  togglePremiumFilter: () => void;
}

const KitaSidebar: React.FC<KitaSidebarProps> = ({
  bundesland,
  handleBundeslandChange,
  selectedBezirk,
  handleBezirkChange,
  showPremiumOnly,
  togglePremiumFilter
}) => {
  const [bezirke, setBezirke] = useState<string[]>([]); // State für Bezirksliste
  const [loadingBezirke, setLoadingBezirke] = useState(false);

  // Effekt zum Laden der Bezirke, wenn sich das Bundesland ändert
  useEffect(() => {
    if (bundesland && bundesland !== 'all') {
      setLoadingBezirke(true);
      fetchBezirkeByBundesland(bundesland)
        .then(data => {
          setBezirke(data || []);
          // Reset Bezirk selection if the new list doesn't include the current selection
          if (data && !data.includes(selectedBezirk)) {
             handleBezirkChange('all'); // Reset to 'all'
          }
        })
        .catch(error => {
          console.error("Fehler beim Laden der Bezirke:", error);
          setBezirke([]);
        })
        .finally(() => setLoadingBezirke(false));
    } else {
      setBezirke([]); // Clear bezirke if no state or 'all' is selected
      handleBezirkChange('all'); // Reset Bezirk selection
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bundesland]); // Dependency: bundesland

  return (
    <div className="bg-white rounded-lg border p-4 sticky top-24">
      <h3 className="font-semibold text-lg mb-4 flex items-center">
        <Filter className="w-5 h-5 mr-2" /> Filter
      </h3>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bundesland
        </label>
        <Select value={bundesland} onValueChange={handleBundeslandChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Bundesland auswählen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Bundesländer</SelectItem>
            {GERMAN_STATES.map((state) => (
              <SelectItem key={state.value} value={state.value}>
                {state.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bezirk Filter (conditionally rendered) */}
      {bundesland && bundesland !== 'all' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bezirk / Landkreis
          </label>
          <Select value={selectedBezirk} onValueChange={handleBezirkChange} disabled={loadingBezirke || bezirke.length === 0}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={loadingBezirke ? "Lade Bezirke..." : "Bezirk auswählen"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Bezirke</SelectItem>
              {bezirke.map((bezirk) => (
                <SelectItem key={bezirk} value={bezirk}>
                  {bezirk}
                </SelectItem>
              ))}
              {bezirke.length === 0 && !loadingBezirke && (
                 <SelectItem value="none" disabled>Keine Bezirke gefunden</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="mb-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between space-x-2">
          <div className="flex flex-col space-y-1">
            <Label htmlFor="premium-filter" className="font-medium flex items-center">
              <Award className="h-4 w-4 mr-2 text-amber-500" />
              Nur Premium-Kitas
            </Label>
            <p className="text-xs text-gray-500">
              Zeige nur Kitas mit erweitertem Profil
            </p>
          </div>
          <Switch
            id="premium-filter"
            checked={showPremiumOnly}
            onCheckedChange={togglePremiumFilter}
          />
        </div>
      </div>
    </div>
  );
};

export default KitaSidebar;
