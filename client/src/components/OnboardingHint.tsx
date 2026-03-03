import { useState, useEffect } from "react";

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
    <div className={`bg-[#f0e2bb] flex items-center gap-3 p-3.5 rounded-xl ${className || ''}`}>
      <div className="bg-[#ce8020] flex items-center justify-center rounded-lg shrink-0 size-9">
        <span className="text-[18px]">💡</span>
      </div>
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <p className="font-body font-bold text-[#3a2a1a] text-[13px]">
          {title}
        </p>
        <p className="font-body text-[#7a6e5a] text-[12px] leading-[1.5]">
          {description}
        </p>
      </div>
      <button
        onClick={handleDismiss}
        className="text-[#a09282] hover:text-[#7a6e5a] shrink-0 text-[18px] leading-none transition-colors px-1"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
