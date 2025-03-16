import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, AlertTriangle, Check, Loader2, LineChart, Battery, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { analyzeHealthReport } from "@/services/gemini-api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ReportsPage = () => {
  const { toast } = useToast();
  const [apiKey] = useLocalStorage<string>("gemini-api-key", "");
  const [reportType, setReportType] = useState("blood_test");
  const [reportContent, setReportContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const handleAnalyzeReport = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please set your Gemini API key in the AI Diagnostics section first",
        variant: "destructive"
      });
      return;
    }
    
    if (!reportContent) {
      toast({
        title: "Report Content Required",
        description: "Please enter your report data to analyze",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await analyzeHealthReport(apiKey, reportType, reportContent);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setResults(result);
      
      toast({
        title: "Report Analysis Complete",
        description: "Your health report has been analyzed",
      });
    } catch (error) {
      console.error("Report analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const reportTypes = [
    { value: "blood_test", label: "Blood Test" },
    { value: "ecg", label: "ECG/EKG Report" },
    { value: "mri", label: "MRI Results" },
    { value: "cholesterol", label: "Cholesterol Panel" },
    { value: "thyroid", label: "Thyroid Function Test" },
    { value: "liver_function", label: "Liver Function Test" },
    { value: "kidney_function", label: "Kidney Function Test" },
    { value: "glucose", label: "Glucose Test" },
  ];
  
  const clearForm = () => {
    setReportContent("");
    setResults(null);
  };

  return (
    <div className="container max-w-6xl py-12 animate-fade-in">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Evidence-Based Reports
          </h1>
          <p className="text-muted-foreground mt-1">
            Upload your health reports to get AI-powered insights and recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Upload Health Report</CardTitle>
              <CardDescription>
                Enter your report details to receive a comprehensive analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="report-type">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger id="report-type">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="report-content">Report Data</Label>
                <Textarea
                  id="report-content"
                  placeholder="Paste your report results here..."
                  value={reportContent}
                  onChange={(e) => setReportContent(e.target.value)}
                  className="min-h-[200px]"
                />
                <p className="text-xs text-muted-foreground">
                  Paste the full contents of your report, including all values and reference ranges
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button onClick={handleAnalyzeReport} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Analyze Report
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={clearForm} disabled={isLoading} className="flex-shrink-0">
                Clear
              </Button>
            </CardFooter>
          </Card>

          {results ? (
            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle>Report Analysis</CardTitle>
                <CardDescription>
                  AI-generated insights from your health report
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="summary" className="w-full">
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="findings">Findings</TabsTrigger>
                    <TabsTrigger value="risks">Risks</TabsTrigger>
                    <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="summary" className="space-y-4">
                    <div className="bg-card p-4 rounded-lg border border-border/50">
                      <div className="flex items-center gap-2 mb-2">
                        <LineChart className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Summary</h3>
                      </div>
                      <p className="text-sm">{results.summary}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-card p-4 rounded-lg border border-border/50">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold">Health Trends</h3>
                        </div>
                        <ul className="text-sm space-y-1 list-disc pl-5">
                          {results.healthTrends?.map((trend: string, index: number) => (
                            <li key={index}>{trend}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-card p-4 rounded-lg border border-border/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Battery className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold">Risk Assessment</h3>
                        </div>
                        <div className="text-sm">
                          <p className="mb-1">
                            <span className="font-medium">Level:</span>{" "}
                            <span className={`${
                              results.riskAssessment?.level === "high" ? "text-red-500" :
                              results.riskAssessment?.level === "medium" ? "text-amber-500" :
                              "text-green-500"
                            }`}>
                              {results.riskAssessment?.level}
                            </span>
                          </p>
                          <p>{results.riskAssessment?.details}</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="findings" className="space-y-4">
                    <div className="bg-card p-4 rounded-lg border border-border/50">
                      <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        <h3 className="font-semibold">Abnormal Findings</h3>
                      </div>
                      
                      {results.abnormalFindings?.length > 0 ? (
                        <div className="space-y-3">
                          {results.abnormalFindings.map((finding: any, index: number) => (
                            <div key={index} className="border-b border-border/50 pb-3 last:border-0 last:pb-0">
                              <div className="flex justify-between">
                                <h4 className="font-medium">{finding.metric}</h4>
                                <span className={`px-2 py-0.5 rounded text-xs ${
                                  finding.value > finding.normalRange ? "bg-red-500/10 text-red-500" : 
                                  finding.value < finding.normalRange ? "bg-amber-500/10 text-amber-500" : 
                                  "bg-green-500/10 text-green-500"
                                }`}>
                                  {finding.value}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">Normal range: {finding.normalRange}</p>
                              <p className="text-sm mt-1">{finding.concern}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-green-500 bg-green-500/10 p-3 rounded-lg">
                          <Check className="h-5 w-5" />
                          <p className="text-sm">No abnormal findings detected</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="risks" className="space-y-4">
                    <div className="bg-card p-4 rounded-lg border border-border/50">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingDown className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Risk Assessment</h3>
                      </div>
                      
                      <div className={`p-4 rounded-lg mb-4 ${
                        results.riskAssessment?.level === "high" ? "bg-red-500/10 border border-red-500/20" :
                        results.riskAssessment?.level === "medium" ? "bg-amber-500/10 border border-amber-500/20" :
                        "bg-green-500/10 border border-green-500/20"
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`w-3 h-3 rounded-full ${
                            results.riskAssessment?.level === "high" ? "bg-red-500" :
                            results.riskAssessment?.level === "medium" ? "bg-amber-500" :
                            "bg-green-500"
                          }`}></span>
                          <h4 className="font-medium">
                            {results.riskAssessment?.level === "high" ? "High Risk" :
                            results.riskAssessment?.level === "medium" ? "Medium Risk" :
                            "Low Risk"}
                          </h4>
                        </div>
                        <p className="text-sm">{results.riskAssessment?.details}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Long-term considerations:</h4>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {results.healthTrends?.map((trend: string, index: number) => (
                            <li key={index}>{trend}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="recommendations" className="space-y-4">
                    <div className="bg-card p-4 rounded-lg border border-border/50">
                      <div className="flex items-center gap-2 mb-4">
                        <Check className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Recommendations</h3>
                      </div>
                      
                      <ul className="space-y-2">
                        {results.recommendations?.map((rec: string, index: number) => (
                          <li key={index} className="bg-muted/30 p-3 rounded-lg flex items-start gap-3">
                            <div className="mt-1 flex-shrink-0">
                              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-xs font-medium text-primary">{index + 1}</span>
                              </div>
                            </div>
                            <p className="text-sm">{rec}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="pt-4">
                      <Button variant="outline" className="w-full">
                        Download Report
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground w-full text-center">
                  This analysis is generated by AI and should not replace professional medical advice
                </p>
              </CardFooter>
            </Card>
          ) : (
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle>Report Analysis</CardTitle>
                <CardDescription>
                  Upload your health report to get AI-powered insights
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <FileText className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p>Enter your report details and click "Analyze Report" to get started</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
