import { db } from "@/services/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import InfoSection from "./components/InfoSection";
import Hotels from "./components/Hotels";
import PlacesToVisit from "./components/PlacesToVisit";
import Footer from "./components/Footer";

function ViewTrip() {
  const { tripId } = useParams();

  useEffect(() => {
    tripId && GetTripData();
  }, [tripId]);

  const [trip, setTrip] = useState([]);

  //   Used to get trip information from firebase

  const GetTripData = async () => {
    const docRef = doc(db, "PlannerAI", tripId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document:", docSnap.data());
      setTrip(docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      toast("No such trip found");
    }
  };

  return (
    <div className="">
      <div className="p-8 md:px-34 lg:px-44 xl:px-58">
            {/* info section  */}
      <InfoSection trip={trip} />
      {/* recommended hotel  */}
        <Hotels trip={trip} />
      {/* daily plan */}
      <PlacesToVisit trip={trip}/>
      </div>
      <div className="mb-0 md:px-20 lg:px-44 xl:px-54">
        <Footer trip={trip}/>
      </div>
      
    </div>
  );
}

export default ViewTrip;
