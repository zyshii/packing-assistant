import { useState } from "react";
import { Shirt, Briefcase, Zap, FileText, Heart, Gamepad2, Plus, ArrowLeft, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import TripHeader from "@/components/TripHeader";
import PackingProgress from "@/components/PackingProgress";
import PackingCategory from "@/components/PackingCategory";
import WeatherInfo from "@/components/WeatherInfo";
import StepIndicator from "@/components/StepIndicator";
import OnboardingHint from "@/components/OnboardingHint";
import DailyWeatherForecast from "@/components/DailyWeatherForecast";
import ItemModal from "@/components/ItemModal";
import { useNavigate } from "react-router-dom";

interface PackingItem {
  id: string;
  name: string;
  quantity: number;
  essential: boolean;
  packed: boolean;
  weatherDependent?: boolean;
  notes?: string;
}

const steps = [
  { id: 1, title: "Trip Details", description: "Where & when" },
  { id: 2, title: "AI Suggestions", description: "Smart packing" },
  { id: 3, title: "Customize", description: "Your perfect list" },
  { id: 4, title: "Pack & Go", description: "Track progress" },
];

const Index = () => {
  const navigate = useNavigate();
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingItem, setEditingItem] = useState<PackingItem | null>(null);
  
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

  // Daily weather forecasts
  const dailyForecasts = [
    { date: "May 30", condition: 'sunny' as const, temp: { high: 74, low: 60 }, humidity: 60 },
    { date: "May 31", condition: 'mixed' as const, temp: { high: 70, low: 58 }, humidity: 70 },
    { date: "Jun 1", condition: 'rainy' as const, temp: { high: 68, low: 55 }, humidity: 80 },
  ];

  // Sample packing data - using PackingItem type consistently
  const [packingItems, setPackingItems] = useState<{
    clothing: PackingItem[];
    electronics: PackingItem[];
    documents: PackingItem[];
    personal: PackingItem[];
    entertainment: PackingItem[];
  }>({
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

  const handleAddItem = () => {
    setModalMode('add');
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item: PackingItem) => {
    setModalMode('edit');
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = (itemData: Partial<PackingItem>) => {
    if (modalMode === 'add') {
      // Add new item to appropriate category (default to personal for custom items)
      const newItem: PackingItem = {
        id: itemData.id || `item_${Date.now()}`,
        name: itemData.name || "",
        quantity: itemData.quantity || 1,
        essential: itemData.essential || false,
        packed: false,
        weatherDependent: itemData.weatherDependent,
        notes: itemData.notes
      };
      setPackingItems(prev => ({
        ...prev,
        personal: [...prev.personal, newItem]
      }));
    } else {
      // Edit existing item
      setPackingItems(prev => {
        const newItems = { ...prev };
        Object.keys(newItems).forEach(category => {
          const categoryItems = newItems[category as keyof typeof newItems];
          const itemIndex = categoryItems.findIndex(item => item.id === itemData.id);
          if (itemIndex !== -1) {
            categoryItems[itemIndex] = { ...categoryItems[itemIndex], ...itemData };
          }
        });
        return newItems;
      });
    }
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
    <div className="min-h-screen bg-gradient-background">
      <div className="max-w-5xl mx-auto p-4 space-y-6 lg:space-y-8">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Trip Details
          </Button>
          
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-success rounded-full text-white text-sm font-medium shadow-floating">
            <CheckCircle className="w-4 h-4" />
            AI List Generated
          </div>
        </div>

        {/* Step Indicator */}
        <div className="animate-slide-in">
          <StepIndicator steps={steps} currentStep={3} />
        </div>

        {/* Onboarding Hint */}
        <OnboardingHint
          title="Your AI-powered packing list is ready!"
          description="Review the suggested items, check off what you've packed, and add any custom items you need. The list is tailored to your destination and activities."
          storageKey="packing-list-hint-seen"
          className="animate-scale-in"
        />

        {/* Trip Header */}
        <div className="animate-fade-in">
          <TripHeader
            destination={tripData.destination}
            dates={tripData.dates}
            tripType={tripData.tripType}
            travelers={tripData.travelers}
            activities={tripData.activities}
          />
        </div>

        {/* Progress and Weather Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-slide-in">
          <div className="xl:col-span-2">
            <PackingProgress totalItems={totalItems} packedItems={packedItems} />
          </div>
          <div>
            <WeatherInfo 
              destination={weatherData.destination}
              forecast={weatherData.forecast}
            />
          </div>
        </div>

        {/* Daily Weather Forecast */}
        <div className="animate-fade-in">
          <DailyWeatherForecast 
            destination={tripData.destination}
            forecasts={dailyForecasts}
          />
        </div>

        {/* Packing Categories */}
        <div className="space-y-6 animate-scale-in">
          <div className="flex items-center justify-between">
            <h2 className="text-xl lg:text-2xl font-semibold text-foreground">Packing Categories</h2>
            <Button
              onClick={handleAddItem}
              className="bg-gradient-primary hover:opacity-90 shadow-floating transition-all duration-300 hover:shadow-modal hover:scale-105"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Item
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {categories.map((category, index) => (
              <div 
                key={category.title}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <PackingCategory
                  title={category.title}
                  icon={category.icon}
                  items={category.items}
                  onItemToggle={handleItemToggle}
                  colorClass={category.colorClass}
                />
              </div>
            ))}
          </div>
        </div>

        {/* AI Tips */}
        <div className="p-6 lg:p-8 bg-gradient-to-r from-travel-purple/10 to-travel-blue/10 rounded-xl border border-travel-purple/20 shadow-soft animate-scale-in">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-primary rounded-xl shadow-floating">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-3">AI-Powered Smart Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-travel-purple rounded-full mt-2 flex-shrink-0"></div>
                  <p>Pack layers for variable weather in Paris</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-travel-blue rounded-full mt-2 flex-shrink-0"></div>
                  <p>Comfortable walking shoes are essential for sightseeing</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-travel-green rounded-full mt-2 flex-shrink-0"></div>
                  <p>Don't forget your camera for those memorable museum visits</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-travel-orange rounded-full mt-2 flex-shrink-0"></div>
                  <p>A light rain jacket will keep you prepared</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Item Modal */}
        <ItemModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveItem}
          item={editingItem}
          mode={modalMode}
        />
      </div>
    </div>
  );
};

export default Index;