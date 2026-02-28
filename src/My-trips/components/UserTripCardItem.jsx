import { GetPlaceDetails, PHOTO_REF_URL } from "@/services/GlobalApi";
import { useEffect, useState } from "react";
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
    <div className="relative border border-primary/20 dark:border-accent/20 rounded-xl p-3 hover:scale-[1.03] transition-all w-full max-w-sm mx-auto bg-white dark:bg-[#23283a] shadow-sm group">
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
        className="absolute bottom-3 right-3 bg-white dark:bg-[#181c24] hover:bg-accent/20 dark:hover:bg-accent/30 p-2 rounded-full shadow border border-accent/30 dark:border-accent/50 transition"
        title="Delete trip"
      >
        <RiDeleteBinLine className="w-5 h-5 text-accent dark:text-accent group-hover:text-primary dark:group-hover:text-accent transition" />
      </button>

      <Link to={`/view-trip/${trip?.id}`}>
        <div className="w-full aspect-[16/10] rounded-xl overflow-hidden border border-primary/10">
          <img
            src={photoUrl || randomImage}
            onError={(e) => (e.target.src = randomImage)}
            className="object-cover w-full h-full"
            alt={`Trip to ${trip?.userSelection?.location?.label || "unknown"}`}
          />
        </div>
        <div className="mt-3 px-1">
          <h2 className="font-bold text-base sm:text-lg text-primary dark:text-accent truncate">
            {trip?.userSelection?.location?.label}
          </h2>
          <h2 className="text-sm sm:text-base text-accent dark:text-primary font-medium">
            {trip?.userSelection?.noOfDays} Days trip with a {trip?.userSelection?.budget} Budget
          </h2>
        </div>
      </Link>
    </div>
  );
}

export default UserTripCardItem;
