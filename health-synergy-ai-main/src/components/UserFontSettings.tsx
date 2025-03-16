
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { Type } from "lucide-react";

export function UserFontSettings() {
  const [fontSize, setFontSize] = useState("medium");
  const [fontFamily, setFontFamily] = useState("sans");
  
  useEffect(() => {
    // Apply the font size
    const htmlElement = document.documentElement;
    
    switch (fontSize) {
      case "small":
        htmlElement.style.fontSize = "14px";
        break;
      case "medium":
        htmlElement.style.fontSize = "16px";
        break;
      case "large":
        htmlElement.style.fontSize = "18px";
        break;
      case "x-large":
        htmlElement.style.fontSize = "20px";
        break;
      default:
        htmlElement.style.fontSize = "16px";
    }
    
    // Apply the font family
    switch (fontFamily) {
      case "sans":
        htmlElement.style.fontFamily = "Inter, sans-serif";
        break;
      case "display":
        htmlElement.style.fontFamily = "SF Pro Display, sans-serif";
        break;
      case "serif":
        htmlElement.style.fontFamily = "Playfair Display, serif";
        break;
      case "mono":
        htmlElement.style.fontFamily = "SF Mono, monospace";
        break;
      default:
        htmlElement.style.fontFamily = "Inter, sans-serif";
    }
    
    // Save preferences
    localStorage.setItem("font-size", fontSize);
    localStorage.setItem("font-family", fontFamily);
  }, [fontSize, fontFamily]);
  
  // Load saved preferences
  useEffect(() => {
    const savedFontSize = localStorage.getItem("font-size");
    const savedFontFamily = localStorage.getItem("font-family");
    
    if (savedFontSize) setFontSize(savedFontSize);
    if (savedFontFamily) setFontFamily(savedFontFamily);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Type className="h-5 w-5" />
          <span className="sr-only">Font settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Text Size</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={fontSize} onValueChange={setFontSize}>
          <DropdownMenuRadioItem value="small">Small</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="medium">Medium</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="large">Large</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="x-large">X-Large</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Font Style</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={fontFamily} onValueChange={setFontFamily}>
          <DropdownMenuRadioItem value="sans">Inter</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="display">SF Pro Display</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="serif">Playfair Display</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="mono">SF Mono</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
