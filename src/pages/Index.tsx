import { useState } from "react";
import { Shirt, Briefcase, Zap, FileText, Heart, Gamepad2 } from "lucide-react";
import TripHeader from "@/components/TripHeader";
import PackingProgress from "@/components/PackingProgress";
import PackingCategory from "@/components/PackingCategory";
import WeatherInfo from "@/components/WeatherInfo";

interface PackingItem {
  id: string;
  name: string;
  quantity: number;
  essential: boolean;
  packed: boolean;
  weatherDependent?: boolean;
}

const Index = () => {
  // Sample trip data
  const tripData = {
    destination: "Paris, France",
    dates: "May 30 - Jun 1",
    tripType: "leisure",
    travelers: 1,
    activities: ["Sightseeing", "Museums", "Dining", "Photography"]
  };

  const weatherData = {
    destination: tripData.destination,
    forecast: {
      condition: 'mixed' as const,
      temp: { high: 72, low: 58 },
      humidity: 65
    }
  };

  // Sample packing data
  const [packingItems, setPackingItems] = useState({
    clothing: [
      { id: "1", name: "T-shirts", quantity: 3, essential: true, packed: true, weatherDependent: false },
      { id: "2", name: "Pants/Jeans", quantity: 2, essential: true, packed: false, weatherDependent: false },
      { id: "3", name: "Light jacket", quantity: 1, essential: false, packed: false, weatherDependent: true },
      { id: "4", name: "Underwear", quantity: 4, essential: true, packed: true, weatherDependent: false },
      { id: "5", name: "Socks", quantity: 4, essential: true, packed: false, weatherDependent: false },
      { id: "6", name: "Comfortable shoes", quantity: 1, essential: true, packed: true, weatherDependent: false },
      { id: "7", name: "Rain jacket", quantity: 1, essential: false, packed: false, weatherDependent: true }
    ],
    electronics: [
      { id: "8", name: "Phone charger", quantity: 1, essential: true, packed: true, weatherDependent: false },
      { id: "9", name: "Power adapter", quantity: 1, essential: true, packed: false, weatherDependent: false },
      { id: "10", name: "Camera", quantity: 1, essential: false, packed: false, weatherDependent: false },
      { id: "11", name: "Portable battery", quantity: 1, essential: false, packed: true, weatherDependent: false }
    ],
    documents: [
      { id: "12", name: "Passport", quantity: 1, essential: true, packed: false, weatherDependent: false },
      { id: "13", name: "Travel insurance", quantity: 1, essential: true, packed: false, weatherDependent: false },
      { id: "14", name: "Hotel confirmations", quantity: 1, essential: true, packed: true, weatherDependent: false },
      { id: "15", name: "Emergency contacts", quantity: 1, essential: true, packed: false, weatherDependent: false }
    ],
    personal: [
      { id: "16", name: "Toothbrush", quantity: 1, essential: true, packed: true, weatherDependent: false },
      { id: "17", name: "Toothpaste", quantity: 1, essential: true, packed: false, weatherDependent: false },
      { id: "18", name: "Medications", quantity: 1, essential: true, packed: false, weatherDependent: false },
      { id: "19", name: "Sunscreen", quantity: 1, essential: false, packed: false, weatherDependent: true }
    ],
    entertainment: [
      { id: "20", name: "Book/E-reader", quantity: 1, essential: false, packed: false, weatherDependent: false },
      { id: "21", name: "Headphones", quantity: 1, essential: false, packed: true, weatherDependent: false },
      { id: "22", name: "Travel journal", quantity: 1, essential: false, packed: false, weatherDependent: false }
    ]
  });

  // Calculate totals
  const allItems = Object.values(packingItems).flat();
  const totalItems = allItems.length;
  const packedItems = allItems.filter(item => item.packed).length;

  const handleItemToggle = (itemId: string) => {
    setPackingItems(prev => {
      const newItems = { ...prev };
      
      // Find and toggle the item in the appropriate category
      Object.keys(newItems).forEach(category => {
        const categoryItems = newItems[category as keyof typeof newItems];
        const itemIndex = categoryItems.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
          categoryItems[itemIndex] = {
            ...categoryItems[itemIndex],
            packed: !categoryItems[itemIndex].packed
          };
        }
      });
      
      return newItems;
    });
  };

  const categories = [
    {
      title: "Clothing",
      icon: <Shirt className="h-4 w-4 text-travel-purple" />,
      items: packingItems.clothing,
      colorClass: "bg-travel-purple/20"
    },
    {
      title: "Electronics",
      icon: <Zap className="h-4 w-4 text-travel-blue" />,
      items: packingItems.electronics,
      colorClass: "bg-travel-blue/20"
    },
    {
      title: "Documents",
      icon: <FileText className="h-4 w-4 text-travel-orange" />,
      items: packingItems.documents,
      colorClass: "bg-travel-orange/20"
    },
    {
      title: "Personal Care",
      icon: <Heart className="h-4 w-4 text-travel-pink" />,
      items: packingItems.personal,
      colorClass: "bg-travel-pink/20"
    },
    {
      title: "Entertainment",
      icon: <Gamepad2 className="h-4 w-4 text-travel-green" />,
      items: packingItems.entertainment,
      colorClass: "bg-travel-green/20"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Trip Header */}
        <TripHeader
          destination={tripData.destination}
          dates={tripData.dates}
          tripType={tripData.tripType}
          travelers={tripData.travelers}
          activities={tripData.activities}
        />

        {/* Progress and Weather Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PackingProgress totalItems={totalItems} packedItems={packedItems} />
          </div>
          <div>
            <WeatherInfo 
              destination={weatherData.destination}
              forecast={weatherData.forecast}
            />
          </div>
        </div>

        {/* Packing Categories */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Packing Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <PackingCategory
                key={category.title}
                title={category.title}
                icon={category.icon}
                items={category.items}
                onItemToggle={handleItemToggle}
                colorClass={category.colorClass}
              />
            ))}
          </div>
        </div>

        {/* AI Tips */}
        <div className="p-6 bg-gradient-to-r from-travel-purple/10 to-travel-blue/10 rounded-lg border border-travel-purple/20">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-travel-purple/20 rounded-lg">
              <Briefcase className="h-5 w-5 text-travel-purple" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Smart Packing Tips</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• Pack layers for variable weather in Paris</p>
                <p>• Comfortable walking shoes are essential for sightseeing</p>
                <p>• Don't forget your camera for those memorable museum visits</p>
                <p>• A light rain jacket will keep you prepared</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;