
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Brain, Pill, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateHealthAssessment, SymptomDetails } from "@/services/gemini-api";
import { useLocalStorage } from "@/hooks/use-local-storage";

const AIDialognosticsPage = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useLocalStorage<string>("gemini-api-key", "");
  const [isSettingApiKey, setIsSettingApiKey] = useState(!apiKey);
  
  const [symptomInput, setSymptomInput] = useState("");
  const [severity, setSeverity] = useState("moderate");
  const [duration, setDuration] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const handleApiKeySave = () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key to continue",
        variant: "destructive"
      });
      return;
    }
    
    setIsSettingApiKey(false);
    toast({
      title: "API Key Saved",
      description: "Your Gemini API key has been saved",
    });
  };
  
  const handleAnalysis = async () => {
    if (!symptomInput) {
      toast({
        title: "Symptoms Required",
        description: "Please enter your symptoms to receive an analysis",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    
    try {
      const symptoms: SymptomDetails = {
        symptom: symptomInput,
        severity,
        duration,
        additionalInfo
      };
      
      const response = await generateHealthAssessment(apiKey, symptoms);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setResult(response);
      
      toast({
        title: "Analysis Complete",
        description: "Your health assessment has been generated",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearForm = () => {
    setSymptomInput("");
    setSeverity("moderate");
    setDuration("");
    setAdditionalInfo("");
    setResult(null);
  };
  
  if (isSettingApiKey) {
    return (
      <div className="container max-w-4xl py-12 animate-fade-in">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Brain className="h-6 w-6" />
              AI Diagnostics Setup
            </CardTitle>
            <CardDescription>
              To use the AI Diagnostics feature, you need to provide your Gemini API key
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">Gemini API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your Gemini API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Your API key is stored locally and never sent to our servers
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleApiKeySave} className="w-full">Save API Key</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-12 animate-fade-in">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Brain className="h-6 w-6" />
              AI Diagnostics
            </h1>
            <p className="text-muted-foreground mt-1">
              Get personalized health assessments based on your symptoms
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsSettingApiKey(true)}>
            Change API Key
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Enter Your Symptoms</CardTitle>
              <CardDescription>
                Provide details about your symptoms for a more accurate assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="symptoms">Symptoms</Label>
                <Textarea
                  id="symptoms"
                  placeholder="Describe your symptoms in detail"
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                  className="min-h-24"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <Select value={severity} onValueChange={setSeverity}>
                  <SelectTrigger id="severity">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="How long have you experienced these symptoms?"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additional">Additional Information</Label>
                <Textarea
                  id="additional"
                  placeholder="Any other relevant health information"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button onClick={handleAnalysis} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Symptoms"
                )}
              </Button>
              <Button variant="outline" onClick={clearForm} disabled={isLoading} className="flex-shrink-0">
                Clear
              </Button>
            </CardFooter>
          </Card>
          
          {result ? (
            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle>Symptom Analysis</CardTitle>
                <CardDescription>
                  AI-generated health assessment based on your symptoms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Analysis</h3>
                  <p className="text-sm">{result.analysis}</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Possible Causes</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {result.possibleCauses?.map((cause: string, index: number) => (
                      <li key={index} className="text-sm">{cause}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Pill className="h-5 w-5" />
                    Medicine Recommendations
                  </h3>
                  {result.medicineRecommendations?.length > 0 ? (
                    <div className="space-y-4">
                      {result.medicineRecommendations.map((med: any, index: number) => (
                        <div key={index} className="bg-muted/30 p-3 rounded-lg">
                          <h4 className="font-medium">{med.name}</h4>
                          <p className="text-sm text-muted-foreground">Dosage: {med.dosage}</p>
                          <p className="text-sm text-muted-foreground">Purpose: {med.purpose}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No specific medications recommended</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {result.doctorConsultation?.needed ? (
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    Doctor Consultation
                  </h3>
                  <div className={`p-3 rounded-lg ${
                    result.doctorConsultation?.needed 
                      ? "bg-amber-500/10 text-amber-500 dark:bg-amber-900/20 dark:text-amber-300" 
                      : "bg-green-500/10 text-green-500 dark:bg-green-900/20 dark:text-green-300"
                  }`}>
                    <p className="font-medium">
                      {result.doctorConsultation?.needed ? "Recommended" : "Not necessary at this time"}
                    </p>
                    {result.doctorConsultation?.urgency && (
                      <p className="text-sm">Urgency: {result.doctorConsultation.urgency}</p>
                    )}
                    {result.doctorConsultation?.reason && (
                      <p className="text-sm">{result.doctorConsultation.reason}</p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground w-full text-center">
                  This assessment is generated by AI and should not replace professional medical advice
                </p>
              </CardFooter>
            </Card>
          ) : (
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle>Symptom Analysis</CardTitle>
                <CardDescription>
                  Enter your symptoms to receive an AI-generated health assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Brain className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p>Provide your symptoms and click "Analyze Symptoms" to get started</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIDialognosticsPage;
