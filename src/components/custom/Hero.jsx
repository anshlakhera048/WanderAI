import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import Footer from '@/view-trip/[tripid]/components/Footer'

function Hero() {
  return (
    <div className='flex flex-col items-center mx-60 gap-9'>
        <h1
            className='font-extrabold text-[50px] text-center mt-12'
        ><span className='text-[#fe8b00]'>Discover Everything you are planning your Trip for with</span> <span className='text-[#007b9a]'><br/>AI ITINERARY PLANNER</span>
        </h1>
        <p className='text-center text-[22px] text-gray-500'>
        Plan your perfect trip with the power of AI. Smart, fast, and personalized travel planning — made simple.<br/>
        Smart, fast, and personalized travel planning — made simple.
        </p>
        
        <Link to={'/create-trip'}>
         <Button className=''>Get Started</Button>
        </Link>

        <img src='/landing.png' className='h-[450px]'/>

        <Footer/>
       
    </div>
  )
}

export default Hero 