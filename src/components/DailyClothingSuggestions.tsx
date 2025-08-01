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

const getHighLevelClothingInfo = (condition: string, temp: { high: number; low: number }) => {
  if (temp.high >= 80) {
    return "Light summer wear";
  } else if (temp.high >= 70) {
    if (temp.low < 60) {
      return "Layers recommended";
    }
    return "Comfortable wear";
  } else if (temp.high >= 60) {
    return "Light layers needed";
  } else {
    return "Warm clothing required";
  }
};

const getPackingTips = (condition: string, temp: { high: number; low: number }) => {
  const tips: string[] = [];
  
  // Temperature-based tips
  if (temp.high >= 80) {
    tips.push("Stick to lightweight, breathable fabrics like cotton or linen");
    tips.push("Sun protection is essential even if skies are only partly cloudy");
    tips.push("Consider moisture-wicking materials for comfort");
  } else if (temp.high >= 70) {
    if (temp.low < 60) {
      tips.push("Small scarf or shawl if you're sensitive to temperature shifts");
      tips.push("Layer-friendly pieces that can be easily added or removed");
    }
    tips.push("Comfortable walking shoes are crucial for extended sightseeing");
  } else if (temp.high >= 60) {
    tips.push("Light layers work better than one heavy piece");
    tips.push("A versatile cardigan or light jacket is your best friend");
  } else {
    tips.push("Thermal layers underneath regular clothes for warmth without bulk");
    tips.push("Don't forget warm accessories like gloves and a hat");
  }
  
  // Weather condition-based tips
  switch (condition) {
    case 'sunny':
      tips.push("UV protection is crucial - sunglasses, hat, and SPF 30+ sunscreen");
      tips.push("Light colors reflect heat better than dark ones");
      break;
    case 'rainy':
      tips.push("Waterproof footwear and a compact umbrella are essential");
      tips.push("Quick-dry fabrics will be your lifesaver");
      tips.push("Keep electronics in waterproof pouches");
      break;
    case 'mixed':
      tips.push("Check weather updates frequently as conditions can change quickly");
      tips.push("Pack both sun protection and rain gear to be prepared");
      tips.push("Layers are especially important for variable conditions");
      break;
    case 'cloudy':
      tips.push("Don't skip the sunscreen - UV rays penetrate clouds");
      tips.push("Light jacket recommended as clouds can make it feel cooler");
      break;
    case 'snowy':
      tips.push("Waterproof boots with good traction are essential");
      tips.push("Multiple thin layers trap heat better than one thick layer");
      tips.push("Keep extremities warm - hands, feet, and head lose heat quickly");
      break;
  }
  
  // General travel tips
  tips.push("Roll clothes instead of folding to save space and prevent wrinkles");
  
  return tips;
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
                  <Badge variant="secondary" className="text-xs bg-travel-green/20 text-travel-green ml-auto">
                    {getHighLevelClothingInfo(day.condition, day.temp)}
                  </Badge>
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
                
                {/* Packing Tips Section */}
                <div className="mt-6">
                  <Card className="p-4 bg-gradient-to-r from-travel-purple/10 to-travel-blue/10 border border-travel-purple/20">
                    <h6 className="font-medium text-foreground mb-3 flex items-center gap-2">
                      <Shirt className="h-4 w-4 text-travel-purple" />
                      Packing Tips for {day.date}
                    </h6>
                    <div className="space-y-2">
                      {getPackingTips(day.condition, day.temp).map((tip, index) => (
                        <p key={index} className="text-sm text-foreground">• {tip}</p>
                      ))}
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