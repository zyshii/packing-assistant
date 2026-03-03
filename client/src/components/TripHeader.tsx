import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TripLegInfo {
  destination: string;
  dates: string;
}

interface TripHeaderProps {
  destination: string;
  dates: string;
  tripTypes?: string[];
  activities: string[];
  legs?: TripLegInfo[];
  totalDays?: number;
}

const legPalettes = [
  { bg: "bg-[rgba(62,112,80,0.13)]", dot: "bg-[#3e7050]", text: "text-[#3e7050]" },
  { bg: "bg-[rgba(206,128,32,0.13)]", dot: "bg-[#ce8020]", text: "text-[#ce8020]" },
  { bg: "bg-[rgba(123,110,140,0.13)]", dot: "bg-[#7B6E8C]", text: "text-[#7B6E8C]" },
  { bg: "bg-[rgba(59,130,246,0.13)]", dot: "bg-blue-500", text: "text-blue-600" },
  { bg: "bg-[rgba(239,68,68,0.13)]", dot: "bg-rose-500", text: "text-rose-600" },
];

const tripTypeEmoji: Record<string, string> = {
  leisure: "☀️",
  business: "💼",
  adventure: "⛰️",
};

export default function TripHeader({ destination, dates, tripTypes, activities, legs, totalDays }: TripHeaderProps) {
  const hasMultipleLegs = legs && legs.length > 1;

  return (
    <div className="bg-[#f9f6e8] flex flex-col gap-4 p-6 rounded-[16px] w-full">
      {/* Top row: icon + title/dates + trip type badges */}
      <div className="flex items-center gap-3 w-full">
        <span className="text-[24px] shrink-0 leading-none">📍</span>
        <div className="flex flex-col gap-[2px] flex-1 min-w-0">
          <h1 className="font-display font-bold text-[22px] text-[#3a2a1a] leading-tight">
            Trip Overview
          </h1>
          <p className="font-body text-[14px] text-[#7a6e5a]">
            {dates}
            {totalDays ? `  ·  ${totalDays} day${totalDays !== 1 ? "s" : ""} total` : ""}
          </p>
        </div>
        {tripTypes && tripTypes.length > 0 && (
          <div className="flex gap-2 shrink-0 flex-wrap justify-end">
            {tripTypes.map((type, i) => (
              <div key={i} className="bg-[#3e7050] flex items-center gap-1 px-3 py-[5px] rounded-full">
                <span className="text-[12px] leading-none">{tripTypeEmoji[type] || "🌟"}</span>
                <span className="font-body font-semibold text-[12px] text-white capitalize">{type}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legs row */}
      {hasMultipleLegs ? (
        <div className="flex items-center gap-2 flex-wrap">
          {legs.map((leg, i) => {
            const palette = legPalettes[i % legPalettes.length];
            return (
              <div key={i} className="flex items-center gap-2">
                <div className={cn("flex items-center gap-2 px-[14px] py-[6px] rounded-[20px]", palette.bg)}>
                  <div className={cn("flex items-center justify-center rounded-[10px] size-5 shrink-0", palette.dot)}>
                    <span className="font-body font-bold text-[11px] text-white leading-none">{i + 1}</span>
                  </div>
                  <span className={cn("font-body font-semibold text-[12px] whitespace-nowrap", palette.text)}>
                    {leg.destination.split(",")[0]} · {leg.dates}
                  </span>
                </div>
                {i < legs.length - 1 && <ArrowRight className="h-5 w-5 text-[#a09282] shrink-0" />}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-[14px] py-[6px] rounded-[20px] bg-[rgba(62,112,80,0.13)]">
            <div className="flex items-center justify-center rounded-[10px] size-5 bg-[#3e7050]">
              <span className="font-body font-bold text-[11px] text-white leading-none">1</span>
            </div>
            <span className="font-body font-semibold text-[12px] text-[#3e7050] whitespace-nowrap">
              {destination.split(",")[0]} · {dates}
            </span>
          </div>
        </div>
      )}

      {/* Activities row */}
      {activities && activities.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-body font-semibold text-[12px] text-[#a09282] whitespace-nowrap shrink-0">
            Activities:
          </span>
          {activities.map((act, i) => (
            <div key={i} className="bg-[#eae4d1] px-[10px] py-1 rounded-full">
              <span className="font-body text-[12px] text-[#7a6e5a]">{act}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
