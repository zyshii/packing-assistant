import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sun, Moon, Shirt, Cloud, CloudRain, CloudSnow, Wind } from "lucide-react";

interface DailyClothingData {
  date: string;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'mixed';
  temp: { high: number; low: number };
  timeOfDay: any[];
}

interface DailyClothingSuggestionsProps {
  dailyData: DailyClothingData[];
}

const getTimeTemperature = (period: string, temp: { high: number; low: number }) => {
  switch (period) {
    case 'morning':
      const morningLow = temp.low;
      const morningHigh = temp.low + 7;
      return { 
        fahrenheit: `${morningLow}–${morningHigh} °F`,
        celsius: `${Math.round((morningLow - 32) * 5/9)}–${Math.round((morningHigh - 32) * 5/9)} °C`
      };
    case 'daytime':
      const daytimeLow = temp.high - 5;
      const daytimeHigh = temp.high;
      return { 
        fahrenheit: `${daytimeLow}–${daytimeHigh} °F`,
        celsius: `${Math.round((daytimeLow - 32) * 5/9)}–${Math.round((daytimeHigh - 32) * 5/9)} °C`
      };
    case 'evening':
      const eveningLow = temp.low + 2;
      const eveningHigh = temp.low + 7;
      return { 
        fahrenheit: `${eveningLow}–${eveningHigh} °F`,
        celsius: `${Math.round((eveningLow - 32) * 5/9)}–${Math.round((eveningHigh - 32) * 5/9)} °C`
      };
    default:
      return { fahrenheit: '', celsius: '' };
  }
};

const getWeatherIcon = (condition: string) => {
  switch (condition) {
    case 'sunny':
      return <Sun className="h-4 w-4 text-yellow-500" />;
    case 'cloudy':
      return <Cloud className="h-4 w-4 text-gray-500" />;
    case 'rainy':
      return <CloudRain className="h-4 w-4 text-blue-500" />;
    case 'snowy':
      return <CloudSnow className="h-4 w-4 text-blue-200" />;
    case 'mixed':
      return <Wind className="h-4 w-4 text-gray-600" />;
    default:
      return <Cloud className="h-4 w-4 text-gray-500" />;
  }
};

const getDetailedClothingSuggestions = (condition: string, temp: { high: number; low: number }, period: string) => {
  const suggestions: string[] = [];
  
  if (period === 'morning') {
    if (temp.low < 60) {
      suggestions.push("Light long-sleeve shirt or T-shirt");
      suggestions.push("Thin sweater or hoodie");
      suggestions.push("Comfortable pants or jeans");
      suggestions.push("Closed shoes or lightweight sneakers");
    } else {
      suggestions.push("Light T-shirt or thin long-sleeve shirt");
      suggestions.push("Comfortable pants or light trousers");
      suggestions.push("Comfortable walking shoes");
    }
  } else if (period === 'daytime') {
    if (temp.high >= 75) {
      suggestions.push("Short-sleeve shirts or breathable T-shirts");
      suggestions.push("Shorts, skirts, or lightweight trousers");
      suggestions.push("Light socks and walking shoes or sandals");
      suggestions.push("Sunglasses, hat, and sunscreen");
    } else if (temp.high >= 65) {
      suggestions.push("Comfortable T-shirts or light sweaters");
      suggestions.push("Pants or jeans");
      suggestions.push("Comfortable walking shoes");
      suggestions.push("Light jacket");
    } else {
      suggestions.push("Warm layers - sweater or light jacket");
      suggestions.push("Long pants or jeans");
      suggestions.push("Closed shoes or boots");
      suggestions.push("Gloves (if very cold)");
    }
    
    if (condition === 'rainy' || condition === 'mixed') {
      suggestions.push("Rain jacket or umbrella");
      suggestions.push("Waterproof shoes");
    }
  } else if (period === 'evening') {
    if (temp.low < 65) {
      suggestions.push("Light jacket or cardigan");
      suggestions.push("Jeans or long pants");
      suggestions.push("Comfortable closed shoes");
    } else {
      suggestions.push("Light layers");
      suggestions.push("Comfortable pants or evening wear");
      suggestions.push("Comfortable walking shoes");
    }
    
    if (condition === 'rainy') {
      suggestions.push("Umbrella or rain jacket");
    }
  }
  
  return suggestions;
};

export default function DailyClothingSuggestions({ dailyData }: DailyClothingSuggestionsProps) {
  return (
    <Card className="p-6 shadow-card border-0 bg-card">
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Shirt className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Daily Clothing Suggestions</h3>
        </div>
        
        <Accordion type="multiple" className="w-full">
          {dailyData.map((day, dayIndex) => (
            <AccordionItem key={dayIndex} value={`day-${dayIndex}`} className="border border-border rounded-lg mb-4">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-3 w-full">
                  <h4 className="text-lg font-medium text-foreground">{day.date}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {day.temp.high}°F / {day.temp.low}°F
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize">
                    {day.condition}
                  </Badge>
                  <div className="ml-auto">
                    {getWeatherIcon(day.condition)}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Morning */}
                  <Card className="p-4 bg-yellow-50/50 border border-yellow-200/50">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4 text-yellow-600" />
                          <h5 className="font-medium text-foreground">Morning</h5>
                        </div>
                        {getWeatherIcon(day.condition)}
                      </div>
                      <p className="text-xs text-muted-foreground">(dawn to ~9 AM)</p>
                      <p className="text-sm font-medium text-foreground">
                        ~{getTimeTemperature('morning', day.temp).fahrenheit} / ~{getTimeTemperature('morning', day.temp).celsius}
                      </p>
                      <div className="space-y-1">
                        {getDetailedClothingSuggestions(day.condition, day.temp, 'morning').map((suggestion, index) => (
                          <p key={index} className="text-xs text-foreground">• {suggestion}</p>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* Daytime */}
                  <Card className="p-4 bg-blue-50/50 border border-blue-200/50">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4 text-blue-600" />
                          <h5 className="font-medium text-foreground">Daytime</h5>
                        </div>
                        {getWeatherIcon(day.condition)}
                      </div>
                      <p className="text-xs text-muted-foreground">(~9 AM–6 PM)</p>
                      <p className="text-sm font-medium text-foreground">
                        ~{getTimeTemperature('daytime', day.temp).fahrenheit} / ~{getTimeTemperature('daytime', day.temp).celsius}
                      </p>
                      <div className="space-y-1">
                        {getDetailedClothingSuggestions(day.condition, day.temp, 'daytime').map((suggestion, index) => (
                          <p key={index} className="text-xs text-foreground">• {suggestion}</p>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* Evening */}
                  <Card className="p-4 bg-purple-50/50 border border-purple-200/50">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4 text-purple-600" />
                          <h5 className="font-medium text-foreground">Evening</h5>
                        </div>
                        {getWeatherIcon(day.condition)}
                      </div>
                      <p className="text-xs text-muted-foreground">(after ~6 PM)</p>
                      <p className="text-sm font-medium text-foreground">
                        ~{getTimeTemperature('evening', day.temp).fahrenheit} / ~{getTimeTemperature('evening', day.temp).celsius}
                      </p>
                      <div className="space-y-1">
                        {getDetailedClothingSuggestions(day.condition, day.temp, 'evening').map((suggestion, index) => (
                          <p key={index} className="text-xs text-foreground">• {suggestion}</p>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        <div className="mt-4 p-3 bg-travel-blue/10 rounded-lg border border-travel-blue/20">
          <p className="text-sm text-travel-blue">
            💡 These suggestions are based on weather conditions and time of day. Adjust based on your personal preferences and planned activities.
          </p>
        </div>
      </div>
    </Card>
  );
}