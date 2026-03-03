import { useState, useMemo } from "react";
import { Check, ChevronDown, AlertCircle } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchDailyRecommendations, fetchPackingOptimization } from "@/lib/aiRecommendationApi";
import type { TripContext } from "@shared/schema";
import { cn } from "@/lib/utils";

interface DailyClothingData {
  date: string;
  destination?: string;
  legIndex?: number;
  condition: "sunny" | "cloudy" | "mixed" | "rainy" | "snowy";
  temp: { high: number; low: number };
  uvIndex?: number;
  precipitation: number;
  activities: string[];
}

interface TripTimelineProps {
  dailyData: DailyClothingData[];
  tripDetails: {
    destination: string;
    luggageSize?: string;
    tripTypes?: string[];
    duration: number;
    destinations?: Array<{ destination: string; startDate: string; endDate: string }>;
  };
  isWeatherDataReal?: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_DAYS = 2;

const LUGGAGE_LABELS: Record<string, string> = {
  "carry-on": "Carry-on",
  backpack: "Backpack",
  "medium-suitcase": "Medium Suitcase",
  "large-suitcase": "Large Suitcase",
  standard: "Standard",
};

const CATEGORY_CONFIG = [
  { key: "tops", title: "Tops", emoji: "👕", iconBg: "bg-[#dbeafe]" },
  { key: "bottoms", title: "Bottoms", emoji: "👖", iconBg: "bg-[#dcf5e7]" },
  { key: "outerwear", title: "Outerwear", emoji: "🧥", iconBg: "bg-[#ede9fe]" },
  { key: "footwear", title: "Footwear", emoji: "👞", iconBg: "bg-[#fef3c7]" },
  { key: "accessories", title: "Accessories", emoji: "✨", iconBg: "bg-[#fce7f3]" },
  { key: "essentials", title: "Essentials", emoji: "🎒", iconBg: "bg-[#ccfbf1]" },
] as const;

const LEG_DOT_COLORS = [
  "bg-[#3e7050]",
  "bg-[#ce8020]",
  "bg-[#7B6E8C]",
  "bg-blue-500",
  "bg-rose-500",
];
const LEG_STEM_COLORS = [
  "bg-[#3e7050]",
  "bg-[#ce8020]",
  "bg-[#7B6E8C]",
  "bg-blue-400",
  "bg-rose-400",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getWeatherEmoji = (condition: string): string => {
  switch (condition.toLowerCase()) {
    case "sunny":
    case "clear":
      return "☀️";
    case "rainy":
    case "rain":
      return "🌧️";
    case "cloudy":
    case "overcast":
      return "☁️";
    case "mixed":
    case "partly cloudy":
      return "⛅";
    case "snowy":
    case "snow":
      return "🌨️";
    default:
      return "🌤️";
  }
};

const formatCondition = (condition: string): string => {
  const map: Record<string, string> = {
    sunny: "Sunny",
    clear: "Clear",
    rainy: "Rainy",
    rain: "Rainy",
    cloudy: "Cloudy",
    overcast: "Overcast",
    mixed: "Partly Cloudy",
    "partly cloudy": "Partly Cloudy",
    snowy: "Snowy",
    snow: "Snowy",
  };
  return (
    map[condition.toLowerCase()] ||
    condition.charAt(0).toUpperCase() + condition.slice(1)
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function TripTimeline({
  dailyData,
  tripDetails,
}: TripTimelineProps) {
  const queryClient = useQueryClient();

  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({ tops: true });
  const [packedItems, setPackedItems] = useState<Set<string>>(new Set());
  const [showAllDays, setShowAllDays] = useState(false);

  const togglePacked = (key: string) => {
    setPackedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const tripContext: TripContext = useMemo(
    () => ({
      destination: tripDetails.destination,
      destinations: tripDetails.destinations,
      duration: tripDetails.duration || dailyData.length,
      tripTypes: tripDetails.tripTypes || ["leisure"],
      luggageSize: tripDetails.luggageSize || "standard",
      dailyData: dailyData.map((day) => ({
        date: day.date,
        destination: day.destination,
        condition: day.condition,
        temp: day.temp,
        uvIndex: day.uvIndex,
        precipitation: day.precipitation,
        activities: day.activities,
      })),
    }),
    [dailyData, tripDetails]
  );

  const {
    data: smartDailyRecommendations,
    isLoading: isLoadingDaily,
    error: dailyError,
    refetch: refetchDaily,
  } = useQuery({
    queryKey: ["smart-daily-recommendations", tripContext],
    queryFn: () => fetchDailyRecommendations(tripContext),
    enabled: dailyData.length > 0 && !!tripDetails.destination,
    staleTime: 10 * 60 * 1000,
    retry: 3,
  });

  const {
    data: smartPackingOptimization,
    isLoading: isLoadingPacking,
    error: packingError,
  } = useQuery({
    queryKey: ["smart-packing-optimization", tripContext],
    queryFn: () => fetchPackingOptimization(tripContext, []),
    enabled: dailyData.length > 0 && !!tripDetails.destination,
    staleTime: 10 * 60 * 1000,
  });

  const isTransitionDay = (index: number): boolean => {
    if (index === 0) return false;
    return dailyData[index].destination !== dailyData[index - 1].destination;
  };

  if (!dailyData || dailyData.length === 0) {
    return (
      <div className="bg-[#f9f6e8] rounded-xl p-12 text-center">
        <p className="font-body text-[#7a6e5a]">Loading daily suggestions...</p>
      </div>
    );
  }

  const visibleDays = showAllDays ? dailyData : dailyData.slice(0, INITIAL_DAYS);
  const remainingDays = dailyData.length - INITIAL_DAYS;
  const hasMultipleDestinations = (tripDetails.destinations?.length || 0) > 1;
  const luggageLabel =
    LUGGAGE_LABELS[tripDetails.luggageSize || ""] ||
    tripDetails.luggageSize ||
    "Standard";
  const primaryDestination =
    tripDetails.destinations?.[0]?.destination || tripDetails.destination;

  return (
    <div className="flex gap-6 items-start">
      {/* ── Left column: Packing List ───────────────────────────────────────── */}
      <div className="flex flex-col gap-4 w-[400px] shrink-0">
        {/* Header */}
        <div className="flex items-center gap-2 leading-normal">
          <span className="font-display font-bold text-[18px] text-[#3a2a1a]">
            Packing List
          </span>
          <span className="flex-1 font-body text-[12px] text-[#a09282] text-right">
            {luggageLabel}
          </span>
        </div>

        {/* Loading */}
        {isLoadingPacking && (
          <div className="bg-[#f9f6e8] rounded-xl p-8 flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#3e7050]/20 border-t-[#3e7050]" />
            <p className="font-body text-[13px] text-[#a09282]">
              Analyzing your trip...
            </p>
          </div>
        )}

        {/* Error */}
        {!isLoadingPacking && packingError && (
          <div className="bg-[#f9f6e8] rounded-xl p-6 text-center flex flex-col items-center gap-3">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <p className="font-body text-[13px] text-[#a09282]">
              Unable to generate packing list.
            </p>
            <button
              onClick={() =>
                queryClient.invalidateQueries({
                  queryKey: ["smart-packing-optimization"],
                })
              }
              className="font-body font-semibold text-[13px] text-[#3e7050] hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Category accordion cards */}
        {!isLoadingPacking &&
          smartPackingOptimization &&
          CATEGORY_CONFIG.map((cat) => {
            const items: Array<{ item: string; quantity: number }> =
              (smartPackingOptimization.optimizedList as any)[cat.key] || [];
            if (items.length === 0) return null;

            const isExpanded = expandedCategories[cat.key] ?? false;
            const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

            return (
              <div
                key={cat.key}
                className="bg-[#f9f6e8] rounded-[12px] overflow-hidden"
              >
                {/* Category header */}
                <button
                  onClick={() =>
                    setExpandedCategories((prev) => ({
                      ...prev,
                      [cat.key]: !prev[cat.key],
                    }))
                  }
                  className="flex items-center gap-[10px] px-4 py-[14px] w-full hover:bg-black/[0.02] transition-colors"
                >
                  <div
                    className={cn(
                      "flex items-center justify-center rounded-[8px] size-8 shrink-0",
                      cat.iconBg
                    )}
                  >
                    <span className="text-[16px] leading-none">{cat.emoji}</span>
                  </div>
                  <span className="flex-1 font-body font-bold text-[14px] text-[#3a2a1a] text-left">
                    {cat.title}
                  </span>
                  <span className="font-body text-[12px] text-[#a09282] shrink-0">
                    {totalItems} item{totalItems !== 1 ? "s" : ""}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-[#a09282] shrink-0 transition-transform duration-200",
                      !isExpanded && "-rotate-90"
                    )}
                  />
                </button>

                {/* Items */}
                {isExpanded && (
                  <div className="pb-2">
                    {items.map((item, idx) => {
                      const key = `${cat.key}-${idx}`;
                      const isPacked = packedItems.has(key);
                      return (
                        <div
                          key={key}
                          className="flex items-center gap-[10px] px-4 py-[10px] hover:bg-black/[0.02] transition-colors"
                        >
                          <button
                            onClick={() => togglePacked(key)}
                            className={cn(
                              "rounded-[4px] size-[18px] shrink-0 flex items-center justify-center transition-colors",
                              isPacked ? "bg-[#3e7050]" : "bg-[#eae4d1]"
                            )}
                          >
                            {isPacked && (
                              <Check
                                className="h-3 w-3 text-white"
                                strokeWidth={3}
                              />
                            )}
                          </button>
                          <span
                            className={cn(
                              "font-body text-[13px] flex-1 leading-normal",
                              isPacked
                                ? "text-[#a09282] line-through"
                                : "text-[#3a2a1a]"
                            )}
                          >
                            {item.quantity > 1
                              ? `${item.item} × ${item.quantity}`
                              : item.item}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

        {/* Packing tips */}
        {!isLoadingPacking &&
          (smartPackingOptimization?.luggageOptimization?.packingTips?.length ??
            0) > 0 && (
            <div className="bg-[#fffbeb] rounded-[12px] p-4 border border-[#f0e2bb]">
              <p className="font-body font-semibold text-[12px] text-[#ce8020] mb-2">
                💡 Packing Tips
              </p>
              <ul className="flex flex-col gap-1">
                {smartPackingOptimization!.luggageOptimization.packingTips.map(
                  (tip: string, i: number) => (
                    <li
                      key={i}
                      className="font-body text-[12px] text-[#7a6e5a] leading-[1.5] flex items-start gap-1.5"
                    >
                      <span className="text-[#ce8020] shrink-0 mt-0.5">•</span>
                      <span>{tip}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
      </div>

      {/* ── Right column: Daily Clothing Timeline ───────────────────────────── */}
      <div className="flex-1 bg-[#f9f6e8] rounded-[16px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-[10px] px-6 py-[18px]">
          <span className="text-[20px] leading-none shrink-0">📅</span>
          <span className="font-display font-bold text-[18px] text-[#3a2a1a] shrink-0">
            Daily Clothing Timeline
          </span>
          <span className="font-body text-[13px] text-[#7a6e5a] truncate">
            {primaryDestination.split(",")[0]}
            {hasMultipleDestinations &&
              ` + ${tripDetails.destinations!.length - 1} more`}
          </span>
        </div>

        {/* Divider */}
        <div className="bg-[#c9c1a8] h-px" />

        {/* Body */}
        <div className="px-6 py-4">
          {/* Daily error */}
          {dailyError && !isLoadingDaily && (
            <div className="flex items-center gap-3 bg-destructive/5 border border-destructive/20 rounded-xl px-4 py-3 mb-4">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
              <span className="font-body text-[13px] text-foreground flex-1">
                Unable to load daily recommendations.
              </span>
              <button
                onClick={() => refetchDaily()}
                className="font-body font-semibold text-[13px] text-[#3e7050] hover:underline shrink-0"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading */}
          {isLoadingDaily ? (
            <div className="flex flex-col items-center py-12 text-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#3e7050]/20 border-t-[#3e7050]" />
              <p className="font-body text-[13px] text-[#a09282]">
                Building your daily timeline...
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {visibleDays.map((day, dayIndex) => {
                const smartDay = smartDailyRecommendations?.find(
                  (s: any) => s.date === day.date
                );
                const legIdx = day.legIndex ?? 0;
                const dotColor = LEG_DOT_COLORS[legIdx % LEG_DOT_COLORS.length];
                const stemColor =
                  LEG_STEM_COLORS[legIdx % LEG_STEM_COLORS.length];
                const isLastVisible =
                  dayIndex === visibleDays.length - 1 &&
                  (showAllDays || remainingDays <= 0);

                return (
                  <div key={dayIndex} className="flex gap-4">
                    {/* Timeline track */}
                    <div className="flex flex-col items-center w-6 shrink-0">
                      <div
                        className={cn(
                          "rounded-full size-[14px] shrink-0 mt-[15px]",
                          dotColor
                        )}
                      />
                      {!isLastVisible && (
                        <div
                          className={cn(
                            "w-[2px] flex-1 opacity-30 min-h-[24px]",
                            stemColor
                          )}
                        />
                      )}
                    </div>

                    {/* Day content */}
                    <div className="flex-1 pb-6">
                      {/* Destination transition marker */}
                      {isTransitionDay(dayIndex) && (
                        <div className="flex items-center gap-2 mb-3">
                          <span className="font-body text-[11px] text-[#a09282] bg-[#eae4d1] px-2.5 py-1 rounded-full">
                            ✈️ Arriving in {day.destination?.split(",")[0]}
                          </span>
                        </div>
                      )}

                      {/* Day header */}
                      <div className="flex items-center gap-[10px] mb-3 leading-normal">
                        <span className="font-body font-bold text-[14px] text-[#3a2a1a] flex-1">
                          Day {dayIndex + 1}{"  ·  "}{day.date}
                        </span>
                        <div className="bg-[#eae4d1] flex items-center gap-1 px-[10px] py-1 rounded-full shrink-0">
                          <span className="text-[13px] leading-none">
                            {getWeatherEmoji(day.condition)}
                          </span>
                          <span className="font-body text-[12px] text-[#7a6e5a] whitespace-nowrap">
                            {Math.round(day.temp.high)}°F ·{" "}
                            {formatCondition(day.condition)}
                          </span>
                        </div>
                      </div>

                      {/* Activities */}
                      {day.activities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {day.activities.map((act, i) => (
                            <span
                              key={i}
                              className="font-body text-[11px] text-[#356d80] bg-[#eaf3fb] px-2 py-0.5 rounded-full"
                            >
                              {act}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Travel day notice */}
                      {isTransitionDay(dayIndex) && (
                        <div className="bg-[#fffbeb] rounded-[10px] p-3 border border-[#f0e2bb] mb-3">
                          <p className="font-body text-[11px] text-[#ce8020]">
                            🧳 Travel day — wear comfortable, layered clothing. Keep weather-appropriate items for {day.destination?.split(",")[0]} accessible.
                          </p>
                        </div>
                      )}

                      {/* 3 time-of-day sub-cards */}
                      {smartDay && !dailyError ? (
                        <div className="grid grid-cols-3 gap-2">
                          {/* Morning */}
                          <div className="bg-[#eaf3fb] rounded-[10px] p-[10px] flex flex-col gap-1.5">
                            <span className="font-body font-bold text-[10px] text-[#356d80] whitespace-nowrap">
                              Morning ·{" "}
                              {Math.round(
                                day.temp.low +
                                  (day.temp.high - day.temp.low) * 0.2
                              )}
                              °F
                            </span>
                            <div className="font-body text-[11px] text-[#7a6e5a] leading-[1.6]">
                              {smartDay.recommendations?.morning?.length > 0 ? (
                                smartDay.recommendations.morning.map(
                                  (item: string, i: number) => (
                                    <p key={i}>{item}</p>
                                  )
                                )
                              ) : (
                                <p className="italic opacity-70">
                                  Standard outfit
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Daytime */}
                          <div className="bg-[#fffbeb] rounded-[10px] p-[10px] flex flex-col gap-1.5">
                            <span className="font-body font-bold text-[10px] text-[#ce8020] whitespace-nowrap">
                              Daytime · {Math.round(day.temp.high)}°F
                            </span>
                            <div className="font-body text-[11px] text-[#7a6e5a] leading-[1.6]">
                              {smartDay.recommendations?.daytime?.length > 0 ? (
                                smartDay.recommendations.daytime.map(
                                  (item: string, i: number) => (
                                    <p key={i}>
                                      {item.replace(
                                        /^[+-]\s*(Remove|Add)\s*/,
                                        ""
                                      )}
                                    </p>
                                  )
                                )
                              ) : (
                                <p className="italic opacity-70">
                                  Keep base layers
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Evening */}
                          <div className="bg-[#dbeafe] rounded-[10px] p-[10px] flex flex-col gap-1.5">
                            <span className="font-body font-bold text-[10px] text-[#1d4ed8] whitespace-nowrap">
                              Evening ·{" "}
                              {Math.round(
                                day.temp.low +
                                  (day.temp.high - day.temp.low) * 0.7
                              )}
                              °F
                            </span>
                            <div className="font-body text-[11px] text-[#7a6e5a] leading-[1.6]">
                              {smartDay.recommendations?.evening?.length > 0 ? (
                                smartDay.recommendations.evening.map(
                                  (item: string, i: number) => (
                                    <p key={i}>
                                      {item.replace(
                                        /^[+-]\s*(Remove|Add)\s*/,
                                        ""
                                      )}
                                    </p>
                                  )
                                )
                              ) : (
                                <p className="italic opacity-70">
                                  Base layers sufficient
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        !isLoadingDaily && (
                          <div className="bg-[#eae4d1] rounded-[10px] p-3">
                            <p className="font-body text-[11px] text-[#a09282]">
                              {day.temp.low < 50
                                ? "Long-sleeve shirts and jacket recommended. "
                                : ""}
                              {day.temp.high >= 80
                                ? "Light, breathable clothing. "
                                : ""}
                              {day.condition === "rainy"
                                ? "Waterproof jacket and closed shoes. "
                                : ""}
                              Outfit details loading...
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                );
              })}

              {/* "X more days" expand button */}
              {!showAllDays && remainingDays > 0 && (
                <button
                  onClick={() => setShowAllDays(true)}
                  className="bg-[#eae4d1] flex items-center justify-center gap-2 px-3 py-[10px] rounded-[10px] w-full hover:bg-[#ddd7c5] transition-colors mt-2"
                >
                  <ChevronDown className="h-5 w-5 text-[#a09282]" />
                  <span className="font-body text-[12px] text-[#a09282]">
                    {remainingDays} more day{remainingDays !== 1 ? "s" : ""}
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
