import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sun, Moon, Shirt, Cloud, CloudRain, CloudSnow, Wind, Activity, CheckCircle2, Sunrise } from "lucide-react";

interface DailyClothingData {
  date: string;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'mixed';
  temp: { high: number; low: number };
  timeOfDay: any[];
  activities?: string[];
}

interface DailyClothingSuggestionsProps {
  dailyData: DailyClothingData[];
  tripDetails?: {
    destination?: string;
    luggageSize?: string;
    tripTypes?: string[];
    duration?: number;
  };
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
      return <Sun className="h-4 w-4 text-warning" />;
    case 'cloudy':
      return <Cloud className="h-4 w-4 text-neutral" />;
    case 'rainy':
      return <CloudRain className="h-4 w-4 text-info" />;
    case 'snowy':
      return <CloudSnow className="h-4 w-4 text-info" />;
    case 'mixed':
      return <Wind className="h-4 w-4 text-neutral" />;
    default:
      return <Cloud className="h-4 w-4 text-neutral" />;
  }
};

const getDetailedClothingSuggestions = (condition: string, temp: { high: number; low: number }, period: string, activities: string[] = []) => {
  const suggestions: string[] = [];
  
  // Base clothing suggestions
  if (period === 'morning') {
    if (temp.low < 60) {
      suggestions.push("👕 Long-sleeve shirts");
      suggestions.push("🧥 Light sweater or hoodie");
      suggestions.push("👖 Comfortable pants or jeans");
      suggestions.push("👟 Comfortable walking shoes");
    } else {
      suggestions.push("👕 Short-sleeve T-shirts");
      suggestions.push("👖 Comfortable pants or jeans");
      suggestions.push("👟 Comfortable walking shoes");
    }
  } else if (period === 'daytime') {
    if (temp.high >= 75) {
      suggestions.push("👕 Short-sleeve T-shirts");
      suggestions.push("🩳 Shorts or lightweight trousers");
      suggestions.push("🧦 Socks");
      suggestions.push("🕶️ Sunglasses");
      suggestions.push("🧢 Hat or cap");
      suggestions.push("🧴 Sunscreen (SPF 30+)");
    } else if (temp.high >= 65) {
      suggestions.push("👕 Short-sleeve T-shirts");
      suggestions.push("🧥 Light jacket or cardigan");
    } else {
      suggestions.push("🧥 Light jacket or cardigan");
      suggestions.push("🧤 Gloves and warm hat");
    }
    
    if (condition === 'rainy' || condition === 'mixed') {
      suggestions.push("☂️ Rain jacket or compact umbrella");
      suggestions.push("👟 Waterproof shoes");
    }
  } else if (period === 'evening') {
    if (temp.low < 65) {
      suggestions.push("🧥 Light jacket or cardigan");
    }
    
    if (condition === 'rainy') {
      suggestions.push("☂️ Rain jacket or compact umbrella");
    }
  }

  // Activity-specific additions
  activities.forEach(activity => {
    const activityLower = activity.toLowerCase();
    
    if (activityLower.includes('swimming') || activityLower.includes('beach')) {
      suggestions.push("👙 Swimwear");
      suggestions.push("🩴 Beach sandals or flip-flops");
      suggestions.push("🧴 Waterproof sunscreen");
      suggestions.push("🏖️ Beach towel");
    }
    
    if (activityLower.includes('hiking') || activityLower.includes('nature') || activityLower.includes('outdoor')) {
      suggestions.push("🥾 Hiking boots or sturdy shoes");
      suggestions.push("🧢 Hat or cap");
      suggestions.push("🎒 Small backpack");
      suggestions.push("💧 Water bottle");
    }
    
    if (activityLower.includes('business') || activityLower.includes('meeting') || activityLower.includes('conference')) {
      suggestions.push("👔 Business shirts/blouses");
      suggestions.push("👞 Formal shoes");
      suggestions.push("🧥 Blazer or suit jacket");
    }
    
    if (activityLower.includes('running') || activityLower.includes('cycling') || activityLower.includes('sport')) {
      suggestions.push("👕 Breathable/moisture-wicking shirts");
      suggestions.push("👟 Athletic shoes");
      suggestions.push("🧢 Sports cap");
      suggestions.push("💧 Water bottle");
    }
    
    if (activityLower.includes('dining') || activityLower.includes('nightlife') || activityLower.includes('restaurant')) {
      suggestions.push("👕 Short-sleeve T-shirts");
      suggestions.push("👟 Lightweight sneakers or casual shoes");
      if (period === 'evening') {
        suggestions.push("🧥 Light jacket or cardigan");
      }
    }
    
    if (activityLower.includes('spa') || activityLower.includes('yoga') || activityLower.includes('meditation')) {
      suggestions.push("👕 Short-sleeve T-shirts");
      suggestions.push("🩴 Sandals");
    }
    
    if (activityLower.includes('skiing') || activityLower.includes('snowboard') || activityLower.includes('snow')) {
      suggestions.push("🎿 Thermal base layers");
      suggestions.push("🧥 Insulated ski jacket");
      suggestions.push("🧤 Waterproof gloves");
      suggestions.push("🥽 Ski goggles");
    }
    
    if (activityLower.includes('water sport') || activityLower.includes('sailing') || activityLower.includes('fishing')) {
      suggestions.push("👕 Breathable/moisture-wicking shirts");
      suggestions.push("👟 Waterproof shoes");
      suggestions.push("🧥 Rain jacket or compact umbrella");
      suggestions.push("🧢 Hat or cap");
    }
  });
  
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
  
  // Essential weather-based items only
  switch (condition) {
    case 'sunny':
      tips.push("UV protection - sunglasses, hat, and SPF 30+ sunscreen");
      break;
    case 'rainy':
      tips.push("Waterproof items - umbrella, rain jacket, and waterproof footwear");
      break;
    case 'mixed':
      tips.push("Sun protection - sunglasses, hat, and SPF 30+ sunscreen");
      tips.push("Rain protection - compact umbrella and light rain jacket");
      break;
    case 'cloudy':
      tips.push("UV protection - sunglasses and SPF 30+ sunscreen (UV rays penetrate clouds)");
      break;
    case 'snowy':
      tips.push("Cold protection - waterproof boots, gloves, and warm hat");
      break;
  }
  
  // Essential temperature-based items
  if (temp.high >= 80) {
    tips.push("Heat protection - lightweight hat and SPF 30+ sunscreen");
  } else if (temp.low <= 40) {
    tips.push("Cold protection - gloves, warm hat, and thermal layers");
  }
  
  return tips;
};

const getConsolidatedPackingList = (
  dailyData: DailyClothingData[], 
  tripDetails?: {
    destination?: string;
    luggageSize?: string;
    tripTypes?: string[];
    duration?: number;
  }
) => {
  const allConditions = dailyData.map(day => day.condition);
  const allTemps = dailyData.map(day => day.temp);
  const allActivities = dailyData.flatMap(day => day.activities || []);
  const maxTemp = Math.max(...allTemps.map(t => t.high));
  const minTemp = Math.min(...allTemps.map(t => t.low));
  const hasRain = allConditions.includes('rainy') || allConditions.includes('mixed');
  const hasHotWeather = maxTemp >= 75;
  const hasColdMornings = minTemp < 60;
  const hasSwimming = allActivities.some(activity => 
    activity.toLowerCase().includes('swimming') || 
    activity.toLowerCase().includes('beach') ||
    activity.toLowerCase().includes('water sport')
  );
  const hasBusiness = allActivities.some(activity => 
    activity.toLowerCase().includes('business') || 
    activity.toLowerCase().includes('meeting') ||
    activity.toLowerCase().includes('conference')
  );
  const hasHiking = allActivities.some(activity => 
    activity.toLowerCase().includes('hiking') || 
    activity.toLowerCase().includes('outdoor') ||
    activity.toLowerCase().includes('nature')
  );
  const hasRunning = allActivities.some(activity => 
    activity.toLowerCase().includes('running') || 
    activity.toLowerCase().includes('cycling') ||
    activity.toLowerCase().includes('sport')
  );

  // Adjust quantities based on luggage size
  const getLuggageMultiplier = () => {
    switch (tripDetails?.luggageSize) {
      case 'carry-on': return { shirts: 2, pants: 1, extras: 0.5 };
      case 'backpack': return { shirts: 2.5, pants: 1.5, extras: 0.7 };
      case 'medium-suitcase': return { shirts: 3, pants: 2, extras: 1 };
      case 'large-suitcase': return { shirts: 4, pants: 2.5, extras: 1.5 };
      default: return { shirts: 3, pants: 2, extras: 1 };
    }
  };

  const multiplier = getLuggageMultiplier();
  const duration = tripDetails?.duration || dailyData.length;

  const packingList = {
    tops: [
      `👕 Short-sleeve T-shirts (${Math.max(2, Math.ceil(multiplier.shirts * Math.min(duration * 0.7, 5)))})`,
      `👕 Long-sleeve shirts (${Math.max(1, Math.ceil(multiplier.shirts * 0.5))})`,
      ...(hasColdMornings ? [`🧥 Light sweater or hoodie (${Math.ceil(multiplier.extras)})`] : []),
      ...(hasHotWeather ? [`👕 Breathable/moisture-wicking shirts (${Math.ceil(multiplier.shirts * 0.6)})`] : []),
      ...(hasBusiness ? [`👔 Business shirts/blouses (${Math.ceil(multiplier.shirts * 0.8)})`] : [])
    ],
    bottoms: [
      `👖 Comfortable pants or jeans (${Math.max(1, Math.ceil(multiplier.pants))})`,
      ...(hasHotWeather ? [`🩳 Shorts or lightweight trousers (${Math.ceil(multiplier.pants * 0.8)})`] : []),
      `🧦 Socks (${Math.max(duration, Math.ceil(duration * 1.2))} pairs)`,
      `👙 Undergarments (${Math.max(duration, Math.ceil(duration * 1.2))} sets)`,
      ...(hasBusiness ? [`👔 Dress pants/skirts (${Math.ceil(multiplier.pants * 0.7)})`] : []),
      ...(hasSwimming ? ["👙 Swimwear (1-2 sets)"] : [])
    ],
    outerwear: [
      "🧥 Light jacket or cardigan",
      ...(hasRain ? ["☂️ Rain jacket or compact umbrella", "👟 Waterproof shoes"] : []),
      ...(minTemp < 50 ? ["🧤 Gloves and warm hat"] : []),
      ...(hasBusiness ? ["🧥 Blazer or suit jacket"] : [])
    ],
    footwear: [
      "👟 Comfortable walking shoes",
      "👟 Lightweight sneakers or casual shoes",
      ...(hasHotWeather ? ["🩴 Sandals (optional)"] : []),
      ...(hasBusiness ? ["👞 Formal shoes"] : []),
      ...(hasHiking ? ["🥾 Hiking boots or sturdy shoes"] : []),
      ...(hasRunning ? ["👟 Athletic shoes"] : []),
      ...(hasSwimming ? ["🩴 Beach sandals or flip-flops"] : [])
    ],
    accessories: [
      "🕶️ Sunglasses",
      "🧢 Hat or cap",
      "🧴 Sunscreen (SPF 30+)",
      ...(hasColdMornings ? ["🧣 Small scarf or shawl"] : []),
      ...(hasSwimming ? ["🏖️ Beach towel", "🧴 Waterproof sunscreen"] : []),
      ...(hasHiking ? ["🎒 Small backpack", "💧 Water bottle"] : []),
      ...(hasRunning ? ["💧 Water bottle", "🧢 Sports cap"] : [])
    ],
    essentials: [
      "📱 Phone charger",
      "🆔 Travel documents",
      "💳 Wallet/cards",
      "🧴 Toiletries",
      `💊 Medications (${duration}-day supply)`,
      ...(tripDetails?.luggageSize === 'carry-on' ? ["🧴 Travel-size toiletries (TSA compliant)"] : []),
      ...(tripDetails?.destination?.toLowerCase().includes('international') ? ["🛂 Passport", "🔌 Power adapter"] : [])
    ]
  };

  return packingList;
};

export default function DailyClothingSuggestions({ dailyData, tripDetails }: DailyClothingSuggestionsProps) {
  const packingList = getConsolidatedPackingList(dailyData, tripDetails);
  
  return (
    <div className="space-y-6">
      {/* Recommended Packing List */}
      <Card className="p-6 shadow-card border-0 bg-card">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Shirt className="h-5 w-5 text-primary" />
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Your Packing List
                </h3>
                {tripDetails?.luggageSize && (
                  <span className="text-sm font-normal text-muted-foreground">
                    (Optimized for {tripDetails.luggageSize.replace('-', ' ')})
                  </span>
                )}
              </div>
            </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-3 text-sm">👕 Tops</h4>
              <div className="space-y-1">
                {packingList.tops.map((item, index) => (
                  <p key={index} className="text-sm text-muted-foreground">{item}</p>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-3 text-sm">👖 Bottoms</h4>
              <div className="space-y-1">
                {packingList.bottoms.map((item, index) => (
                  <p key={index} className="text-sm text-muted-foreground">{item}</p>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-3 text-sm">🧥 Outerwear</h4>
              <div className="space-y-1">
                {packingList.outerwear.map((item, index) => (
                  <p key={index} className="text-sm text-muted-foreground">{item}</p>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-3 text-sm">👟 Footwear</h4>
              <div className="space-y-1">
                {packingList.footwear.map((item, index) => (
                  <p key={index} className="text-sm text-muted-foreground">{item}</p>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-3 text-sm">🕶️ Accessories</h4>
              <div className="space-y-1">
                {packingList.accessories.map((item, index) => (
                  <p key={index} className="text-sm text-muted-foreground">{item}</p>
                ))}
              </div>
            </div>
              <div>
                <h4 className="font-medium text-foreground mb-3 text-sm">🎯 Essentials</h4>
                <div className="space-y-1">
                  {packingList.essentials.map((item, index) => (
                    <p key={index} className="text-sm text-muted-foreground">{item}</p>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-success-light rounded-lg border border-success/30">
              <p className="text-sm text-success font-medium">
                📋 This personalized list is optimized for your {tripDetails?.luggageSize?.replace('-', ' ') || 'luggage'}
                {tripDetails?.tripTypes && tripDetails.tripTypes.length > 0 && (
                  <span>, <strong>{tripDetails.tripTypes.join(' & ')}</strong> trip{tripDetails.tripTypes.length > 1 ? 's' : ''}</span>
                )}, and planned activities. 
                Quantities are calculated based on your {dailyData.length}-day trip duration.
              </p>
            </div>
        </div>
      </Card>

      {/* Daily Clothing Suggestions */}
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
                  {day.activities && day.activities.length > 0 && (
                    <Badge variant="outline" className="text-xs bg-success-light text-success border-success/30 font-semibold">
                      {day.activities.length} activit{day.activities.length === 1 ? 'y' : 'ies'}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs bg-info-light text-info ml-auto border border-info/30 font-semibold">
                    {getHighLevelClothingInfo(day.condition, day.temp)}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                {/* Planned Activities Section */}
                {day.activities && day.activities.length > 0 && (
                <div className="mb-4">
                  <Card className="p-4 bg-success-light border border-success/30">
                    <h6 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Activity className="h-4 w-4 text-success" />
                        Planned Activities for {day.date}
                      </h6>
                      <div className="flex flex-wrap gap-2">
                        {day.activities.map((activity, index) => (
                          <Badge key={index} variant="secondary" className="bg-success/15 text-success border border-success/30 font-semibold">
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  </div>
                )}
                
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   {/* Morning */}
                   <Card className="p-5 bg-warning-light border border-warning/30 hover:shadow-card transition-shadow duration-200">
                     <div className="space-y-4">
                       {/* Header with Time Period */}
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <div className="p-2 bg-warning/15 rounded-full">
                             <Sunrise className="h-4 w-4 text-warning" />
                           </div>
                           <div>
                             <h5 className="font-semibold text-foreground">Morning</h5>
                             <p className="text-xs text-muted-foreground">dawn to ~9 AM</p>
                           </div>
                         </div>
                       </div>
                       
                       {/* Weather & Temperature Highlight */}
                       <div className="bg-white/80 rounded-lg p-3 border border-warning/30">
                         <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center gap-2">
                             {getWeatherIcon(day.condition)}
                             <span className="text-sm font-medium text-foreground capitalize">{day.condition}</span>
                           </div>
                         </div>
                         <div className="space-y-1">
                           <p className="text-lg font-bold text-foreground">
                             {getTimeTemperature('morning', day.temp).fahrenheit}
                           </p>
                         </div>
                       </div>
                       
                       {/* Clothing Suggestions */}
                       <div className="space-y-2">
                         <h6 className="text-sm font-medium text-foreground">Recommended Items:</h6>
                         <div className="space-y-1">
                           {getDetailedClothingSuggestions(day.condition, day.temp, 'morning', day.activities).map((suggestion, index) => (
                             <p key={index} className="text-xs text-foreground flex items-start gap-1">
                               <span className="text-warning mt-0.5">•</span>
                               <span>{suggestion}</span>
                             </p>
                           ))}
                         </div>
                       </div>
                     </div>
                   </Card>

                   {/* Daytime */}
                   <Card className="p-5 bg-info-light border border-info/30 hover:shadow-card transition-shadow duration-200">
                     <div className="space-y-4">
                       {/* Header with Time Period */}
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <div className="p-2 bg-info/15 rounded-full">
                             <Sun className="h-4 w-4 text-info" />
                           </div>
                           <div>
                             <h5 className="font-semibold text-foreground">Daytime</h5>
                             <p className="text-xs text-muted-foreground">~9 AM–6 PM</p>
                           </div>
                         </div>
                       </div>
                       
                       {/* Weather & Temperature Highlight */}
                       <div className="bg-white/80 rounded-lg p-3 border border-info/30">
                         <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center gap-2">
                             {getWeatherIcon(day.condition)}
                             <span className="text-sm font-medium text-foreground capitalize">{day.condition}</span>
                           </div>
                         </div>
                         <div className="space-y-1">
                           <p className="text-lg font-bold text-foreground">
                             {getTimeTemperature('daytime', day.temp).fahrenheit}
                           </p>
                         </div>
                       </div>
                       
                       {/* Clothing Suggestions */}
                       <div className="space-y-2">
                         <h6 className="text-sm font-medium text-foreground">Recommended Items:</h6>
                         <div className="space-y-1">
                           {getDetailedClothingSuggestions(day.condition, day.temp, 'daytime', day.activities).map((suggestion, index) => (
                             <p key={index} className="text-xs text-foreground flex items-start gap-1">
                               <span className="text-info mt-0.5">•</span>
                               <span>{suggestion}</span>
                             </p>
                           ))}
                         </div>
                       </div>
                     </div>
                   </Card>

                   {/* Evening */}
                   <Card className="p-5 bg-accent-light border border-primary/30 hover:shadow-card transition-shadow duration-200">
                     <div className="space-y-4">
                       {/* Header with Time Period */}
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <div className="p-2 bg-primary/15 rounded-full">
                             <Moon className="h-4 w-4 text-primary" />
                           </div>
                           <div>
                             <h5 className="font-semibold text-foreground">Evening</h5>
                             <p className="text-xs text-muted-foreground">after ~6 PM</p>
                           </div>
                         </div>
                       </div>
                       
                       {/* Weather & Temperature Highlight */}
                       <div className="bg-white/80 rounded-lg p-3 border border-primary/30">
                         <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center gap-2">
                             {getWeatherIcon(day.condition)}
                             <span className="text-sm font-medium text-foreground capitalize">{day.condition}</span>
                           </div>
                         </div>
                         <div className="space-y-1">
                           <p className="text-lg font-bold text-foreground">
                             {getTimeTemperature('evening', day.temp).fahrenheit}
                           </p>
                         </div>
                       </div>
                       
                       {/* Clothing Suggestions */}
                       <div className="space-y-2">
                         <h6 className="text-sm font-medium text-foreground">Recommended Items:</h6>
                         <div className="space-y-1">
                           {getDetailedClothingSuggestions(day.condition, day.temp, 'evening', day.activities).map((suggestion, index) => (
                             <p key={index} className="text-xs text-foreground flex items-start gap-1">
                               <span className="text-primary mt-0.5">•</span>
                               <span>{suggestion}</span>
                             </p>
                           ))}
                         </div>
                       </div>
                     </div>
                   </Card>
                </div>
                
                {/* Packing Tips Section */}
                <div className="mt-6">
                  <Card className="p-4 bg-gradient-to-r from-primary/15 to-info/15 border border-primary/30">
                    <h6 className="font-medium text-foreground mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
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
        
        <div className="mt-4 p-3 bg-info-light rounded-lg border border-info/30">
          <p className="text-sm text-info font-medium">
            💡 These suggestions are based on weather conditions and time of day. Adjust based on your personal preferences and planned activities.
          </p>
        </div>
        </div>
      </Card>
    </div>
  );
}