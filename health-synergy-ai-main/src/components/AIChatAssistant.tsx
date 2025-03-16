import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { chatWithHealthAssistant } from "@/services/gemini-api";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Avatar } from "@/components/ui/avatar";
import { Bot, Send, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatAssistantProps {
  onRecommendDoctor: (symptoms: string) => void;
}

export function AIChatAssistant({ onRecommendDoctor }: AIChatAssistantProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi there! I'm your health assistant. How can I help you today? Feel free to describe your symptoms or health concerns.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [apiKey] = useLocalStorage<string>("gemini-api-key", "");

  const handleSend = async () => {
    if (!input.trim()) return;
    
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your Gemini API key in the settings.",
        variant: "destructive",
      });
      return;
    }
    
    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      const conversationPrompt = messages
        .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
        .join("\n\n") + `\n\nUser: ${input}\n\nAssistant:`;
      
      const response = await chatWithHealthAssistant(apiKey, conversationPrompt);
      
      setMessages((prev) => [
        ...prev, 
        { role: "assistant", content: response }
      ]);
      
      if (
        response.toLowerCase().includes("recommend seeing a doctor") ||
        response.toLowerCase().includes("consult with a doctor") ||
        response.toLowerCase().includes("visit a specialist") ||
        response.toLowerCase().includes("should see a doctor")
      ) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "Would you like me to help you find a doctor specializing in these symptoms?",
            },
          ]);
        }, 1000);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindDoctor = () => {
    const userMessages = messages
      .filter((msg) => msg.role === "user")
      .map((msg) => msg.content)
      .join(" ");
    
    onRecommendDoctor(userMessages);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                message.role === "user" ? "justify-end" : ""
              }`}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8">
                  <Bot className="h-4 w-4" />
                </Avatar>
              )}
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {message.content}
              </div>
              {message.role === "user" && (
                <Avatar className="h-8 w-8">
                  <User className="h-4 w-4" />
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <Bot className="h-4 w-4" />
              </Avatar>
              <div className="rounded-lg px-4 py-2 bg-muted">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
                  <div className="h-2 w-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <div className="h-2 w-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="border-t p-4 space-y-2">
        {messages.some((msg) => 
          msg.role === "assistant" && 
          msg.content.includes("Would you like me to help you find a doctor")
        ) && (
          <Button onClick={handleFindDoctor} className="w-full">
            Find a Doctor
          </Button>
        )}
        
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your symptoms or health concerns..."
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
