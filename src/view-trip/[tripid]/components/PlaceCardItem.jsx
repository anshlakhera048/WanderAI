import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaMapLocationDot } from "react-icons/fa6";
import { Button } from '@/components/ui/button';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/services/GlobalApi';

function PlaceCardItem({ place, trip }) {

    const [photoUrl,setPhotoUrl] = useState();

    useEffect(() => {
    place && GetPlacePhoto();
    }, [place])

    const GetPlacePhoto = async () => {
    const data = {
        textQuery: place.placeName,
    };
    const result = await GetPlaceDetails(data).then((resp) => {
        console.log(resp.data.places[0].photos[6].name);

        const photoUrl = PHOTO_REF_URL.replace('{NAME}',resp.data.places[0].photos[6].name);
        setPhotoUrl(photoUrl);
    });
    };

  const location = trip?.tripData?.hotels?.map((ho,index) => {
    <div key={index}>
        {ho.hotelAddress}
    </div>
  }) || '';
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.placeName + ',' + location)}`;

  return (
   
    <div className='rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all cursor-pointer hover:shadow-md'>
        <img src= {photoUrl?photoUrl: '/imgg.png'}
        className='h-[140px] w-[140px] object-cover rounded-xl'
        />

        <div>
            <h2 className='font-bold text-lg'>{place.placeName}</h2>
            <p className='text-gray-600 text-sm'>{place.placeDetails}</p>
            <h2 className='text-sm font-bold text-gray-600'>Cost : {place.ticketPricing}</h2>
            <Link to={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                <div className="flex items-center gap-3 py-2 px-3 bg-cyan-100 rounded-xl w-fit mt-2 hover:bg-cyan-200">

                <FaMapLocationDot className="text-cyan-600 transition-all duration-200 ease-in-out text-2xl" />
                    <h2 className="text-black font-semibold text-lg">Location</h2>
                </div>
            </Link>

        </div>
    </div>
  )
}

export default PlaceCardItem