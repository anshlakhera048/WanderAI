import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebaseConfig";
import { toast } from "sonner";

import InfoSection from "./components/InfoSection";
import Hotels from "./components/Hotels";
import PlacesToVisit from "./components/PlacesToVisit";
import Footer from "./components/Footer";

function ViewTrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    if (tripId) {
      fetchTripData();
    }
  }, [tripId]);

  useEffect(() => {
    // Listen for user login
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const fetchTripData = async () => {
    try {
      const docRef = doc(db, "PlannerAI", tripId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document:", docSnap.data());
        setTrip(docSnap.data());
      } else {
        console.log("No such document!");
        toast.error("No such trip found");
      }
    } catch (error) {
      console.error("Error fetching trip data:", error);
      toast.error("Failed to load trip");
    }
  };

  return (
    <main className="w-full bg-gray-50 dark:bg-[#181c24] min-h-screen transition-colors pt-20">
      {/* Guest User Banner */}
      {trip?.isGuestTrip && !user && (
        <div className="bg-accent/10 dark:bg-accent/20 border-b border-accent/30 dark:border-accent/40 px-4 py-3">
          <div className="max-w-screen-xl mx-auto text-center">
            <p className="text-sm text-primary dark:text-accent font-medium">
              💡 This is a guest trip. <a href="/" className="underline font-bold hover:text-accent dark:hover:text-primary transition">Sign in</a> to save trips to your account and access them anytime!
            </p>
          </div>
        </div>
      )}

      <section className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-6 space-y-8">
        <InfoSection trip={trip} />
        <Hotels trip={trip} />
        <PlacesToVisit trip={trip} />
      </section>

      <footer className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
        <Footer />
      </footer>
    </main>
  );
}

export default ViewTrip;
