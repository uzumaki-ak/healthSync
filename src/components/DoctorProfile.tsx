
import React, { useState } from "react";
import { Doctor } from "@/hooks/use-doctor-search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Star, Video, Phone, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DoctorProfileProps {
  doctor: Doctor;
  onBooking: (doctor: Doctor, type: "video" | "audio") => void;
}

export function DoctorProfile({ doctor, onBooking }: DoctorProfileProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-6">
        <Avatar className="h-20 w-20">
          <User className="h-10 w-10" />
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Dr. {doctor.name}</h2>
              <p className="text-muted-foreground">{doctor.specialization}</p>
            </div>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 text-lg font-medium">{doctor.rating}</span>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {doctor.expertise.map((skill, i) => (
              <Badge key={i} variant="secondary">{skill}</Badge>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-6">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{doctor.location}</span>
            </div>
            <div>
              <span className="font-medium">${doctor.consultationFee}</span> per session
            </div>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onBooking(doctor, "audio")}
              >
                <Phone className="h-4 w-4 mr-2" /> Audio Call
              </Button>
              <Button 
                size="sm"
                onClick={() => onBooking(doctor, "video")}
              >
                <Video className="h-4 w-4 mr-2" /> Video Call
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <Tabs defaultValue="about">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="about" className="pt-4">
          <p>{doctor.about}</p>
        </TabsContent>
        
        <TabsContent value="experience" className="pt-4">
          <ul className="space-y-2">
            {doctor.experience.map((exp, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className="rounded-full w-2 h-2 bg-primary mt-2" />
                <div>{exp}</div>
              </li>
            ))}
          </ul>
        </TabsContent>
        
        <TabsContent value="education" className="pt-4">
          <ul className="space-y-2">
            {doctor.education.map((edu, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className="rounded-full w-2 h-2 bg-primary mt-2" />
                <div>{edu}</div>
              </li>
            ))}
          </ul>
        </TabsContent>
        
        <TabsContent value="reviews" className="pt-4">
          <div className="space-y-4">
            {doctor.reviews.map((review, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-base">{review.patientName}</CardTitle>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1 font-medium">{review.rating}</span>
                    </div>
                  </div>
                  <CardDescription>{review.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <Separator />
      
      <div>
        <h3 className="font-medium mb-2">Available Hours</h3>
        <div className="flex flex-wrap gap-2">
          {doctor.availability.map((slot, i) => (
            <Badge key={i} variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {slot}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
