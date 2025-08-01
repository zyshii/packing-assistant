import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun, Sunset, Moon, Shirt, Glasses, Umbrella, Wind } from "lucide-react";

interface ClothingSuggestion {
  item: string;
  icon: React.ReactNode;
  priority: 'essential' | 'recommended' | 'optional';
}

interface TimeOfDayData {
  period: string;
  timeRange: string;
  icon: React.ReactNode;
  suggestions: ClothingSuggestion[];
  color: string;
}

interface DailyClothingData {
  date: string;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'mixed';
  temp: { high: number; low: number };
  timeOfDay: TimeOfDayData[];
}

interface DailyClothingSuggestionsProps {
  dailyData: DailyClothingData[];
}

const getClothingSuggestions = (condition: string, temp: { high: number; low: number }, period: string): ClothingSuggestion[] => {
  const suggestions: ClothingSuggestion[] = [];
  
  if (period === 'morning') {
    // Morning suggestions (dawn to ~9 AM)
    if (temp.low < 60) {
      suggestions.push({ item: "Light jacket or cardigan", icon: <Shirt className="h-3 w-3" />, priority: 'recommended' });
    }
    suggestions.push({ item: "Comfortable walking shoes", icon: <Shirt className="h-3 w-3" />, priority: 'essential' });
    if (condition === 'sunny' || condition === 'mixed') {
      suggestions.push({ item: "Sunglasses", icon: <Glasses className="h-3 w-3" />, priority: 'recommended' });
    }
  } else if (period === 'daytime') {
    // Daytime suggestions (~9 AM–6 PM)
    if (temp.high >= 75) {
      suggestions.push({ item: "Light breathable clothing", icon: <Shirt className="h-3 w-3" />, priority: 'essential' });
      suggestions.push({ item: "Sunscreen", icon: <Sun className="h-3 w-3" />, priority: 'essential' });
    } else if (temp.high >= 65) {
      suggestions.push({ item: "Comfortable layers", icon: <Shirt className="h-3 w-3" />, priority: 'recommended' });
    } else {
      suggestions.push({ item: "Warm layers", icon: <Shirt className="h-3 w-3" />, priority: 'essential' });
    }
    
    suggestions.push({ item: "Hat", icon: <Sun className="h-3 w-3" />, priority: 'recommended' });
    suggestions.push({ item: "Sunglasses", icon: <Glasses className="h-3 w-3" />, priority: 'recommended' });
    
    if (condition === 'rainy' || condition === 'mixed') {
      suggestions.push({ item: "Light rain jacket", icon: <Umbrella className="h-3 w-3" />, priority: 'essential' });
    }
  } else if (period === 'evening') {
    // Evening suggestions (after ~6 PM)
    if (temp.low < 65) {
      suggestions.push({ item: "Light jacket or sweater", icon: <Shirt className="h-3 w-3" />, priority: 'recommended' });
    }
    suggestions.push({ item: "Comfortable walking shoes", icon: <Shirt className="h-3 w-3" />, priority: 'essential' });
    if (condition === 'rainy') {
      suggestions.push({ item: "Umbrella", icon: <Umbrella className="h-3 w-3" />, priority: 'essential' });
    }
    if (temp.low < 60) {
      suggestions.push({ item: "Warm layers", icon: <Wind className="h-3 w-3" />, priority: 'recommended' });
    }
  }
  
  return suggestions;
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'essential':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'recommended':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'optional':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function DailyClothingSuggestions({ dailyData }: DailyClothingSuggestionsProps) {
  return (
    <Card className="p-6 shadow-card border-0 bg-card">
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Shirt className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Daily Clothing Suggestions</h3>
        </div>
        
        {dailyData.map((day, dayIndex) => (
          <div key={dayIndex} className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <h4 className="text-lg font-medium text-foreground">{day.date}</h4>
              <Badge variant="secondary" className="text-xs">
                {day.temp.high}°F / {day.temp.low}°F
              </Badge>
              <Badge variant="outline" className="text-xs capitalize">
                {day.condition}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Morning */}
              <div className="p-4 rounded-lg bg-yellow-50/50 border border-yellow-200/50">
                <div className="flex items-center gap-2 mb-3">
                  <Sun className="h-4 w-4 text-yellow-600" />
                  <h5 className="font-medium text-foreground">Morning</h5>
                  <span className="text-xs text-muted-foreground">dawn - 9 AM</span>
                </div>
                <div className="space-y-2">
                  {getClothingSuggestions(day.condition, day.temp, 'morning').map((suggestion, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {suggestion.icon}
                      <span className="text-sm text-foreground">{suggestion.item}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ml-auto ${getPriorityColor(suggestion.priority)}`}
                      >
                        {suggestion.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daytime */}
              <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-200/50">
                <div className="flex items-center gap-2 mb-3">
                  <Sun className="h-4 w-4 text-blue-600" />
                  <h5 className="font-medium text-foreground">Daytime</h5>
                  <span className="text-xs text-muted-foreground">9 AM - 6 PM</span>
                </div>
                <div className="space-y-2">
                  {getClothingSuggestions(day.condition, day.temp, 'daytime').map((suggestion, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {suggestion.icon}
                      <span className="text-sm text-foreground">{suggestion.item}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ml-auto ${getPriorityColor(suggestion.priority)}`}
                      >
                        {suggestion.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evening */}
              <div className="p-4 rounded-lg bg-purple-50/50 border border-purple-200/50">
                <div className="flex items-center gap-2 mb-3">
                  <Moon className="h-4 w-4 text-purple-600" />
                  <h5 className="font-medium text-foreground">Evening</h5>
                  <span className="text-xs text-muted-foreground">after 6 PM</span>
                </div>
                <div className="space-y-2">
                  {getClothingSuggestions(day.condition, day.temp, 'evening').map((suggestion, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {suggestion.icon}
                      <span className="text-sm text-foreground">{suggestion.item}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ml-auto ${getPriorityColor(suggestion.priority)}`}
                      >
                        {suggestion.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="mt-4 p-3 bg-travel-blue/10 rounded-lg border border-travel-blue/20">
          <p className="text-sm text-travel-blue">
            💡 These suggestions are based on weather conditions and time of day. Adjust based on your personal preferences and planned activities.
          </p>
        </div>
      </div>
    </Card>
  );
}