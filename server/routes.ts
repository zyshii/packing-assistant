import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getWeatherForecast } from "./weatherService";
import { generateDailyClothingRecommendations, optimizePackingList, getActivitySpecificRecommendations } from "./aiRecommendationService";
import { aiRecommendationRequestSchema } from "@shared/schema";
import { z } from "zod";

const weatherRequestSchema = z.object({
  location: z.string().min(1, "Location is required"),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format"),
  useCache: z.string().optional().default("true").transform((val) => val === 'true')
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Weather API routes
  app.get("/api/weather", async (req, res) => {
    try {
      const { location, startDate, endDate, useCache } = weatherRequestSchema.parse(req.query);
      
      // Validate date range
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (start > end) {
        return res.status(400).json({ 
          error: "Start date must be before or equal to end date" 
        });
      }
      
      // Check if end date is within Open-Meteo's allowed range
      const maxAllowedDate = new Date('2025-08-16'); // Based on API error message
      if (end > maxAllowedDate) {
        return res.status(400).json({ 
          error: `Weather forecasts are only available until ${maxAllowedDate.toISOString().split('T')[0]}. Please select an earlier end date.` 
        });
      }
      
      // Limit to 14 days to prevent abuse
      const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff > 14) {
        return res.status(400).json({ 
          error: "Date range cannot exceed 14 days" 
        });
      }
      
      const weatherForecast = await getWeatherForecast(location, startDate, endDate, useCache);
      res.json(weatherForecast);
      
    } catch (error) {
      console.error("Weather API error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid request parameters", 
          details: error.errors 
        });
      }
      
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to fetch weather data" 
      });
    }
  });

  // Get cached weather data for a specific location and date range
  app.get("/api/weather/cache/:location", async (req, res) => {
    try {
      const { location } = req.params;
      const { startDate, endDate } = z.object({
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
      }).parse(req.query);
      
      const cachedData = await storage.getCachedWeatherData(
        decodeURIComponent(location), 
        startDate, 
        endDate
      );
      
      res.json({ cached: cachedData });
      
    } catch (error) {
      console.error("Cache API error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid request parameters", 
          details: error.errors 
        });
      }
      
      res.status(500).json({ 
        error: "Failed to fetch cached weather data" 
      });
    }
  });

  // AI Recommendations API routes
  app.post("/api/recommendations/daily", async (req, res) => {
    try {
      const validatedRequest = aiRecommendationRequestSchema.parse(req.body);
      
      const recommendations = await generateDailyClothingRecommendations(validatedRequest.tripContext);
      res.json({ dailyRecommendations: recommendations });
      
    } catch (error) {
      console.error("Daily recommendations API error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: error.errors 
        });
      }
      
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to generate daily recommendations" 
      });
    }
  });

  app.post("/api/recommendations/packing", async (req, res) => {
    try {
      const { tripContext, dailyRecommendations } = req.body;
      
      if (!tripContext || !dailyRecommendations) {
        return res.status(400).json({ 
          error: "Missing required fields: tripContext and dailyRecommendations" 
        });
      }
      
      const optimizedPacking = await optimizePackingList(tripContext, dailyRecommendations);
      res.json({ packingOptimization: optimizedPacking });
      
    } catch (error) {
      console.error("Packing optimization API error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to optimize packing list" 
      });
    }
  });

  app.post("/api/recommendations/activity", async (req, res) => {
    try {
      const { activities, weather, destination } = req.body;
      
      if (!activities || !weather || !destination) {
        return res.status(400).json({ 
          error: "Missing required fields: activities, weather, destination" 
        });
      }
      
      const recommendations = await getActivitySpecificRecommendations(activities, weather, destination);
      res.json({ activityRecommendations: recommendations });
      
    } catch (error) {
      console.error("Activity recommendations API error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to generate activity recommendations" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
