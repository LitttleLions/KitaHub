
import React from 'react';
import { Filter, Award } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface KitaSidebarProps {
  bundesland: string;
  handleBundeslandChange: (value: string) => void;
  showPremiumOnly: boolean;
  togglePremiumFilter: () => void;
}

const BUNDESLAENDER = [
  "all", // Changed from "Alle Bundesländer" to a valid value "all"
  "Baden-Württemberg",
  "Bayern",
  "Berlin",
  "Brandenburg",
  "Bremen",
  "Hamburg",
  "Hessen",
  "Mecklenburg-Vorpommern",
  "Niedersachsen",
  "Nordrhein-Westfalen",
  "Rheinland-Pfalz",
  "Saarland",
  "Sachsen",
  "Sachsen-Anhalt",
  "Schleswig-Holstein",
  "Thüringen"
];

const BUNDESLAENDER_LABELS = {
  "all": "Alle Bundesländer",
  "Baden-Württemberg": "Baden-Württemberg",
  "Bayern": "Bayern",
  "Berlin": "Berlin",
  "Brandenburg": "Brandenburg",
  "Bremen": "Bremen",
  "Hamburg": "Hamburg",
  "Hessen": "Hessen",
  "Mecklenburg-Vorpommern": "Mecklenburg-Vorpommern",
  "Niedersachsen": "Niedersachsen",
  "Nordrhein-Westfalen": "Nordrhein-Westfalen",
  "Rheinland-Pfalz": "Rheinland-Pfalz",
  "Saarland": "Saarland",
  "Sachsen": "Sachsen",
  "Sachsen-Anhalt": "Sachsen-Anhalt",
  "Schleswig-Holstein": "Schleswig-Holstein",
  "Thüringen": "Thüringen"
};

const KitaSidebar: React.FC<KitaSidebarProps> = ({
  bundesland,
  handleBundeslandChange,
  showPremiumOnly,
  togglePremiumFilter
}) => {
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
            {BUNDESLAENDER.map((state) => (
              <SelectItem key={state} value={state}>
                {BUNDESLAENDER_LABELS[state]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
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
