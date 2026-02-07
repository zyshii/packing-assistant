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
    <Card className={`p-4 bg-accent border border-primary/20 animate-fade-in ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 p-1.5 bg-primary/10 rounded-lg">
          <Lightbulb className="w-4 h-4 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-foreground mb-0.5">
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
          className="flex-shrink-0 h-auto p-1 hover:bg-primary/10"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
