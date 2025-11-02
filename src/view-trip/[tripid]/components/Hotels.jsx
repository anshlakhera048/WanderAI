import React from "react";
import HotelCardItem from "./HotelCardItem";

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

  return (
    <div className="mt-8">
      <h2 className="font-bold text-xl sm:text-2xl mb-4">
        Hotel Recommendations
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-4 rounded-xl bg-blue-50 border">
        {Array.isArray(trip?.tripData?.hotelOptions) ? (
          trip.tripData.hotelOptions.map((hotel, index) => {
            const randomImage =
              hotelImages[Math.floor(Math.random() * hotelImages.length)];
            return (
              <HotelCardItem
                key={hotel?.id || index}
                hotel={hotel}
                index={index}
                randomImage={randomImage}
              />
            );
          })
        ) : (
          <p className="text-gray-600 text-sm">
            No hotel recommendations found
          </p>
        )}
      </div>
    </div>
  );
}

export default Hotels;
