import React, { useState } from 'react';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge'; // Use Badge for displaying items

interface StringListInputProps {
  field: ControllerRenderProps<FieldValues, string>; // Expects field for string[]
  label: string;
  placeholder?: string;
  className?: string;
}

const StringListInput: React.FC<StringListInputProps> = ({
  field,
  label,
  placeholder = "Neuen Eintrag hinzufügen...",
  className,
}) => {
  const [newItem, setNewItem] = useState('');
  const currentList: string[] = Array.isArray(field.value) ? field.value : [];

  const handleAddItem = () => {
    if (newItem.trim() && !currentList.includes(newItem.trim())) {
      field.onChange([...currentList, newItem.trim()]);
      setNewItem(''); // Clear input after adding
    }
  };

  const handleRemoveItem = (itemToRemove: string) => {
    field.onChange(currentList.filter(item => item !== itemToRemove));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewItem(event.target.value);
  };

   const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission on Enter
      handleAddItem();
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</label>
      <div className="flex gap-2 mb-2">
        <Input
          type="text"
          placeholder={placeholder}
          value={newItem}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-grow"
        />
        <Button type="button" onClick={handleAddItem} size="icon" variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {currentList.map((item, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            {item}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 ml-1 text-muted-foreground hover:text-destructive"
              onClick={() => handleRemoveItem(item)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
         {currentList.length === 0 && <p className="text-sm text-muted-foreground">Keine Einträge vorhanden.</p>}
      </div>
    </div>
  );
};

export default StringListInput;
