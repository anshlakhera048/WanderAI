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

  return (
    <Link
      key={hotel?.id || index}
      to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        hotel?.hotelName + ", " + hotel?.hotelAddress
      )}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="rounded-xl p-3 hover:scale-105 transition-all cursor-pointer bg-white shadow-sm">
        <img
          src={photoUrl || randomImage}
          alt="Hotel"
          className="rounded-xl h-[150px] w-full object-cover object-bottom"
        />
        <div className="mt-3">
          <h2 className="font-semibold text-sm md:text-base text-black truncate">
            🏨 {hotel?.hotelName}
          </h2>
          <h2 className="text-xs text-gray-600 truncate">📍 {hotel?.hotelAddress}</h2>
          <h2 className="text-sm font-medium text-black mt-1">💸 {hotel?.price}</h2>
          <h2 className="text-sm font-medium text-black">🌟 {hotel?.rating}</h2>
        </div>
      </div>
    </Link>
  );
}

export default HotelCardItem;
