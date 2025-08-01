import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";

interface PackingItem {
  id: string;
  name: string;
  quantity: number;
  essential: boolean;
  packed: boolean;
  weatherDependent?: boolean;
}

interface PackingCategoryProps {
  title: string;
  icon: React.ReactNode;
  items: PackingItem[];
  onItemToggle: (itemId: string) => void;
  colorClass: string;
}

export default function PackingCategory({ 
  title, 
  icon, 
  items, 
  onItemToggle, 
  colorClass 
}: PackingCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const packedCount = items.filter(item => item.packed).length;
  const totalCount = items.length;
  
  return (
    <Card className="shadow-card border-0 bg-card overflow-hidden">
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${colorClass} rounded-lg`}>
              {icon}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">
                {packedCount} of {totalCount} items packed
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${packedCount === totalCount ? 'bg-travel-green' : 'bg-muted'}`} />
              <span className="text-sm font-medium text-foreground">
                {packedCount}/{totalCount}
              </span>
            </div>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {items.map((item) => (
            <div 
              key={item.id}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Checkbox 
                  checked={item.packed}
                  onCheckedChange={() => onItemToggle(item.id)}
                  className="data-[state=checked]:bg-travel-green data-[state=checked]:border-travel-green"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${item.packed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                      {item.name}
                    </span>
                    {item.essential && (
                      <Badge variant="secondary" className="text-xs bg-travel-orange/20 text-travel-orange">
                        Essential
                      </Badge>
                    )}
                    {item.weatherDependent && (
                      <Badge variant="secondary" className="text-xs bg-travel-blue/20 text-travel-blue">
                        Weather
                      </Badge>
                    )}
                  </div>
                  {item.quantity > 1 && (
                    <span className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}