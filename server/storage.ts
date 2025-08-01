import { users, weatherData, type User, type InsertUser, type WeatherData, type InsertWeather } from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Weather data methods
  getWeatherData(location: string, date: string): Promise<WeatherData | undefined>;
  getCachedWeatherData(location: string, startDate: string, endDate: string): Promise<WeatherData[]>;
  saveWeatherData(weather: InsertWeather): Promise<WeatherData>;
  saveMultipleWeatherData(weatherList: InsertWeather[]): Promise<WeatherData[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getWeatherData(location: string, date: string): Promise<WeatherData | undefined> {
    const [weather] = await db
      .select()
      .from(weatherData)
      .where(and(eq(weatherData.location, location), eq(weatherData.date, date)));
    return weather || undefined;
  }

  async getCachedWeatherData(location: string, startDate: string, endDate: string): Promise<WeatherData[]> {
    const weather = await db
      .select()
      .from(weatherData)
      .where(
        and(
          eq(weatherData.location, location),
          gte(weatherData.date, startDate),
          lte(weatherData.date, endDate)
        )
      );
    return weather;
  }

  async saveWeatherData(weather: InsertWeather): Promise<WeatherData> {
    const [savedWeather] = await db
      .insert(weatherData)
      .values(weather)
      .returning();
    return savedWeather;
  }

  async saveMultipleWeatherData(weatherList: InsertWeather[]): Promise<WeatherData[]> {
    const savedWeatherList = await db
      .insert(weatherData)
      .values(weatherList)
      .returning();
    return savedWeatherList;
  }
}

export const storage = new DatabaseStorage();
