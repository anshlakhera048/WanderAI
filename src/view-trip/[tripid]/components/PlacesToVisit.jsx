import React from "react";
import PlaceCardItem from "./PlaceCardItem";
import { motion } from "framer-motion";

function PlacesToVisit({ trip }) {
  return (
    <motion.div
      className="w-full mt-12"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-3 mb-8">
        <motion.div
          className="p-3 rounded-xl bg-gradient-to-br from-accent to-warning"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </motion.div>
        <div>
          <h2 className="text-3xl font-bold gradient-text-accent">Places to Visit</h2>
          <p className="text-muted-foreground text-sm">Your personalized day-by-day itinerary</p>
        </div>
      </div>

      <div className="space-y-8">
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
            <motion.div
              key={index}
              className="relative glass backdrop-blur-xl rounded-3xl p-6 border border-border shadow-xl overflow-hidden"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.01 }}
            >
              {/* Decorative Gradient */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl -z-10"></div>
              
              {/* Day Header */}
              <motion.div
                className="flex items-center gap-3 mb-6"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary via-secondary to-accent font-bold text-white text-lg shadow-lg">
                  {index + 1}
                </div>
                <h3 className="text-2xl font-bold gradient-text">{item.day}</h3>
              </motion.div>

              {/* Places Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {placeArray ? (
                  placeArray.map((place, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + idx * 0.1 }}
                    >
                      {/* Best Time Badge */}
                      <motion.div
                        className="flex items-center gap-2 mb-3 px-4 py-2 rounded-full glass backdrop-blur-md w-fit"
                        whileHover={{ scale: 1.05 }}
                      >
                        <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-semibold">
                          Best time: <span className="gradient-text-accent">{place.bestTime}</span>
                        </span>
                      </motion.div>
                      
                      <PlaceCardItem place={place} trip={trip} />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    className="col-span-full glass backdrop-blur-xl rounded-2xl p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="text-6xl mb-4">📍</div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No places found</h3>
                    <p className="text-gray-600 dark:text-gray-400 italic">Sorry, data is not available for this day</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default PlacesToVisit;
