import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { GetPlaceDetails, PHOTO_REF_URL } from "@/services/GlobalApi";
import React, { useEffect, useState } from "react";
import { IoShareSocialSharp } from "react-icons/io5";
import { toast } from "sonner";
import jsPDF from "jspdf";

function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState();
  const [shareDialog, setShareDialog] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    trip && GetPlacePhoto();
  }, [trip]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: trip?.userSelection?.location?.label,
    };
    const result = await GetPlaceDetails(data).then((resp) => {
      console.log(resp.data.places[0].photos[6]?.name);
      const photoUrl = PHOTO_REF_URL.replace(
        "{NAME}",
        resp.data.places[0].photos[7]?.name
      );
      setPhotoUrl(photoUrl);
    });
  };

  const placeImages = [
    "/p (1).jpg", "/p (2).jpg", "/p (3).jpg", "/p (4).jpg",
    "/p (5).jpg", "/p (6).jpg", "/p (7).jpg", "/p (8).jpg",
    "/p (9).jpg", "/p (10).jpg", "/p (11).jpg", "/p (12).jpg",
    "/p (13).jpg", "/p (14).jpg",
  ];
  const randomImage = placeImages[Math.floor(Math.random() * placeImages.length)];

  const handleCopyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast.success("Link copied to clipboard!");
      setShareDialog(false);
    }).catch(() => {
      toast.error("Failed to copy link");
    });
  };

  const handleDownloadPDF = () => {
    setIsPrinting(true);
    toast.info("Generating PDF...");
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 12;
      let yPosition = 15;

      // Website URL
      const websiteUrl = window.location.origin;

      // Compact Color Palette
      const colors = {
        primary: [99, 102, 241],
        secondary: [168, 85, 247],
        accent: [236, 72, 153],
        dark: [30, 41, 59],
        light: [248, 250, 252],
        text: [51, 65, 85],
        muted: [100, 116, 139]
      };

      // Helper function to add text with word wrap
      const addText = (text, x, y, maxWidth, fontSize = 9, lineHeight = 1.3) => {
        doc.setFontSize(fontSize);
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y);
        return y + (lines.length * fontSize * lineHeight * 0.35);
      };

      // Helper to check if we need a new page
      const checkNewPage = (requiredSpace) => {
        if (yPosition + requiredSpace > pageHeight - 15) {
          doc.addPage();
          doc.setFillColor(...colors.light);
          doc.rect(0, 0, pageWidth, pageHeight, 'F');
          yPosition = 15;
          return true;
        }
        return false;
      };

      // Background
      doc.setFillColor(...colors.light);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      // ===== COMPACT HEADER =====
      doc.setFillColor(...colors.primary);
      doc.rect(0, 0, pageWidth, 35, 'F');
      
      // WanderAI branding
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont(undefined, 'bold');
      doc.text("WanderAI", pageWidth / 2, 14, { align: 'center' });
      
      doc.setFontSize(8);
      doc.setFont(undefined, 'normal');
      doc.text("AI-Powered Travel Itinerary", pageWidth / 2, 21, { align: 'center' });
      
      doc.setFontSize(7);
      doc.setTextColor(200, 200, 255);
      doc.textWithLink(websiteUrl, pageWidth / 2, 27, { 
        align: 'center',
        url: websiteUrl 
      });

      yPosition = 42;

      // ===== DESTINATION =====
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 18, 3, 3, 'F');
      doc.setDrawColor(...colors.primary);
      doc.setLineWidth(0.5);
      doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 18, 3, 3);
      
      doc.setFillColor(...colors.accent);
      doc.rect(margin, yPosition, 3, 18, 'F');
      
      doc.setTextColor(...colors.dark);
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      const destText = trip?.userSelection?.location?.label || "Travel Destination";
      doc.text(destText, margin + 6, yPosition + 8);
      
      doc.setFontSize(7);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(...colors.muted);
      doc.text("Your personalized itinerary", margin + 6, yPosition + 13);
      
      yPosition += 22;

      // ===== TRIP INFO (ONE LINE) =====
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 12, 2, 2, 'F');
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 12, 2, 2);
      
      doc.setTextColor(...colors.text);
      doc.setFontSize(9);
      doc.setFont(undefined, 'bold');
      const infoText = `${trip?.userSelection?.noOfDays} Days | ${trip?.userSelection?.budget} | ${trip?.userSelection?.traveller}`;
      doc.text(infoText, pageWidth / 2, yPosition + 7.5, { align: 'center' });
      
      yPosition += 16;

      // ===== HOTELS SECTION (COMPACT WITH CLICKABLE LINKS) =====
      if (trip?.tripData?.hotelOptions && trip.tripData.hotelOptions.length > 0) {
        checkNewPage(25);
        
        // Section header
        doc.setFillColor(...colors.secondary);
        doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 8, 2, 2, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text("Hotels & Accommodation", margin + 4, yPosition + 5.5);
        
        yPosition += 11;

        trip.tripData.hotelOptions.forEach((hotel, index) => {
          checkNewPage(18);
          
          const hotelName = hotel.hotelName || hotel.name || 'Hotel';
          const hotelAddress = hotel.hotelAddress || hotel.address || '';
          const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotelName + ', ' + hotelAddress)}`;
          
          // Compact hotel card
          doc.setFillColor(255, 255, 255);
          doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 16, 2, 2, 'F');
          doc.setDrawColor(230, 230, 230);
          doc.setLineWidth(0.3);
          doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 16, 2, 2);
          
          // Number badge
          doc.setFillColor(...colors.accent);
          doc.circle(margin + 4, yPosition + 5, 2.5, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(8);
          doc.setFont(undefined, 'bold');
          doc.text(`${index + 1}`, margin + 4, yPosition + 6, { align: 'center' });

          // Hotel name with clickable link
          doc.setTextColor(...colors.primary);
          doc.setFontSize(10);
          doc.setFont(undefined, 'bold');
          doc.textWithLink(hotelName.substring(0, 50), margin + 8, yPosition + 6, { url: googleMapsUrl });
          
          // Address
          doc.setTextColor(...colors.muted);
          doc.setFontSize(7);
          doc.setFont(undefined, 'normal');
          const shortAddr = hotelAddress.substring(0, 80);
          doc.text(shortAddr, margin + 8, yPosition + 10);
          
          // Price and rating inline
          doc.setTextColor(...colors.text);
          doc.setFontSize(8);
          doc.setFont(undefined, 'bold');
          let infoLine = '';
          if (hotel.price) {
            const priceText = (hotel.price || '').toString().replace(/₹/g, 'Rs.');
            infoLine += priceText;
          }
          if (hotel.rating) {
            if (infoLine) infoLine += '  |  ';
            infoLine += `Rating: ${hotel.rating}`;
          }
          doc.text(infoLine, margin + 8, yPosition + 13.5);
          
          yPosition += 18;
        });
        yPosition += 4;
      }

      // ===== ITINERARY SECTION (COMPACT WITH MAP LINKS) =====
      if (trip?.tripData?.itinerary && trip.tripData.itinerary.length > 0) {
        checkNewPage(25);
        
        // Section header
        doc.setFillColor(...colors.accent);
        doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 8, 2, 2, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text("Your Itinerary", margin + 4, yPosition + 5.5);
        
        yPosition += 11;

        trip.tripData.itinerary.forEach((dayItem, dayIndex) => {
          checkNewPage(20);

          // Compact day header
          doc.setFillColor(...colors.primary);
          doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 7, 2, 2, 'F');
          
          doc.setFillColor(255, 255, 255);
          doc.circle(margin + 4, yPosition + 3.5, 2, 'F');
          doc.setTextColor(...colors.primary);
          doc.setFontSize(7);
          doc.setFont(undefined, 'bold');
          doc.text(`${dayIndex + 1}`, margin + 4, yPosition + 4.5, { align: 'center' });
          
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(10);
          doc.text(dayItem.day || `Day ${dayIndex + 1}`, margin + 8, yPosition + 5);
          
          yPosition += 9;

          // Get places array
          const placeArray = Array.isArray(dayItem.plan) ? dayItem.plan :
                           Array.isArray(dayItem.plans) ? dayItem.plans :
                           Array.isArray(dayItem.place) ? dayItem.place :
                           Array.isArray(dayItem.places) ? dayItem.places : [];

          if (placeArray.length > 0) {
            placeArray.forEach((place, placeIndex) => {
              checkNewPage(20);

              const placeName = place.placeName || place.name || 'Place';
              const location = trip?.tripData?.hotels?.[0]?.hotelAddress || trip?.userSelection?.location?.label || '';
              const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName + ', ' + location)}`;

              // Compact place card
              doc.setFillColor(255, 255, 255);
              doc.roundedRect(margin + 3, yPosition, pageWidth - 2 * margin - 6, 18, 2, 2, 'F');
              doc.setDrawColor(230, 230, 230);
              doc.setLineWidth(0.3);
              doc.roundedRect(margin + 3, yPosition, pageWidth - 2 * margin - 6, 18, 2, 2);
              
              // Accent stripe
              doc.setFillColor(...colors.secondary);
              doc.rect(margin + 3, yPosition, 2, 18, 'F');
              
              // Place number
              doc.setFillColor(...colors.secondary);
              doc.circle(margin + 7, yPosition + 4, 2, 'F');
              doc.setTextColor(255, 255, 255);
              doc.setFontSize(7);
              doc.setFont(undefined, 'bold');
              doc.text(`${placeIndex + 1}`, margin + 7, yPosition + 5, { align: 'center' });

              // Place name with clickable map link
              doc.setTextColor(...colors.primary);
              doc.setFontSize(9);
              doc.setFont(undefined, 'bold');
              doc.textWithLink(placeName.substring(0, 48), margin + 10, yPosition + 5, { url: googleMapsUrl });
              
              // Details
              doc.setTextColor(...colors.text);
              doc.setFontSize(7);
              doc.setFont(undefined, 'normal');
              if (place.placeDetails || place.details) {
                const details = (place.placeDetails || place.details).substring(0, 100);
                yPosition = addText(details, margin + 10, yPosition + 8, pageWidth - 2 * margin - 20, 7);
              } else {
                yPosition += 8;
              }
              
              // Info tags (one line)
              doc.setFontSize(7);
              let infoText = '';
              if (place.bestTime) infoText += `Best: ${place.bestTime.substring(0, 15)}`;
              if (place.ticketPricing || place.price) {
                const costText = ((place.ticketPricing || place.price) || '').toString().replace(/₹/g, 'Rs.');
                if (infoText) infoText += ' | ';
                infoText += costText.substring(0, 15);
              }
              if (place.timeTravel || place.duration) {
                if (infoText) infoText += ' | ';
                infoText += (place.timeTravel || place.duration).substring(0, 10);
              }
              doc.setTextColor(...colors.muted);
              doc.text(infoText, margin + 10, yPosition + 3);
              
              yPosition += 20;
            });
          }
          yPosition += 3;
        });
      }

      // ===== COMPACT FOOTER ON EVERY PAGE =====
      const totalPages = doc.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        
        // Footer background
        doc.setFillColor(...colors.primary);
        doc.rect(0, pageHeight - 12, pageWidth, 12, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(7);
        doc.setFont(undefined, 'normal');
        doc.text('Created by Ansh Lakhera', margin, pageHeight - 6);
        
        // Page numbers
        doc.setFont(undefined, 'bold');
        doc.text(`${i} / ${totalPages}`, pageWidth / 2, pageHeight - 6, { align: 'center' });
        
        // Website link
        doc.setFont(undefined, 'normal');
        doc.textWithLink('WanderAI.com', pageWidth - margin, pageHeight - 6, { align: 'right', url: websiteUrl });
      }

      // Save the PDF
      const fileName = `WanderAI_${trip?.userSelection?.location?.label?.replace(/[^a-z0-9]/gi, '_') || 'Trip'}_${new Date().getTime()}.pdf`;
      doc.save(fileName);

      toast.success("PDF downloaded successfully!");
      setShareDialog(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div className="w-full">
      <img
        src={photoUrl || randomImage}
        className="h-[200px] sm:h-[300px] md:h-[400px] w-full object-cover rounded-xl border object-bottom"
        alt="Location"
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 my-5">
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-2xl md:text-3xl text-primary dark:text-accent">
            {trip?.userSelection?.location?.label}
          </h2>
          <div className="flex flex-wrap gap-2">
            <h2 className="p-1 px-3 font-semibold bg-primary/10 dark:bg-accent/20 rounded-full text-primary dark:text-accent text-xs md:text-md">
              📅 {trip?.userSelection?.noOfDays} Day Trip
            </h2>
            <h2 className="p-1 px-3 font-semibold bg-primary/10 dark:bg-accent/20 rounded-full text-primary dark:text-accent text-xs md:text-md">
              💰 {trip?.userSelection?.budget}
            </h2>
            <h2 className="p-1 px-3 font-semibold bg-primary/10 dark:bg-accent/20 rounded-full text-primary dark:text-accent text-xs md:text-md">
              🙋 No of Travellers: {trip?.userSelection?.traveller}
            </h2>
          </div>
        </div>

        <Button className="self-start md:self-auto" onClick={() => setShareDialog(true)}>
          <IoShareSocialSharp />
        </Button>
      </div>

      {/* Share Dialog */}
      <Dialog open={shareDialog} onOpenChange={setShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-primary dark:text-accent">Share Your Trip</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Choose how you'd like to share your trip itinerary
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 dark:bg-accent dark:hover:bg-accent/90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
              Copy Link
            </Button>
            <Button
              onClick={handleDownloadPDF}
              disabled={isPrinting}
              variant="outline"
              className="w-full flex items-center justify-center gap-3 border-primary text-primary hover:bg-primary/10 dark:border-accent dark:text-accent dark:hover:bg-accent/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
              </svg>
              {isPrinting ? "Preparing PDF..." : "Download as PDF"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default InfoSection;
