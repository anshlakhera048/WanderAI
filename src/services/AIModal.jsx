import { GoogleGenerativeAI } from "@google/generative-ai"; 

const apiKey = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",  
};

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", 
  generationConfig
});

export const chatSession = model.startChat({
  generationConfig,
  // history: [
  //   {
  //     role: "user",
  //     parts: [
  //       {
  //         text: "Generate a travel plan for Location: Kota, Rajasthan, India, for 3 days for couple with Cheap budget, Give me a Hotels options list with HotelName, HotelAddress, Price, Rating, Description, and suggest Itinerary with PlaceName, PlaceDetails, ticket pricing, rating, Time to travel each of the location for 3 days with each day plan with best time to visit in JSON format",
  //       },
  //     ],
  //   },
  //   {
  //     role: "model",
  //     parts: [
  //       {
  //         text: '```json\n{\n  "hotelOptions": [\n    {\n      "hotelName": "Hotel Rajhans",\n      "hotelAddress": "16, Race Course Rd, Race Course, Indore, Madhya Pradesh 452001",\n      "price": "₹1000 - ₹2000",\n      "rating": "3.5",\n      "description": "A budget-friendly hotel with clean rooms and basic amenities. Good location close to the city center."\n    },\n    {\n      "hotelName": "Hotel The Grand",\n      "hotelAddress": "18, Race Course Rd, Race Course, Indore, Madhya Pradesh 452001",\n      "price": "₹1500 - ₹3000",\n      "rating": "4.0",\n      "description": "A comfortable hotel with spacious rooms, a restaurant, and good service. Ideal for a short stay."\n    },\n    {\n      "hotelName": "Hotel Atulya",\n      "hotelAddress": "89, Race Course Rd, Race Course, Indore, Madhya Pradesh 452001",\n      "price": "₹800 - ₹1500",\n      "rating": "3.0",\n      "description": "A basic but clean hotel with affordable rates. Convenient location for exploring the city."\n    }\n  ],\n  "itinerary": {\n    "day1": {\n      "plan": [\n        {\n          "placeName": "Rajwada Palace",\n          "placeDetails": "A grand 18th-century palace with intricate architecture. Explore the palace and learn about its history.",\n          "ticketPricing": "₹20 per person",\n          "rating": "4.5",\n          "timeToTravel": "2 hours"\n        },\n        {\n          "placeName": "Sarafa Bazaar",\n          "placeDetails": "A bustling market known for street food and jewelry. Enjoy local snacks and shop for souvenirs.",\n          "ticketPricing": "Free",\n          "rating": "4.0",\n          "timeToTravel": "3 hours"\n        }\n      ],\n      "bestTimeToVisit": "Morning to evening"\n    },\n    "day2": {\n      "plan": [\n        {\n          "placeName": "Kanch Mandir (Glass Temple)",\n          "placeDetails": "A unique temple made entirely of glass. Admire the intricate glasswork and peaceful atmosphere.",\n          "ticketPricing": "₹10 per person",\n          "rating": "4.0",\n          "timeToTravel": "1 hour"\n        },\n        {\n          "placeName": "Annapurna Temple",\n          "placeDetails": "A popular Hindu temple dedicated to Goddess Annapurna. Seek blessings and enjoy the serene ambiance.",\n          "ticketPricing": "Free",\n          "rating": "4.5",\n          "timeToTravel": "1 hour"\n        }\n      ],\n      "bestTimeToVisit": "Morning to evening"\n    },\n    "day3": {\n      "plan": [\n        {\n          "placeName": "Central Museum",\n          "placeDetails": "Learn about the history, art, and culture of Indore. Explore the exhibits and artifacts.",\n          "ticketPricing": "₹20 per person",\n          "rating": "3.5",\n          "timeToTravel": "2 hours"\n        },\n        {\n          "placeName": "Khajrana Ganesh Temple",\n          "placeDetails": "A renowned temple dedicated to Lord Ganesha. Seek blessings and experience the vibrant atmosphere.",\n          "ticketPricing": "Free",\n          "rating": "4.5",\n          "timeToTravel": "1 hour"\n        }\n      ],\n      "bestTimeToVisit": "Morning to evening"\n    }\n  }\n}\n```\n\n**Notes:**\n\n* The hotel prices are approximate and can vary depending on the season and availability.\n* The itinerary is just a suggestion and can be customized according to your preferences.\n* You can find more information about the places and attractions on the internet or travel websites.\n* It\'s recommended to book your accommodation and transport in advance, especially during peak season.\n* Consider using local transport like auto-rickshaws or buses to save money.\n* Don\'t forget to try the local street food!\n',
  //       },
  //     ],
  //   },
  // ],
});
