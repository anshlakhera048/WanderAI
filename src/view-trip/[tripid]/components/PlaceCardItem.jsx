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
    <div className="group rounded-2xl p-4 mt-2 flex flex-col sm:flex-row gap-5 card-hover border-2 border-primary/50 dark:border-accent/60 bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all cursor-pointer ring-1 ring-gray-200 dark:ring-gray-700">
      <div className="relative w-full sm:w-[200px] h-[220px] sm:h-[200px] flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={photoUrl ? photoUrl : "/imgg.png"}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
          alt={place.placeName}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="flex flex-col justify-between flex-1">
        <div>
          <h2 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-accent transition-colors">{place.placeName}</h2>
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{place.placeDetails}</p>
          
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full">
              <span className="text-primary dark:text-accent">⏱️</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{place.timeTravel}</span>
            </div>
            <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full">
              <span className="text-green-600 dark:text-green-400">💰</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{place.ticketPricing}</span>
            </div>
          </div>
        </div>

        <HoverCard>
          <HoverCardTrigger>
            <Link to={googleMapsUrl} target="_blank" rel="noopener noreferrer">
              <div className="flex items-center gap-2 py-2.5 px-4 bg-gradient-to-r from-primary to-secondary dark:from-accent dark:to-secondary rounded-xl w-fit mt-4 hover:shadow-lg hover:scale-105 transition-all group/btn">
                <FaMapLocationDot className="text-white text-lg transition" />
                <h2 className="text-sm font-semibold text-white transition">View on Map</h2>
              </div>
            </Link>
          </HoverCardTrigger>
          <HoverCardContent className="glass backdrop-blur-xl border-border">
            <p className="text-sm text-gray-900 dark:text-white">Click to view this location on Google Maps and get directions</p>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
}

export default PlaceCardItem;
