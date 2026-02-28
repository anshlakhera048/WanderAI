import { db } from "@/services/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserTripCardItem from "./components/UserTripCardItem";
import Footer from "@/view-trip/[tripid]/components/Footer";
import { motion } from "framer-motion";

function MyTrips() {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetUserTrips();
  }, []);

  const GetUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/");
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, "PlannerAI"),
      where("userEmail", "==", user?.email)
    );
    const QuerySnapshot = await getDocs(q);
    setUserTrips([]);

    QuerySnapshot.forEach((docSnap) => {
      setUserTrips((prevVal) => [
        ...prevVal,
        { ...docSnap.data(), id: docSnap.id },
      ]);
    });
    setLoading(false);
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      await deleteDoc(doc(db, "PlannerAI", tripId));
      setUserTrips((prevTrips) =>
        prevTrips.filter((trip) => trip.id !== tripId)
      );
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  return (
    <div className="min-h-screen px-5 sm:px-10 md:px-20 lg:px-32 xl:px-48 pt-32 pb-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-accent/20 via-info/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            className="p-4 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </motion.div>
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold gradient-text">My Trips</h1>
            <p className="text-muted-foreground text-lg">Your travel adventures await ✨</p>
          </div>
        </div>

        <motion.div
          className="h-1.5 bg-gradient-to-r from-primary via-secondary to-accent rounded-full"
          initial={{ width: 0 }}
          animate={{ width: "120px" }}
          transition={{ delay: 0.3, duration: 0.8 }}
        />
      </motion.div>

      {/* Quick Stats */}
      {!loading && userTrips.length > 0 && (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            className="glass backdrop-blur-xl rounded-2xl p-4 text-center"
            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
          >
            <div className="text-3xl font-bold gradient-text">{userTrips.length}</div>
            <div className="text-sm text-muted-foreground mt-1">Total Trips</div>
          </motion.div>
          <motion.div
            className="glass backdrop-blur-xl rounded-2xl p-4 text-center"
            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
          >
            <div className="text-3xl font-bold gradient-text">
              {userTrips.reduce((acc, trip) => acc + (parseInt(trip.userSelection?.noOfDays) || 0), 0)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Total Days</div>
          </motion.div>
          <motion.div
            className="glass backdrop-blur-xl rounded-2xl p-4 text-center"
            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
          >
            <div className="text-3xl font-bold gradient-text">
              {new Set(userTrips.map(trip => trip.userSelection?.location?.label?.split(',')[0])).size}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Destinations</div>
          </motion.div>
          <motion.div
            className="glass backdrop-blur-xl rounded-2xl p-4 text-center"
            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
          >
            <div className="text-3xl">🌍</div>
            <div className="text-sm text-muted-foreground mt-1">Explorer</div>
          </motion.div>
        </motion.div>
      )}

      {/* Trips Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {loading ? (
          // Loading Skeletons
          [1, 2, 3, 4, 5, 6].map((item) => (
            <motion.div
              key={item}
              className="glass backdrop-blur-xl rounded-3xl h-80 overflow-hidden"
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 },
              }}
            >
              <div className="animate-pulse">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-muted rounded-full w-16"></div>
                    <div className="h-6 bg-muted rounded-full w-20"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : userTrips.length > 0 ? (
          userTrips.map((trip, index) => (
            <motion.div
              key={trip.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <UserTripCardItem trip={trip} onDelete={handleDeleteTrip} />
            </motion.div>
          ))
        ) : (
          // Empty State
          <motion.div
            className="col-span-full glass backdrop-blur-xl rounded-3xl p-16 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-8xl mb-6"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✈️
            </motion.div>
            <h3 className="text-3xl font-bold gradient-text mb-4">No Trips Yet!</h3>
            <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto">
              Start planning your next adventure and create unforgettable memories
            </p>
            <motion.a
              href="/create-trip"
              className="inline-block px-8 py-4 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent text-white font-bold text-lg shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Plan Your First Trip →
            </motion.a>
          </motion.div>
        )}
      </motion.div>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
}

export default MyTrips;
