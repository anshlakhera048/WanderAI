import { db } from '@/services/firebaseConfig';
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Corrected from useNavigation
import UserTripCardItem from './components/UserTripCardItem';
import Footer from '@/view-trip/[tripid]/components/Footer';

function MyTrips() {
  const navigate = useNavigate(); // Corrected
  const [userTrips, setUserTrips] = useState([]);

  useEffect(() => {
    GetUserTrips();
  }, []);

  const GetUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/');
      return;
    }

    const q = query(collection(db, 'PlannerAI'), where('userEmail', '==', user?.email));
    const QuerySnapshot = await getDocs(q);
    setUserTrips([]); // Clear old trips

    QuerySnapshot.forEach((docSnap) => {
      setUserTrips((prevVal) => [...prevVal, { ...docSnap.data(), id: docSnap.id }]);
    });
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      await deleteDoc(doc(db, 'PlannerAI', tripId));
      setUserTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== tripId));
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <h2 className="font-bold text-3xl">My Trips</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-10">
        {userTrips?.length > 0
          ? userTrips.map((trip, index) => (
              <div key={index}>
                <UserTripCardItem trip={trip} onDelete={handleDeleteTrip} />
              </div>
            ))
          : [1, 2, 3, 4, 5, 6].map((item, index) => (
              <div key={index} className="animate-pulse w-full h-[250px] rounded-xl bg-slate-200"></div>
            ))}
      </div>

      <Footer />
    </div>
  );
}

export default MyTrips;
