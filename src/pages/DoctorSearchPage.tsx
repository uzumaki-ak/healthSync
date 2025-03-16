
import React, { useState } from "react";
import { Search, MapPin, Star, Video, Phone, Calendar, MessageCircle, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useDoctorSearch, Doctor } from "@/hooks/use-doctor-search";
import { DoctorProfile } from "@/components/DoctorProfile";
import { AIChatAssistant } from "@/components/AIChatAssistant";

// Define schemas
const searchFormSchema = z.object({
  query: z.string().min(2, "Please enter symptoms or condition"),
  location: z.string().optional(),
});

const DoctorSearchPage = () => {
  const { toast } = useToast();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showDoctorProfile, setShowDoctorProfile] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [consultationType, setConsultationType] = useState<"video" | "audio" | null>(null);

  // Set up form
  const form = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      query: "",
      location: "",
    },
  });

  // Use custom hook for doctor search
  const { doctors, isLoading, search } = useDoctorSearch();

  // Handle search form submission
  const onSubmit = async (data: z.infer<typeof searchFormSchema>) => {
    await search(data.query, data.location || "");
  };

  // Handle doctor selection
  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorProfile(true);
  };

  // Handle booking initialization
  const handleInitiateBooking = (doctor: Doctor, type: "video" | "audio") => {
    setSelectedDoctor(doctor);
    setConsultationType(type);
    setSelectedDate(undefined);
    setSelectedTimeSlot(null);
    setShowBookingDialog(true);
  };

  // Handle time slot selection
  const handleSelectTimeSlot = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
  };

  // Handle booking confirmation
  const handleConfirmBooking = () => {
    if (!selectedDoctor || !selectedDate || !selectedTimeSlot || !consultationType) {
      toast({
        title: "Incomplete booking information",
        description: "Please select a date, time slot, and consultation type.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically make an API call to book the appointment
    toast({
      title: "Appointment Booked Successfully!",
      description: `You have booked a ${consultationType} call with Dr. ${selectedDoctor.name} on ${format(selectedDate, "MMMM do, yyyy")} at ${selectedTimeSlot}.`,
    });
    
    setShowBookingDialog(false);
  };

  // Generate available time slots for selected date
  const getAvailableTimeSlots = () => {
    // This would typically come from an API
    return [
      "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
      "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
      "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
    ];
  };

  // Handle click on "Consult AI Assistant" button
  const handleConsultAI = () => {
    setShowAIChat(true);
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Doctor Search & Booking</h1>
        <p className="text-muted-foreground">
          Search for doctors based on symptoms or conditions, and book appointments
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input
                          placeholder="Enter symptoms or condition..."
                          className="pl-9"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="flex-1 md:max-w-[200px]">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input
                          placeholder="Location (optional)"
                          className="pl-9"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Searching..." : "Search Doctors"}
              </Button>
              <Button type="button" variant="outline" onClick={handleConsultAI}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Consult AI Assistant
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {doctors.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <User className="h-6 w-6" />
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">Dr. {doctor.name}</CardTitle>
                      <CardDescription>{doctor.specialization}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 text-sm font-medium">{doctor.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex flex-wrap gap-2 mb-3">
                  {doctor.expertise.slice(0, 3).map((skill, i) => (
                    <Badge key={i} variant="secondary">{skill}</Badge>
                  ))}
                  {doctor.expertise.length > 3 && (
                    <Badge variant="outline">+{doctor.expertise.length - 3} more</Badge>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{doctor.location}</span>
                  </div>
                  <div>
                    <span className="font-medium">${doctor.consultationFee}</span> per session
                  </div>
                </div>
              </CardContent>
              <Separator />
              <CardFooter className="pt-3 flex justify-between">
                <Button variant="outline" onClick={() => handleDoctorSelect(doctor)}>
                  View Profile
                </Button>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleInitiateBooking(doctor, "audio")}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleInitiateBooking(doctor, "video")}
                  >
                    <Video className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Doctor Profile Dialog */}
      <Dialog open={showDoctorProfile} onOpenChange={setShowDoctorProfile}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedDoctor && <DoctorProfile doctor={selectedDoctor} onBooking={handleInitiateBooking} />}
        </DialogContent>
      </Dialog>

      {/* AI Chat Assistant Dialog */}
      <Dialog open={showAIChat} onOpenChange={setShowAIChat}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>AI Health Assistant</DialogTitle>
            <DialogDescription>
              Chat with our AI assistant for basic medical advice
            </DialogDescription>
          </DialogHeader>
          <div className="h-[60vh]">
            <AIChatAssistant onRecommendDoctor={(symptoms) => {
              setShowAIChat(false);
              form.setValue("query", symptoms);
              form.handleSubmit(onSubmit)();
            }} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
            <DialogDescription>
              {selectedDoctor && (
                <span>
                  {consultationType === "video" ? "Video" : "Audio"} consultation with Dr. {selectedDoctor.name}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Select Date</h4>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => 
                  date < new Date() || 
                  date.getDay() === 0 || // Disable Sundays
                  date.getDay() === 6    // Disable Saturdays
                }
                className="rounded-md border p-3 pointer-events-auto"
              />
            </div>
            
            {selectedDate && (
              <div>
                <h4 className="font-medium mb-2">Available Time Slots</h4>
                <div className="grid grid-cols-3 gap-2">
                  {getAvailableTimeSlots().map((time) => (
                    <Button
                      key={time}
                      variant={selectedTimeSlot === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSelectTimeSlot(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="mt-4">
            <Button
              type="button"
              onClick={handleConfirmBooking}
              disabled={!selectedDate || !selectedTimeSlot}
            >
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorSearchPage;
