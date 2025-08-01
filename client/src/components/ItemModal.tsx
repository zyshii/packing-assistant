import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit3, AlertTriangle, Cloud } from "lucide-react";

interface PackingItem {
  id: string;
  name: string;
  quantity: number;
  essential: boolean;
  packed: boolean;
  weatherDependent?: boolean;
  notes?: string;
}

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<PackingItem>) => void;
  item?: PackingItem | null;
  mode: 'add' | 'edit';
}

export default function ItemModal({ isOpen, onClose, onSave, item, mode }: ItemModalProps) {
  const [formData, setFormData] = useState({
    name: item?.name || "",
    quantity: item?.quantity || 1,
    essential: item?.essential || false,
    weatherDependent: item?.weatherDependent || false,
    notes: item?.notes || "",
  });

  const handleSave = () => {
    if (!formData.name.trim()) return;
    
    onSave({
      ...item,
      ...formData,
      id: item?.id || `item_${Date.now()}`,
    });
    
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: "",
      quantity: 1,
      essential: false,
      weatherDependent: false,
      notes: "",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'add' ? <Plus className="h-5 w-5" /> : <Edit3 className="h-5 w-5" />}
            {mode === 'add' ? 'Add New Item' : 'Edit Item'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add' 
              ? 'Add a custom item to your packing list' 
              : 'Update the details of this item'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Item Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              placeholder="e.g., Travel pillow, Sunglasses..."
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="h-12"
            />
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max="50"
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
              className="h-12"
            />
          </div>

          {/* Switches */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <Label htmlFor="essential" className="font-medium">Essential Item</Label>
                </div>
                <p className="text-sm text-muted-foreground">Must-have item for your trip</p>
              </div>
              <Switch
                id="essential"
                checked={formData.essential}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, essential: checked }))}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-travel-blue" />
                  <Label htmlFor="weather" className="font-medium">Weather Dependent</Label>
                </div>
                <p className="text-sm text-muted-foreground">Needed based on weather conditions</p>
              </div>
              <Switch
                id="weather"
                checked={formData.weatherDependent}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, weatherDependent: checked }))}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this item..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="min-h-[80px]"
            />
          </div>

          {/* Preview Badges */}
          {(formData.essential || formData.weatherDependent) && (
            <div className="flex gap-2">
              {formData.essential && (
                <Badge variant="destructive" className="text-xs">
                  Essential
                </Badge>
              )}
              {formData.weatherDependent && (
                <Badge variant="secondary" className="text-xs bg-travel-blue/20 text-travel-blue">
                  Weather
                </Badge>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!formData.name.trim()}
            className="bg-gradient-primary hover:opacity-90"
          >
            {mode === 'add' ? 'Add Item' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}