# 🌍 WanderAI - AI Powered Travel Planner
[Live demo](https://wander-ai-ten.vercel.app/)

WanderAI is an intelligent and responsive web app that helps users generate personalized trip itineraries based on their destination, duration, budget, and travel preferences. Using modern UI components and AI logic, WanderAI offers an easy and enjoyable trip planning experience.

![WanderAI Banner](./public/logoO.svg)

---

## ✨ Features

- 🧠 **AI-Powered Itinerary Generation**  
  Automatically generate a multi-day itinerary with places to visit, sorted by time of day.

- 🧳 **Travel Preferences Input**  
  Set your destination, number of days, budget, and travel companion type for tailored results.

- 🗺️ **Google Places Autocomplete**  
  Search destinations easily with smart suggestions.

- 🔐 **Secure Google Authentication**  
  Sign in using your Google account and access your saved trips.

- 📂 **My Trips Dashboard**  
  View, manage, and delete your saved trips with a clean UI.

- 🌗 **Dark & Light Theme Toggle**  
  Fully responsive design supporting both dark and light modes (powered by `shadcn/ui` theme system).

- 📱 **Mobile Responsive**  
  Seamlessly works on desktop, tablet, and mobile devices.

---

## 🛠️ Tech Stack

| Tool/Library           | Purpose                            |
|------------------------|------------------------------------|
| React + Vite           | Frontend framework and bundler     |
| Tailwind CSS           | Utility-first CSS framework        |
| Shadcn/UI              | Beautiful headless UI components   |
| Google OAuth + Places  | Auth & autocomplete functionality  |
| Axios                  | API requests                       |
| React Icons            | Icon set integration               |
| React Router DOM       | Client-side routing                |

---

## 📸 PDF View


- [**Home Page**](./public/4.pdf)

- [**Trip Preferences Page**](./public/2.pdf)

- [**Generated Trip Page**](./public/1.pdf)

- [**My Trips Dashboard**](./public/3.pdf)

---

## 🚀 Getting Started

### 1. Clone the Repo

```
git clone https://github.com/anshlakhera048/wanderai.git
cd wanderai
```

### 2. Install Dependencies

```
npm install
```

### 3. Setup Environment Variables
Create a .env file in the root and add:

```
VITE_GOOGLE_PLACE_API_KEY=your_google_places_api_key
VITE_GOOGLE_AUTH_CLIENT_ID=your_google_oauth_client_id
VITE_GOOGLE_GENAI_API_KEY=your_google_generative_ai_api_key
```

### 4. Run the App
```
npm run dev
The app will run on http://localhost/.
```

## 📁 Folder Structure

```
wanderai/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components (Button, Header, Footer)
│   ├── pages/              # Pages (CreateTrip, MyTrips, etc.)
│   ├── lib/                # Utility functions
│   ├── App.jsx             # Route Definitions
│   ├── main.jsx            # Entry Point
├── .env                    # Environment Variables
├── package.json            # NPM Dependencies
└── README.md               # Project Readme
```

## 💡 Future Improvements
 AI-enhanced hotel/food recommendations

 Editable itinerary steps

 Social sharing of trip plans

 Language & currency localization

 Export itinerary to PDF

## 🙋‍♂️ Author
Made with ❤️ by Ansh Lakhera
Proudly built as a passion project to make travel planning smarter, easier, and more enjoyable.

## 📜 License
This project is licensed under the MIT License – see the LICENSE file for details.