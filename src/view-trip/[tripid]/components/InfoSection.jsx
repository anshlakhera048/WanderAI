import { Button } from "@/components/ui/button";
import { GetPlaceDetails, PHOTO_REF_URL } from "@/services/GlobalApi";
import React, { useEffect, useState } from "react";
import { IoShareSocialSharp } from "react-icons/io5";

// const PHOTO_REF_URL = "https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key="+ import.meta.env.VITE_GOOGLE_PLACE_API_KEY;

function InfoSection({ trip }) {

  const [photoUrl,setPhotoUrl] = useState();

  useEffect(() => {
    trip && GetPlacePhoto();
  }, [trip])

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: trip?.userSelection?.location?.label,
    };
    const result = await GetPlaceDetails(data).then((resp) => {
      console.log(resp.data.places[0].photos[6].name);

      const photoUrl = PHOTO_REF_URL.replace('{NAME}',resp.data.places[0].photos[7].name);
      setPhotoUrl(photoUrl);
    });
  };

    // 🌄 Random image logic from local images
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
  const randomImage = placeImages[Math.floor(Math.random() * placeImages.length)];

  return (
    <div>
      <img
        src={photoUrl?photoUrl:randomImage}
        className="h-[400px] w-full object-cover rounded-xl border object-bottom "
        alt="Location"
      />


      <div className="flex justify-between items-center">
        <div className="my-5 flex flex-col gap-2">
          <h2 className="font-bold text-3xl">
            {trip?.userSelection?.location?.label}
          </h2>
          <div className="flex gap-5">
            <h2 className="p-1 px-3 font-semibold bg-gray-200 rounded-full text-gray-600 text-xs md:text-md">
              📅 {trip?.userSelection?.noOfDays} Day Trip
            </h2>
            <h2 className="p-1 px-3 font-semibold bg-gray-200 rounded-full text-gray-600 text-xs md:text-md">
              💰 {trip?.userSelection?.budget}
            </h2>
            <h2 className="p-1 px-3 font-semibold bg-gray-200 rounded-full text-gray-600 text-xs md:text-md">
              🙋 No of Travellers: {trip?.userSelection?.traveller}
            </h2>
          </div>
        </div>
        <Button>
          <IoShareSocialSharp />
        </Button>
      </div>
    </div>
  );
}

export default InfoSection;
