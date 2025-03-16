
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bell, Lock, Eye, Smartphone, BellOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account information and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">Personal Information</h3>
                <p className="text-sm text-muted-foreground">Update your personal details</p>
                <Button variant="outline" size="sm" className="mt-2">Edit Profile</Button>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-medium">Email Address</h3>
                <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                <Button variant="outline" size="sm" className="mt-2">Change Email</Button>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-medium">Password</h3>
                <p className="text-sm text-muted-foreground">Last updated 3 months ago</p>
                <Button variant="outline" size="sm" className="mt-2">Change Password</Button>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-medium">Delete Account</h3>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                <Button variant="destructive" size="sm" className="mt-2">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Control how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="appointment-notifications">Appointment Reminders</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications about upcoming appointments</p>
                  </div>
                  <Switch id="appointment-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="health-tips">Health Tips & Advice</Label>
                    <p className="text-sm text-muted-foreground">Receive personalized health tips based on your data</p>
                  </div>
                  <Switch id="health-tips" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="medication-reminders">Medication Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get notified when it's time to take your medication</p>
                  </div>
                  <Switch id="medication-reminders" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Receive updates about new features and offers</p>
                  </div>
                  <Switch id="marketing-emails" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Manage your data and privacy preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="data-sharing">Data Sharing with Doctors</Label>
                    <p className="text-sm text-muted-foreground">Allow your doctors to access your health data</p>
                  </div>
                  <Switch id="data-sharing" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="analytics">Analytics & Improvements</Label>
                    <p className="text-sm text-muted-foreground">Help improve our services by sharing anonymous usage data</p>
                  </div>
                  <Switch id="analytics" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="third-party">Third-Party Integration</Label>
                    <p className="text-sm text-muted-foreground">Allow integration with third-party health services</p>
                  </div>
                  <Switch id="third-party" />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="font-medium">Download Your Data</h3>
                <p className="text-sm text-muted-foreground">Get a copy of all your personal health data</p>
                <Button variant="outline" size="sm" className="mt-2">Request Data Export</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize how the application looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">Theme</h3>
                <p className="text-sm text-muted-foreground">Select your preferred theme</p>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" className="px-4">Light</Button>
                  <Button variant="outline" size="sm" className="px-4">Dark</Button>
                  <Button variant="outline" size="sm" className="px-4">System</Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="font-medium">Font Size</h3>
                <p className="text-sm text-muted-foreground">Adjust the text size across the application</p>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm">Small</Button>
                  <Button variant="outline" size="sm">Medium</Button>
                  <Button variant="outline" size="sm">Large</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
