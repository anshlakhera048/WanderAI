import React from "react";
import PlaceCardItem from "./PlaceCardItem";

function PlacesToVisit({ trip }) {
  return (
    <div className="w-full">
      <h2 className="mt-5 text-xl sm:text-2xl font-bold">Places to Visit</h2>

      <div className="mt-3">
        {trip?.tripData?.itinerary?.map((item, index) => {
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
            <div
              key={index}
              className="border px-4 py-3 my-5 rounded-xl bg-blue-50"
            >
              <h2 className="font-semibold text-md sm:text-lg mt-2">
                {item.day}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-5 mt-3">
                {placeArray ? (
                  placeArray.map((place, idx) => (
                    <div key={idx}>
                      <h2 className="text-sm sm:text-md font-semibold text-blue-600 mb-1">
                        <span className="italic">Best time to visit:</span>{" "}
                        {place.timeTravel}
                      </h2>
                      <PlaceCardItem place={place} trip={trip} />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm italic">
                    Sorry: Data not Available
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
