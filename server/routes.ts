import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getWeatherForecast } from "./weatherService";
import { z } from "zod";

const weatherRequestSchema = z.object({
  location: z.string().min(1, "Location is required"),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format"),
  useCache: z.boolean().optional().default(true)
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

  const httpServer = createServer(app);

  return httpServer;
}
