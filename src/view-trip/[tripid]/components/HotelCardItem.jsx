import { GetPlaceDetails, PHOTO_REF_URL } from "@/services/GlobalApi";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function HotelCardItem({ hotel, randomImage, index }) {

    const [photoUrl,setPhotoUrl] = useState();

    useEffect(() => {
    hotel && GetPlacePhoto();
    }, [hotel])

    const GetPlacePhoto = async () => {
    const data = {
        textQuery: hotel?.hotelName,
    };
    const result = await GetPlaceDetails(data).then((resp) => {
        console.log(resp.data.places[0].photos[6].name);

        const photoUrl = PHOTO_REF_URL.replace('{NAME}',resp.data.places[0].photos[8].name);
        setPhotoUrl(photoUrl);
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
      <div className="rounded-lg p-2 hover:scale-105 transition-all cursor-pointer">
        <img
          src={photoUrl?photoUrl:randomImage}
          className="rounded-lg h-[150px] w-[380px] object-cover object-bottom"
          alt="Hotel"
        />
        <div className="my-3">
          <h2 className="font-medium text-black">{hotel?.hotelName}</h2>
          <h2 className="text-xs text-gray-600">📍{hotel?.hotelAddress}</h2>
          <h2 className="text-sm text-black font-semibold">💸{hotel?.price}</h2>
          <h2 className="text-sm text-black font-semibold">🌟{hotel?.rating}</h2>
        </div>
      </div>
    </Link>
  );
}

export default HotelCardItem;
