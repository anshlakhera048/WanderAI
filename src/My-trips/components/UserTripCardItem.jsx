import { GetPlaceDetails, PHOTO_REF_URL } from "@/services/GlobalApi";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";

function UserTripCardItem({ trip, onDelete }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    if (trip?.userSelection?.location?.label) {
      GetPlacePhoto();
    }
  }, [trip]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: trip?.userSelection?.location?.label,
    };
    const result = await GetPlaceDetails(data).then((resp) => {
      const photoUrl = PHOTO_REF_URL.replace(
        "{NAME}",
        resp.data.places[0].photos[7].name
      );
      setPhotoUrl(photoUrl);
    });
  };

  const placeImages = [
    "/p (1).jpg",
    "/p (2).jpg",
    "/p (3).jpg",
    "/p (4).jpg",
    "/p (5).jpg",
    "/p (6).jpg",
    "/p (7).jpg",
    "/p (8).jpg",
    "/p (9).jpg",
    "/p (10).jpg",
    "/p (11).jpg",
    "/p (12).jpg",
    "/p (13).jpg",
    "/p (14).jpg",
  ];
  const randomImage =
    placeImages[Math.floor(Math.random() * placeImages.length)];

  return (
    <div className="relative border rounded-xl p-3 hover:scale-105 transition-all">
      {/* 🗑️ Delete Icon */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // prevent <Link> click
          e.preventDefault();
          if (
            confirm(
              "Are you sure you want to delete the trip to " +
                trip?.userSelection?.location?.label +
                "?"
            )
          ) {
            onDelete(trip.id);
          }
        }}
        className="absolute bottom-3 right-3 bg-white hover:bg-red-100 p-1 rounded-full"
        title="Delete trip"
      >
        <RiDeleteBinLine className=" w-5 h-5" />
      </button>

      <Link to={`/view-trip/${trip?.id}`}>
        <img
          src={photoUrl || randomImage}
          onError={(e) => (e.target.src = randomImage)}
          className="object-cover rounded-xl h-[200px] w-full sm:w-[380px]"
          alt={`Trip to ${trip?.userSelection?.location?.label || "unknown"}`}
        />
        <div>
          <h2 className="font-bold text-lg text-black">
            {trip?.userSelection?.location?.label}
          </h2>
          <h2 className="text-sm text-gray-500">
            {trip?.userSelection?.noOfDays} Days trip with a{" "}
            {trip?.userSelection?.budget} Budget
          </h2>
        </div>
      </Link>
    </div>
  );
}

export default UserTripCardItem;
