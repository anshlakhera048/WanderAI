import React from "react";
import HotelCardItem from "./HotelCardItem";
import { motion } from "framer-motion";

function Hotels({ trip }) {
  const hotelImages = [
    "/h (1).jpg",
    "/h (2).jpg",
    "/h (3).jpg",
    "/h (4).jpg",
    "/h (5).jpg",
    "/h (6).jpg",
    "/h (7).jpg",
    "/h (8).jpg",
    "/h (9).jpg",
  ];

  console.log('Hotels component - trip data:', trip?.tripData?.hotelOptions); // Debug log

  return (
    <div className="mt-12 bg-white dark:bg-gray-900 p-6 rounded-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary to-secondary">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Hotel Recommendations
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Handpicked stays for your comfort</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(trip?.tripData?.hotelOptions) && trip.tripData.hotelOptions.length > 0 ? (
          trip.tripData.hotelOptions.map((hotel, index) => {
            const randomImage =
              hotelImages[Math.floor(Math.random() * hotelImages.length)];
            return (
              <div key={hotel?.id || index}>
                <HotelCardItem
                  hotel={hotel}
                  index={index}
                  randomImage={randomImage}
                />
              </div>
            );
          })
        ) : (
          <div className="col-span-full bg-gray-100 dark:bg-gray-800 rounded-2xl p-12 text-center border-4 border-dashed border-gray-400 dark:border-gray-600">
            <div className="text-6xl mb-4">🏨</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No hotel recommendations found</h3>
            <p className="text-gray-600 dark:text-gray-400">Hotels will appear here once your trip is planned</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Hotels;
