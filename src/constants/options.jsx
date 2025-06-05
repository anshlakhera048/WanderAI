export const SelectTravellersList = [
    {
        id:1,
        title: 'Just Me',
        desc: 'My Own Journey',
        icon: '😊',
        people: '1'
    },
    {
        id:2,
        title: 'Couple',
        desc: 'Romantic Getaway',
        icon: '💕',
        people: '2 people'
    },
    {
        id:3,
        title: 'Family',
        desc: 'Unforgettable Family Moments',
        icon: '👨‍👩‍👧‍👦',
        people: '3 to 5 people'
    },
    {
        id:4,
        title: 'Friends',
        desc: 'Adventure with Mates',
        icon: '🍟',
        people: '5 to 10 people'
    },
]

export const SelectBudgetOptions = [
    {
        id:1,
        title: 'Cheap',
        desc: 'Budget-Friendly Adventures',
        icon: '💰',
    },
    {
        id:2,
        title: 'Moderate',
        desc: 'Comfortable & Convenient',
        icon: '💸',
    },
    {
        id:3,
        title: 'Luxury',
        desc: 'Premium Experiences',
        icon: '🤑',
    },
]

// export const AI_PROMPT = "Generate Travel Plan for Location{location}, for total number of days {totalDays} for number of travellers{traveller} with a budget{budget}, give me Hotels options list with HotelName{hotelName}, Hotel address{hotelAddress}, Price{price}, hotel image url{hotelImageUrl}(should provide the link for the most famous image of that place), geo coordinates{geoCoordinates}, rating{rating} (Ex. 3,4,5,7 star hotel), descriptions{description} and suggest itinerary with placeName{placeName}, Place Details{placeDetails}, Place Image Url{placeImageUrl} (should provide the link for the most famous place that is known), Geo Coordinates{geoCoordinates}, ticket Pricing{ticketPricing}, Time travel{timeTravel} each of the location for {totalDays} days with each day plan with best time {bestTime} to visit that place(example: 9am-12am, 3pm-6pm etc.) in JSON format." 

export const AI_PROMPT = `
🔒 JSON FORMAT CONSTRAINTS (READ CAREFULLY):
- The output must be a valid JSON object.
- DO NOT change, rename, skip, omit, or reformat the following field names.
- These fields MUST BE PRESENT and must appear in this structure and casing every time.

For hotels, include these exact fields:
  - hotelName
  - hotelAddress
  - price(Strictly the price of hotel must be included with the respective currency)
  - hotelImageUrl
  - geoCoordinates
  - rating
  - description

For itinerary places, include these exact fields:
  - placeName
  - placeDetails
  - placeImageUrl
  - geoCoordinates
  - ticketPricing
  - timeTravel
  - bestTime(best time means, the time which is best to visit the place, wheter Morning, afternoon, evening, Night etc)

❗If any value is not available, return it as an empty string "" but DO NOT remove the key.

---

📍TASK:
Generate a detailed travel itinerary for the destination {location}, for a duration of {totalDays} days, tailored for {traveller} travellers and within a budget of {budget}.

1. 🏨 Provide a list of hotel options(Minimum 4 hotels must be there) with the exact fields above.
2. 📅 Suggest a full day-wise itinerary (covering all {totalDays} days). For each day's plan, include places with the exact place fields listed above.
3. 🎯 Use real locations, accurate or approximate prices, and appropriate visiting times.
4. 🖼️ hotelImageUrl and placeImageUrl must be links to the most iconic or popular image for that hotel or place.
5. 📌 geoCoordinates must be in "latitude,longitude" format.

Respond ONLY in the required JSON format. Never add explanations or comments.
`;
