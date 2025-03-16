
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Watch, Activity, Heart, Moon } from "lucide-react";
import { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/hooks/use-toast";

const FitbitIntegrationPage = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useLocalStorage<string>("fitbit-api-key", "");
  const [isConnected, setIsConnected] = useState(false);
  
  const handleConnect = () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Fitbit API key to connect",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate successful connection
    setIsConnected(true);
    toast({
      title: "Connected Successfully",
      description: "Your Fitbit device is now connected to HealthSync",
    });
  };

  return (
    <div className="container max-w-6xl py-12 animate-fade-in">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Watch className="h-6 w-6" />
            Fitbit Integration
          </h1>
          <p className="text-muted-foreground mt-1">
            Connect your Fitbit device to track real-time health metrics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Connect Your Device</CardTitle>
              <CardDescription>
                Enter your Fitbit API key to enable device synchronization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">Fitbit API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your Fitbit API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Your API key is securely stored locally and never sent to our servers
                </p>
              </div>
              
              <Button 
                onClick={handleConnect} 
                className="w-full"
                variant={isConnected ? "outline" : "default"}
              >
                {isConnected ? "Connected" : "Connect Device"}
              </Button>
            </CardContent>
          </Card>

          <Card className={`${isConnected ? 'bg-card' : 'bg-muted/30'}`}>
            <CardHeader>
              <CardTitle>Health Metrics</CardTitle>
              <CardDescription>
                {isConnected 
                  ? "Real-time health data from your Fitbit device" 
                  : "Connect your device to view health metrics"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isConnected ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Steps", value: "8,742", icon: Activity, color: "text-blue-500" },
                      { label: "Heart Rate", value: "72 bpm", icon: Heart, color: "text-red-500" },
                      { label: "Sleep", value: "7h 30m", icon: Moon, color: "text-purple-500" },
                      { label: "Calories", value: "1,842", icon: Activity, color: "text-orange-500" },
                    ].map((metric, index) => (
                      <div key={index} className="bg-background/50 p-4 rounded-lg border border-border/50">
                        <div className="flex items-center gap-2 mb-1">
                          <metric.icon className={`h-5 w-5 ${metric.color}`} />
                          <h3 className="font-medium">{metric.label}</h3>
                        </div>
                        <p className="text-2xl font-bold">{metric.value}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-center pt-4">
                    <p className="text-xs text-muted-foreground">
                      Last updated: Today, 12:45 PM
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Watch className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p>Connect your Fitbit device to view health metrics</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FitbitIntegrationPage;
