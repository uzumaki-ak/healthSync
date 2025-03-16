
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, SendHorizontal, User, Bot, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { chatWithHealthAssistant } from "@/services/gemini-api";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface Message {
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
}

const HealthAssistantPage = () => {
  const { toast } = useToast();
  const [apiKey] = useLocalStorage<string>("gemini-api-key", "");
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your health assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please set your Gemini API key in the AI Diagnostics section first",
        variant: "destructive"
      });
      return;
    }
    
    if (!messageInput.trim()) return;
    
    const userMessage: Message = {
      role: "user",
      content: messageInput,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setMessageInput("");
    setIsLoading(true);
    
    try {
      // Convert messages to the format expected by the API
      const chatHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      const response = await chatWithHealthAssistant(apiKey, messageInput, chatHistory);
      
      if (typeof response === "object" && response.error) {
        throw new Error(response.error);
      }
      
      const assistantMessage: Message = {
        role: "assistant",
        content: typeof response === "string" ? response : "I'm sorry, I couldn't process your request.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Message Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I encountered an error. Please try again later.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container max-w-4xl py-12 animate-fade-in">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MessageCircle className="h-6 w-6" />
            Health Assistant
          </h1>
          <p className="text-muted-foreground mt-1">
            Chat with our AI-powered health assistant for reliable advice
          </p>
        </div>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Chat with Health Assistant</CardTitle>
            <CardDescription>
              Ask health-related questions and get evidence-based answers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] overflow-y-auto pr-4 space-y-4 mb-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex gap-3 max-w-[80%] ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    } p-3 rounded-lg`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {message.role === "user" ? (
                        <User className="h-5 w-5" />
                      ) : (
                        <Bot className="h-5 w-5" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 text-right">{formatTime(message.timestamp)}</p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 bg-muted p-3 rounded-lg">
                    <Bot className="h-5 w-5" />
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "600ms" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <CardFooter>
            <form onSubmit={handleSendMessage} className="flex w-full gap-2">
              <Input
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !messageInput.trim()}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <SendHorizontal className="h-4 w-4" />
                )}
              </Button>
            </form>
          </CardFooter>
        </Card>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Suggested Questions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "What are common symptoms of seasonal allergies?",
              "How can I improve my sleep quality?",
              "What foods are good for heart health?",
              "How often should I exercise each week?",
              "What are the signs of dehydration?",
              "How can I reduce stress naturally?",
            ].map((question, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start h-auto py-3 px-4"
                onClick={() => {
                  setMessageInput(question);
                }}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                <span className="text-sm text-left">{question}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthAssistantPage;
