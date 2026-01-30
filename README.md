# Packing Assistant

A smart travel companion that helps users pack efficiently and confidently for any trip. By leveraging weather data, AI recommendations, and intelligent algorithms, Packing Assistant eliminates the stress of forgetting items or overpacking.

## 🌟 Features

### Smart Packing List Generator
- **Intelligent Analysis**: Analyzes weather, trip duration, and activities to generate personalized packing lists
- **Weather Integration**: Real-time weather data from Open-Meteo API for accurate forecasting (up to 16 days ahead)
- **Activity-Based Recommendations**: Customizes suggestions based on trip type (business, leisure, adventure)
- **Luggage Optimization**: Adjusts recommendations based on luggage size (carry-on, backpack, medium/large suitcase)

### Daily Clothing Suggestions
- Morning, daytime, and evening outfit recommendations
- Weather-appropriate clothing based on temperature, UV index, and precipitation
- Activity-specific gear suggestions (hiking, swimming, business meetings, etc.)

### AI-Powered Recommendations (Optional)
- Enhanced recommendations using OpenAI GPT-4
- Detailed packing lists with priorities and reasoning
- Space optimization tips for efficient packing

## 🛠️ Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Hook Form** + Zod for form validation
- **Wouter** for routing
- **Radix UI** for accessible components

### Backend
- **Express.js** with TypeScript
- **SQLite** with better-sqlite3 (local development)
- **Drizzle ORM** for type-safe database queries
- **Open-Meteo API** for weather data
- **OpenAI API** for AI-powered recommendations (optional)

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/zyshii/packing-assistant.git
   cd packing-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npm run db:push
   ```
   This creates a local SQLite database (`local.db`) with the required schema.

4. **(Optional) Configure OpenAI API**

   If you want to use AI-powered recommendations, create a `.env` file:
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   ```

   **Note:** The app works without an OpenAI API key - it will use the built-in smart recommendation engine instead.

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:5000](http://localhost:5000)

## 📝 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Type check with TypeScript
- `npm run db:push` - Push database schema changes

## 🌐 Live Demo

Visit the live application: [https://packing-assistant.replit.app](https://packing-assistant.replit.app)

## 📖 Documentation

For detailed product specifications and roadmap, visit the [Project Wiki](https://leahshi.notion.site/Packing-Assistant-241f135990e980d2a71cf37b03699013?source=copy_link).

## 🎯 User Experience

### Creating a Packing List

1. **Enter Trip Details**: Destination, dates, trip type, and luggage size
2. **Select Activities**: Choose daily activities for personalized gear recommendations
3. **Review Weather**: Automatic weather forecast integration
4. **Get Your List**: Receive a tailored packing list with quantities and priorities

### Key Benefits

- **Stress Reduction**: Eliminate last-minute packing anxiety
- **Confidence Boost**: Never forget essential items
- **Smart Optimization**: Pack efficiently based on luggage constraints
- **Weather-Ready**: Prepare for any weather conditions

## 🗺️ Roadmap

- [ ] Enhanced clothing calculation algorithms
- [ ] Save & export functionality for packing lists
- [ ] Packing reminders and notifications
- [ ] Multi-trip and group travel management
- [ ] Mobile app version
- [ ] Offline mode support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev/) for rapid prototyping
- Weather data powered by [Open-Meteo API](https://open-meteo.com/)
- AI recommendations powered by [OpenAI](https://openai.com/)
- UI components from [Radix UI](https://www.radix-ui.com/) and [shadcn/ui](https://ui.shadcn.com/)

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

Made with ❤️ for stress-free travel
