import React, { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Input } from "@/components/ui/input";
import { AI_PROMPT, SelectBudgetOptions, SelectTravellersList } from "@/constants/options";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { chatSession } from "@/services/AIModal";
import { AiOutlineLoading } from "react-icons/ai";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/services/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for storage changes (when user logs in from header)
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Also check on focus (for same-tab login)
    const handleFocus = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };
    window.addEventListener('focus', handleFocus);
    
    // Listen for theme changes
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      observer.disconnect();
    };
  }, []);

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => fetchUserProfile(tokenResponse),
    onError: (error) => console.error("Login Failed:", error),
  });

  const OnGenerateTrip = async () => {
    const { noOfDays, location, traveller, budget } = formData;
    if (!noOfDays || !location || !traveller || !budget) {
      toast("Please fill all fields correctly");
      return;
    }

    const user = localStorage.getItem("user");
    if (!user) {
      toast.info("You're creating a trip as a guest. Sign in to save trips to your account!");
    }

    setLoading(true);
    const FINAL_PROMPT = AI_PROMPT.replaceAll("{location}", location.label)
      .replaceAll("{totalDays}", noOfDays)
      .replaceAll("{traveller}", traveller)
      .replaceAll("{budget}", budget);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const text = result?.response?.text();
      console.log("-- AI Response --", text);

      if (!text) {
        throw new Error("AI did not return any response");
      }

      SaveAiTrip(text);
    } catch (error) {
      console.error("Chat API error:", error);

      // Check if it's an API key issue
      if (error?.message?.includes("API key") || error?.message?.includes("GENAI_API_KEY")) {
        toast.error("API key not configured. Please check your .env file.");
      } else {
        toast.error("Failed to generate trip. " + (error?.message || "Please try again."));
      }

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
        userEmail: user?.email || null,
        isGuestTrip: !user,
        id: docID,
        createdAt: new Date().toISOString(),
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
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "application/json",
          },
        }
      )
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
    <div className="min-h-screen px-5 sm:px-10 md:px-20 lg:px-32 xl:px-48 pt-32 pb-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-accent/20 via-info/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header Section */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4">
          <span className="gradient-text">Plan Your Perfect Trip</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Just a few quick steps to your AI-powered personalized itinerary ✨
        </p>
      </motion.div>

      {/* Guest Banner */}
      {!user && (
        <motion.div
          className="max-w-3xl mx-auto mb-8 glass backdrop-blur-xl rounded-2xl p-5 border border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="p-3 rounded-full bg-gradient-to-br from-primary to-secondary">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">
                You can create trips without signing in! However,{" "}
                <button
                  onClick={() => setOpenDialog(true)}
                  className="gradient-text font-bold hover:underline"
                >
                  sign in
                </button>{" "}
                to save trips to your account.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Progress Stepper */}
      <motion.div
        className="max-w-4xl mx-auto mb-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-muted -z-10"></div>
          <motion.div
            className="absolute top-5 left-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent -z-10"
            initial={{ width: "0%" }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.5 }}
          ></motion.div>

          {[
            { icon: "📍", label: "Destination" },
            { icon: "📅", label: "Duration" },
            { icon: "💰", label: "Budget" },
            { icon: "👥", label: "Travelers" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="flex flex-col items-center relative"
              whileHover={{ scale: 1.1 }}
            >
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg transition-all ${
                  step >= idx
                    ? "bg-gradient-to-br from-primary via-secondary to-accent shadow-glow"
                    : "bg-muted text-muted-foreground"
                }`}
                animate={step === idx ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                {item.icon}
              </motion.div>
              <span className={`mt-2 text-xs font-semibold hidden sm:block ${step >= idx ? "gradient-text" : "text-muted-foreground"}`}>
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Steps Content */}
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {/* Step 0: Destination */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
              className="glass backdrop-blur-xl rounded-3xl p-8 border border-border shadow-xl"
            >
              <div className="text-center mb-8">
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🌍
                </motion.div>
                <h2 className="text-3xl font-bold gradient-text mb-2">Where do you want to go?</h2>
                <p className="text-muted-foreground">Choose your dream destination</p>
              </div>

              <div className="max-w-xl mx-auto">
                <GooglePlacesAutocomplete
                  apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                  selectProps={{
                    place,
                    onChange: (v) => {
                      setPlace(v);
                      handleInputChange("location", v);
                    },
                    placeholder: "Search for a city or country...",
                    styles: {
                      control: (base) => ({
                        ...base,
                        borderColor: "var(--border)",
                        backgroundColor: "var(--card)",
                        color: "var(--foreground)",
                        boxShadow: "var(--shadow-md)",
                        borderRadius: "12px",
                        minHeight: "56px",
                        fontSize: "16px",
                        transition: "all 0.3s ease",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: "var(--foreground)",
                      }),
                      input: (base) => ({
                        ...base,
                        color: "var(--foreground)",
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: "var(--popover)",
                        borderColor: "var(--border)",
                        borderRadius: "12px",
                        boxShadow: "var(--shadow-lg)",
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected
                          ? "var(--primary)"
                          : state.isFocused
                          ? "var(--muted)"
                          : "transparent",
                        color: state.isSelected ? "white" : "var(--foreground)",
                        fontWeight: 500,
                        padding: "12px 16px",
                      }),
                    },
                  }}
                />
              </div>

              <div className="flex justify-end mt-8">
                <motion.button
                  disabled={!formData.location}
                  onClick={() => setStep(1)}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Next Step →
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 1: Duration */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
              className="glass backdrop-blur-xl rounded-3xl p-8 border border-border shadow-xl"
            >
              <div className="text-center mb-8">
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ⏱️
                </motion.div>
                <h2 className="text-3xl font-bold gradient-text mb-2">How many days?</h2>
                <p className="text-muted-foreground">Choose trip duration (1-6 days)</p>
              </div>

              <div className="max-w-md mx-auto">
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[1, 2, 3, 4, 5, 6].map((day) => (
                    <motion.button
                      key={day}
                      onClick={() => handleInputChange("noOfDays", day)}
                      className={`p-4 rounded-xl font-bold text-lg transition-all ${
                        formData.noOfDays == day
                          ? "bg-gradient-to-br from-primary to-secondary text-white shadow-glow"
                          : "glass hover:bg-muted"
                      }`}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {day}
                    </motion.button>
                  ))}
                </div>

                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="6"
                    placeholder="Or enter custom days (max 6)"
                    className="w-full px-6 py-4 rounded-xl glass backdrop-blur-xl border border-border text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    value={formData.noOfDays || ""}
                    onChange={(e) => handleInputChange("noOfDays", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <motion.button
                  onClick={() => setStep(0)}
                  className="px-8 py-3 rounded-xl glass font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ← Back
                </motion.button>
                <motion.button
                  disabled={!formData.noOfDays}
                  onClick={() => setStep(2)}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Next Step →
                </motion.button>
              </div>
            </motion.div>
          )}
          {/* Step 2: Budget */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
              className="glass backdrop-blur-xl rounded-3xl p-8 border border-border shadow-xl"
            >
              <div className="text-center mb-8">
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  💎
                </motion.div>
                <h2 className="text-3xl font-bold gradient-text mb-2">What's your budget?</h2>
                <p className="text-muted-foreground">Choose your preferred spending tier</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-5xl mx-auto">
                {SelectBudgetOptions.map((item, index) => (
                  <motion.div
                    key={index}
                    onClick={() => handleInputChange("budget", item.title)}
                    className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all overflow-hidden group ${
                      formData?.budget === item.title
                        ? "border-primary shadow-glow"
                        : "border-border hover:border-primary/50"
                    }`}
                    whileHover={{ y: -10, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Gradient Background on Selection */}
                    {formData?.budget === item.title && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}

                    <div className="relative z-10 flex flex-col items-center text-center">
                      <motion.div
                        className="text-5xl mb-3"
                        animate={formData?.budget === item.title ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        {item.icon}
                      </motion.div>
                      <h3 className={`font-bold text-xl mb-2 ${formData?.budget === item.title ? "gradient-text" : ""}`}>
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>

                    {/* Checkmark on Selection */}
                    {formData?.budget === item.title && (
                      <motion.div
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <motion.button
                  onClick={() => setStep(1)}
                  className="px-8 py-3 rounded-xl glass font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ← Back
                </motion.button>
                <motion.button
                  disabled={!formData.budget}
                  onClick={() => setStep(3)}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Next Step →
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Travelers */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
              className="glass backdrop-blur-xl rounded-3xl p-8 border border-border shadow-xl"
            >
              <div className="text-center mb-8">
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  👥
                </motion.div>
                <h2 className="text-3xl font-bold gradient-text mb-2">Who's traveling?</h2>
                <p className="text-muted-foreground">Select your travel companions</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
                {SelectTravellersList.map((item, index) => (
                  <motion.div
                    key={index}
                    onClick={() => handleInputChange("traveller", item.people)}
                    className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all overflow-hidden group ${
                      formData?.traveller === item.people
                        ? "border-primary shadow-glow"
                        : "border-border hover:border-primary/50"
                    }`}
                    whileHover={{ y: -10, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Gradient Background on Selection */}
                    {formData?.traveller === item.people && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}

                    <div className="relative z-10 flex flex-col items-center text-center">
                      <motion.div
                        className="text-5xl mb-3"
                        animate={formData?.traveller === item.people ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        {item.icon}
                      </motion.div>
                      <h3 className={`font-bold text-xl mb-2 ${formData?.traveller === item.people ? "gradient-text" : ""}`}>
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>

                    {/* Checkmark on Selection */}
                    {formData?.traveller === item.people && (
                      <motion.div
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <motion.button
                  onClick={() => setStep(2)}
                  className="px-8 py-3 rounded-xl glass font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ← Back
                </motion.button>
                <motion.button
                  disabled={!formData.traveller || loading}
                  onClick={OnGenerateTrip}
                  className="px-10 py-3 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl relative overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <AiOutlineLoading className="animate-spin h-6 w-6" />
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Generate My Trip</span>
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        ✨
                      </motion.span>
                    </div>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sign In Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="glass backdrop-blur-xl border-border">
          <DialogHeader>
            <DialogTitle className="sr-only">Sign in Dialog</DialogTitle>
            <DialogDescription>
              <motion.img
                src="/new.svg"
                alt="App Logo"
                className="mx-auto h-16"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5 }}
              />
              <motion.h2
                className="text-3xl font-bold mt-5 text-center gradient-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Welcome Back!
              </motion.h2>
              <motion.p
                className="text-center text-muted-foreground mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Sign in with Google to save and access your trips
              </motion.p>
              <motion.button
                disabled={loading}
                onClick={login}
                className="w-full mt-6 px-8 py-3 rounded-xl glass hover:bg-muted flex items-center justify-center gap-3 font-semibold transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <FcGoogle className="h-6 w-6" />
                {loading ? "Signing in..." : "Sign in with Google"}
              </motion.button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;

