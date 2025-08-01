import { pgTable, text, serial, integer, boolean, real, timestamp, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const weatherData = pgTable("weather_data", {
  id: serial("id").primaryKey(),
  location: text("location").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD format
  temperatureHigh: real("temperature_high").notNull(),
  temperatureLow: real("temperature_low").notNull(),
  uvIndex: real("uv_index"),
  precipitationSum: real("precipitation_sum").notNull(),
  weatherCode: integer("weather_code").notNull(),
  condition: text("condition").notNull(), // sunny, cloudy, rainy, etc.
  cached_at: timestamp("cached_at").defaultNow(),
}, (table) => ({
  uniqueLocationDate: unique().on(table.location, table.date),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWeatherSchema = createInsertSchema(weatherData).omit({
  id: true,
  cached_at: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertWeather = z.infer<typeof insertWeatherSchema>;
export type WeatherData = typeof weatherData.$inferSelect;

// Weather API response types
export const weatherForecastSchema = z.object({
  location: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  daily: z.array(z.object({
    date: z.string(),
    temperatureHigh: z.number(),
    temperatureLow: z.number(),
    uvIndex: z.number().optional(),
    precipitationSum: z.number(),
    weatherCode: z.number(),
    condition: z.string(),
  }))
});

export type WeatherForecast = z.infer<typeof weatherForecastSchema>;
