import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";

interface PackingProgressProps {
  totalItems: number;
  packedItems: number;
}

export default function PackingProgress({ totalItems, packedItems }: PackingProgressProps) {
  const progressPercentage = totalItems > 0 ? (packedItems / totalItems) * 100 : 0;
  
  return (
    <Card className="p-6 shadow-card border-0 bg-card">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Packing Progress</h2>
          <div className="flex items-center gap-2">
            {progressPercentage === 100 ? (
              <CheckCircle2 className="h-5 w-5 text-travel-green" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )}
            <span className="text-sm font-medium text-foreground">
              {packedItems} / {totalItems} items
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Progress value={progressPercentage} className="h-3" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {progressPercentage.toFixed(0)}% complete
            </span>
            <span className="text-travel-green font-medium">
              {totalItems - packedItems} items remaining
            </span>
          </div>
        </div>
        
        {progressPercentage === 100 && (
          <div className="p-3 bg-travel-green/20 rounded-lg border border-travel-green/30">
            <p className="text-travel-green font-medium text-center">
              🎉 All packed and ready to go!
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}