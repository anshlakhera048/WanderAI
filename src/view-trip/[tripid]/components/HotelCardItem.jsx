import { GetPlaceDetails, PHOTO_REF_URL } from "@/services/GlobalApi";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function HotelCardItem({ hotel, randomImage, index }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    hotel && GetPlacePhoto();
  }, [hotel]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: hotel?.hotelName,
    };
    await GetPlaceDetails(data).then((resp) => {
      const photo = resp?.data?.places?.[0]?.photos?.[8]?.name;
      if (photo) {
        const photoUrl = PHOTO_REF_URL.replace("{NAME}", photo);
        setPhotoUrl(photoUrl);
      }
    });
  };

  console.log('Rendering hotel:', hotel?.hotelName); // Debug log

  return (
    <Link
      key={hotel?.id || index}
      to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        hotel?.hotelName + ", " + hotel?.hotelAddress
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <div className="group rounded-xl overflow-hidden border-4 border-primary dark:border-accent bg-white dark:bg-gray-900 shadow-2xl hover:shadow-[0_20px_50px_rgba(99,102,241,0.4)] transition-all duration-300 hover:scale-105">
        <div className="relative overflow-hidden bg-gray-200 dark:bg-gray-800">
          <img
            src={photoUrl || randomImage}
            alt="Hotel"
            className="h-[200px] w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="p-5 space-y-3 bg-white dark:bg-gray-900">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2">
            {hotel?.hotelName}
          </h2>
          <div className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
            <span className="text-primary dark:text-accent flex-shrink-0 text-lg">📍</span>
            <p className="line-clamp-2">{hotel?.hotelAddress}</p>
          </div>
          <div className="flex items-center justify-between pt-3 border-t-2 border-gray-200 dark:border-gray-700">
            <span className="text-base font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-lg">
              {hotel?.price}
            </span>
            <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/30 px-3 py-1 rounded-lg">
              <span className="text-yellow-500 text-lg">⭐</span>
              <span className="text-base font-bold text-gray-900 dark:text-white">{hotel?.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default HotelCardItem;
