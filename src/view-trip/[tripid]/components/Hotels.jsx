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
    <div>
      <h2 className="font-bold text-2xl mt-3">Hotel Recommendations</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-5 border p-3 rounded-xl bg-blue-50">
        {trip?.tripData?.hotels?.map((hotel, index) => {
          const randomImage = hotelImages[Math.floor(Math.random() * hotelImages.length)];

          return (
            <HotelCardItem
              key={hotel?.id || index}
              hotel={hotel}
              index={index}
              randomImage={randomImage}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Hotels;
