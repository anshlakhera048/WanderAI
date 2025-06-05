import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import Footer from "@/view-trip/[tripid]/components/Footer";

function Hero() {
  return (
    <div className="flex flex-col items-center px-5 sm:px-10 md:px-20 lg:px-32 xl:px-48 max-w-screen-xl mx-auto gap-9">
      <h1 className="text-center font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-tight mt-12">
        <span className="text-[#fe8b00]">
          Discover everything you need to plan your trip
        </span>
        <span className="text-[#007b9a] block mt-2">
          with AI Itinerary Planner
        </span>
      </h1>

      <p className="text-center text-base sm:text-lg lg:text-[22px] text-gray-500">
        Plan your perfect trip with the power of AI. Smart, fast, and
        personalized travel planning — made simple.
        <br />
        Smart, fast, and personalized travel planning — made simple.
      </p>

      <Link to={"/create-trip"}>
        <Button className="">Get Started</Button>
      </Link>

      <img src="/landing.png" className="w-full max-w-md sm:max-w-xl h-auto" />

      <Footer />
    </div>
  );
}

export default Hero;
