import React from "react";
import PlaceCardItem from "./PlaceCardItem";

function PlacesToVisit({ trip }) {
  return (
    <div>
      <h2 className="mt-5 text-2xl font-bold">Places to Visit</h2>

      <div className="mt-3">
        {trip?.tripData?.itinerary?.map((item, index) => {
          // Try all possible field names and pick the first one that is a valid array
          const placeArray =
            Array.isArray(item.plan)
              ? item.plan
              : Array.isArray(item.plans)
              ? item.plans
              : Array.isArray(item.place)
              ? item.place
              : Array.isArray(item.places)
              ? item.places
              : null;

          return (
            <div key={index} className="border px-5 my-5 rounded-xl bg-blue-50">
              <h2 className="font-bold text-lg mt-3">{item.day}</h2>

              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5 mb-3">
                {placeArray ? (
                  placeArray.map((place, idx) => (
                    <div key={idx}>
                      <h2 className="font-bold text-blue-600">
                        <span className="font-italic">Best time to visit : </span>
                        {place.timeTravel}
                      </h2>
                      <PlaceCardItem place={place} trip={trip} />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm italic">
                    Sorry : Data not Available
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PlacesToVisit;
