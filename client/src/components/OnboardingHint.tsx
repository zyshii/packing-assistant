import { useState, useEffect } from "react";
import { X, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OnboardingHintProps {
  title: string;
  description: string;
  storageKey: string;
  className?: string;
}

export default function OnboardingHint({ 
  title, 
  description, 
  storageKey, 
  className 
}: OnboardingHintProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenHint = localStorage.getItem(storageKey);
    if (!hasSeenHint) {
      setIsVisible(true);
    }
  }, [storageKey]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(storageKey, 'true');
  };

  if (!isVisible) return null;

  return (
    <Card className={`p-4 bg-gradient-to-r from-travel-blue/10 to-travel-purple/10 border-travel-blue/30 animate-fade-in ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 p-1 bg-travel-blue/20 rounded-full">
          <Lightbulb className="w-4 h-4 text-travel-blue" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-foreground mb-1">
            {title}
          </h4>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="flex-shrink-0 h-auto p-1 hover:bg-travel-blue/20"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}