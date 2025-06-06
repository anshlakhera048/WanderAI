import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaMapLocationDot } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { GetPlaceDetails, PHOTO_REF_URL } from "@/services/GlobalApi";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

function PlaceCardItem({ place, trip }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    place && GetPlacePhoto();
  }, [place]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: place.placeName,
    };
    try {
      const resp = await GetPlaceDetails(data);
      const url = PHOTO_REF_URL.replace(
        "{NAME}",
        resp.data.places[0].photos[6]?.name
      );
      setPhotoUrl(url);
    } catch (error) {
      console.error("Photo fetch failed", error);
    }
  };

  const location =
    trip?.tripData?.hotels?.map((ho) => ho.hotelAddress).join(", ") || "";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    place.placeName + "," + location
  )}`;

  return (
    <div className="rounded-xl p-3 mt-2 flex flex-col sm:flex-row gap-4 hover:scale-[1.02] transition-all cursor-pointer hover:shadow-md border bg-white">
      <img
        src={photoUrl ? photoUrl : "/imgg.png"}
        className="w-full sm:w-[180px] sm:h-[180px] object-cover rounded-xl"
        alt={place.placeName}
      />

      <div className="flex flex-col justify-between">
        <div>
          <h2 className="font-bold text-md sm:text-lg">{place.placeName}</h2>
          <p className="text-gray-600 text-sm mt-1">{place.placeDetails}</p>
          <h2 className="text-sm  text-gray-600 mt-2">
            Time to Travel : {place.timeTravel}
          </h2>
          <h2 className="text-sm font-semibold text-gray-600 mt-2">
            Cost: {place.ticketPricing}
          </h2>
        </div>

        <HoverCard>
          <HoverCardTrigger>
            <Link to={googleMapsUrl} target="_blank" rel="noopener noreferrer">
              <div className="flex items-center gap-2 py-2 px-3 bg-blue-500 rounded-xl w-fit mt-3 hover:bg-blue-600">
                <FaMapLocationDot className="text-white text-xl" />
                <h2 className="text-sm font-medium text-white">Location</h2>
              </div>
            </Link>
          </HoverCardTrigger>
          <HoverCardContent>
            Click on Location button for more Information about the Place
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
}

export default PlaceCardItem;
