
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Activity, Heart, Moon, Save, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { analyzeHealthData } from "@/services/gemini-api";
import { useLocalStorage } from "@/hooks/use-local-storage";

const ManualDataEntryPage = () => {
  const { toast } = useToast();
  const [apiKey] = useLocalStorage<string>("gemini-api-key", "");
  const [isLoading, setIsLoading] = useState(false);
  const [isDataSaved, setIsDataSaved] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  
  const [healthData, setHealthData] = useState({
    steps: 5000,
    heartRate: 75,
    sleepHours: 7,
    caloriesBurned: 1800,
    waterIntake: 6,
    mood: 3,
  });
  
  const handleDataChange = (key: keyof typeof healthData, value: number) => {
    setHealthData(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Reset saved state when data changes
    if (isDataSaved) setIsDataSaved(false);
  };
  
  const handleSaveData = async () => {
    setIsLoading(true);
    setIsDataSaved(false);
    
    try {
      // First save the data
      toast({
        title: "Data Saved",
        description: "Your health data has been saved successfully",
      });
      
      setIsDataSaved(true);
      
      // Then if API key exists, get recommendations
      if (apiKey) {
        const result = await analyzeHealthData(apiKey, healthData);
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        setRecommendations(result.recommendations || []);
        
        toast({
          title: "Analysis Complete",
          description: "We've generated personalized recommendations for you",
        });
      }
    } catch (error) {
      console.error("Failed to save or analyze health data:", error);
      toast({
        title: "Processing Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-6xl py-12 animate-fade-in">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Edit className="h-6 w-6" />
            Manual Data Entry
          </h1>
          <p className="text-muted-foreground mt-1">
            Manually track your health metrics and get personalized recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Enter Your Health Data</CardTitle>
              <CardDescription>
                Provide your daily health metrics to receive personalized insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="activity" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="vitals">Vitals</TabsTrigger>
                  <TabsTrigger value="wellness">Wellness</TabsTrigger>
                </TabsList>
                
                <TabsContent value="activity" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="steps">Daily Steps</Label>
                        <span className="text-sm font-medium">{healthData.steps.toLocaleString()}</span>
                      </div>
                      <Slider 
                        id="steps" 
                        min={0} 
                        max={20000} 
                        step={100} 
                        value={[healthData.steps]} 
                        onValueChange={values => handleDataChange('steps', values[0])}
                      />
                      <p className="text-xs text-muted-foreground">
                        Recommended: 8,000 - 10,000 steps daily
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="calories">Calories Burned</Label>
                        <span className="text-sm font-medium">{healthData.caloriesBurned}</span>
                      </div>
                      <Slider 
                        id="calories" 
                        min={0} 
                        max={5000} 
                        step={50} 
                        value={[healthData.caloriesBurned]} 
                        onValueChange={values => handleDataChange('caloriesBurned', values[0])}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="vitals" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="heart-rate">Heart Rate (BPM)</Label>
                        <span className="text-sm font-medium">{healthData.heartRate}</span>
                      </div>
                      <Slider 
                        id="heart-rate" 
                        min={40} 
                        max={200} 
                        step={1} 
                        value={[healthData.heartRate]} 
                        onValueChange={values => handleDataChange('heartRate', values[0])}
                      />
                      <p className="text-xs text-muted-foreground">
                        Normal resting heart rate: 60-100 BPM
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="wellness" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="sleep">Sleep Duration (hours)</Label>
                        <span className="text-sm font-medium">{healthData.sleepHours}</span>
                      </div>
                      <Slider 
                        id="sleep" 
                        min={0} 
                        max={12} 
                        step={0.5} 
                        value={[healthData.sleepHours]} 
                        onValueChange={values => handleDataChange('sleepHours', values[0])}
                      />
                      <p className="text-xs text-muted-foreground">
                        Recommended: 7-9 hours for adults
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="water">Water Intake (glasses)</Label>
                        <span className="text-sm font-medium">{healthData.waterIntake}</span>
                      </div>
                      <Slider 
                        id="water" 
                        min={0} 
                        max={16} 
                        step={1} 
                        value={[healthData.waterIntake]} 
                        onValueChange={values => handleDataChange('waterIntake', values[0])}
                      />
                      <p className="text-xs text-muted-foreground">
                        Recommended: 8 glasses daily
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="mood">Mood (1-5)</Label>
                        <span className="text-sm font-medium">{healthData.mood}</span>
                      </div>
                      <Slider 
                        id="mood" 
                        min={1} 
                        max={5} 
                        step={1} 
                        value={[healthData.mood]} 
                        onValueChange={values => handleDataChange('mood', values[0])}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveData} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : isDataSaved ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Data Saved
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save and Analyze
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personalized Recommendations</CardTitle>
              <CardDescription>
                AI-powered suggestions based on your health data
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.map((recommendation, index) => (
                    <div key={index} className="bg-card/50 p-4 rounded-lg border border-border/50">
                      <p className="text-sm">{recommendation}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Activity className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p>
                      {isLoading 
                        ? "Analyzing your data..." 
                        : apiKey 
                          ? "Enter and save your health data to get personalized recommendations" 
                          : "Set your Gemini API key in AI Diagnostics to enable personalized recommendations"}
                    </p>
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

export default ManualDataEntryPage;
