
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Activity, Brain, Heart, FileText, MessageCircle, Watch, Edit } from "lucide-react";
import { useEffect, useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Animation delay for content load
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      title: "AI Diagnostics",
      description: "Get personalized health assessments powered by advanced AI",
      icon: Brain,
      color: "bg-blue-500",
      path: "/ai-diagnostics",
      delay: 0
    },
    {
      title: "Evidence-Based Reports",
      description: "Upload and analyze your health reports with AI insights",
      icon: FileText, // Changed from FileChart
      color: "bg-indigo-500",
      path: "/reports",
      delay: 100
    },
    {
      title: "Health Assistant",
      description: "Chat with our AI health assistant for reliable advice",
      icon: MessageCircle,
      color: "bg-purple-500",
      path: "/health-assistant",
      delay: 200
    },
    {
      title: "Fitbit Integration",
      description: "Connect your wearables and track health metrics in real-time",
      icon: Watch,
      color: "bg-teal-500",
      path: "/fitbit-integration",
      delay: 300
    },
    {
      title: "Manual Data Entry",
      description: "Track your health data manually when wearables aren't available",
      icon: Edit,
      color: "bg-amber-500",
      path: "/manual-data",
      delay: 400
    }
  ];

  return (
    <div className="pt-10 pb-20 min-h-[calc(100vh-4rem)]">
      <section className={`py-16 text-center transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="mb-4 inline-flex items-center justify-center p-1 rounded-full bg-primary/10 animate-pulse-subtle">
          <Heart className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gradient animate-float">
          Your complete health ecosystem
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12">
          AI-powered health analytics and personalized insights, all in one beautiful interface
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" onClick={() => navigate("/ai-diagnostics")} className="gap-2 animate-pulse-subtle">
            <Brain className="w-5 h-5" />
            Try AI Diagnostics
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/health-assistant")} className="gap-2">
            <MessageCircle className="w-5 h-5" />
            Chat with Assistant
          </Button>
        </div>
      </section>

      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="glass-card overflow-hidden border border-border/50 h-full">
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-semibold">{feature.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="py-4">
                <div className={`w-full h-40 rounded-lg bg-muted/50 flex items-center justify-center`}>
                  <feature.icon className="w-16 h-16 text-muted-foreground/40" />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" onClick={() => navigate(feature.path)}>
                  Explore
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-16 glass rounded-3xl p-8 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Your health data, beautifully visualized</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our advanced analytics platform transforms your health data into actionable insights, 
            helping you make informed decisions about your wellbeing.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Heart Rate", icon: Heart, value: "72 bpm", status: "Normal" },
            { title: "Activity", icon: Activity, value: "8,432 steps", status: "On track" },
            { title: "Sleep", icon: Activity, value: "7h 12m", status: "Good" },
          ].map((stat, index) => (
            <div key={index} className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-lg">{stat.title}</h3>
                <stat.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.status}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold mb-8">Start your health journey today</h2>
        <Button size="lg" onClick={() => navigate("/ai-diagnostics")}>
          Get Started
        </Button>
      </section>
    </div>
  );
};

export default Index;
