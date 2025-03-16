
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRound, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarFallback className="text-xl">JD</AvatarFallback>
            </Avatar>
            <CardTitle>John Doe</CardTitle>
            <CardDescription>Patient ID: #12345</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>john.doe@example.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>New York, NY</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Joined Jan 2023</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Edit Profile</Button>
          </CardFooter>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Health Information</CardTitle>
            <CardDescription>Your personal health details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Allergies</h3>
              <p className="text-muted-foreground">Penicillin, Peanuts</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-medium mb-2">Current Medications</h3>
              <p className="text-muted-foreground">Vitamin D, Multivitamin</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-medium mb-2">Past Conditions</h3>
              <p className="text-muted-foreground">None reported</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-medium mb-2">Emergency Contact</h3>
              <p className="text-muted-foreground">
                Jane Doe (Spouse)<br />
                +1 (555) 987-6543
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline">Update Health Information</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
