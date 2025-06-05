import React, { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Input } from "@/components/ui/input";
import { AI_PROMPT, SelectBudgetOptions, SelectTravellersList } from "@/constants/options";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { chatSession } from "@/services/AIModal";
import { AiOutlineLoading } from "react-icons/ai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/services/firebaseConfig";
import { useNavigate } from "react-router-dom";

function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    if (name === "noOfDays") {
      if (value > 6) {
        toast("Please select a maximum of 6 days");
        return;
      }
      if (!Number.isInteger(Number(value))) {
        toast("Please enter a whole number");
        return;
      }
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => fetchUserProfile(tokenResponse),
    onError: (error) => console.error("Login Failed:", error),
  });

  const OnGenerateTrip = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
      return;
    }

    const { noOfDays, location, traveller, budget } = formData;
    if (!noOfDays || !location || !traveller || !budget) {
      toast("Please fill all fields correctly");
      return;
    }

    setLoading(true);
    const FINAL_PROMPT = AI_PROMPT
      .replaceAll("{location}", location.label)
      .replaceAll("{totalDays}", noOfDays)
      .replaceAll("{traveller}", traveller)
      .replaceAll("{budget}", budget);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const text = result?.response?.text();
      console.log("-- AI Response --", text);
      SaveAiTrip(text);
    } catch (error) {
      toast.error("Failed to generate trip");
      console.error("Chat API error:", error);
      setLoading(false);
    }
  };

  const SaveAiTrip = async (tripData) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const docID = Date.now().toString();

      await setDoc(doc(db, "PlannerAI", docID), {
        userSelection: formData,
        tripData: JSON.parse(tripData),
        userEmail: user?.email,
        id: docID,
      });

      navigate("/view-trip/" + docID);
    } catch (error) {
      toast.error("Error saving trip");
      console.error("Firestore error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = (tokenInfo) => {
    axios
      .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
        headers: {
          Authorization: `Bearer ${tokenInfo?.access_token}`,
          Accept: "application/json",
        },
      })
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data));
        setOpenDialog(false);
        OnGenerateTrip();
      })
      .catch((err) => {
        console.error("Google user info error:", err);
        toast.error("Failed to fetch Google profile");
      });
  };

return (
  <div className="px-5 sm:px-10 md:px-32 lg:px-56 xl:px-72 mt-10">
    <h2 className="font-bold text-2xl sm:text-3xl">Tell us your Travel Preferences</h2>
    <p className="mt-3 text-gray-500 text-base sm:text-xl">
      Tell us your destination, trip duration, budget, and travel companions to plan your perfect trip.
    </p>

    <div className="mt-12 flex flex-col gap-9">
      {/* Location */}
      <div>
        <h2 className="text-lg sm:text-xl my-3 font-medium">What is your Destination of your Choice?</h2>
        <GooglePlacesAutocomplete
          apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
          selectProps={{
            place,
            onChange: (v) => {
              setPlace(v);
              handleInputChange("location", v);
            },
          }}
        />
      </div>

      {/* No. of Days */}
      <div>
        <h2 className="text-lg sm:text-xl my-3 font-medium">Select number of Days:</h2>
        <Input
          type="number"
          min="1"
          max="6"
          placeholder="Ex. 3"
          onChange={(e) => handleInputChange("noOfDays", e.target.value)}
        />
      </div>

      {/* Budget */}
      <div>
        <h2 className="text-lg sm:text-xl my-3 font-medium">What is your Budget?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5">
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("budget", item.title)}
              className={`p-4 cursor-pointer border rounded-lg hover:shadow-lg transition ${
                formData?.budget === item.title ? "shadow-lg border-black" : ""
              }`}
            >
              <h2 className="text-3xl">{item.icon}</h2>
              <h2 className="font-bold text-base sm:text-lg">{item.title}</h2>
              <h2 className="text-gray-500 text-sm">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      {/* Traveller */}
      <div>
        <h2 className="text-lg sm:text-xl my-4 font-medium">Who is your Companion on your Trip?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5">
          {SelectTravellersList.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("traveller", item.people)}
              className={`p-4 cursor-pointer border rounded-lg hover:shadow-lg transition ${
                formData?.traveller === item.people ? "shadow-lg border-black" : ""
              }`}
            >
              <h2 className="text-3xl">{item.icon}</h2>
              <h2 className="font-bold text-base sm:text-lg">{item.title}</h2>
              <h2 className="text-gray-500 text-sm">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Generate Button */}
    <div className="my-6 flex justify-center sm:justify-end">
      <Button disabled={loading} onClick={OnGenerateTrip}>
        {loading ? <AiOutlineLoading className="animate-spin h-7 w-7" /> : "Generate Trip"}
      </Button>
    </div>

    {/* Dialog */}
    <Dialog open={openDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogDescription>
            <img src="/logo.svg" alt="App Logo" className="mx-auto mb-4" />
            <h2 className="text-2xl font-bold mt-4 text-center">Sign in with Google</h2>
            <p className="text-center text-gray-600">Sign in securely to access personalized trips</p>
            <Button
              disabled={loading}
              onClick={login}
              className="w-full mt-5 flex gap-4 items-center justify-center"
            >
              <FcGoogle className="h-6 w-6" />
              Sign in with Google
            </Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  </div>
);
}

export default CreateTrip;
