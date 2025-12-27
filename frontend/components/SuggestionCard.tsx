"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface SuggestionCardProps {
  teaser: string;
  targetTitle: string;
  targetTags?: string[];
  onClick: () => void;
  index: number;
}

export function SuggestionCard({
  teaser,
  targetTitle,
  targetTags = [],
  onClick,
  index,
}: SuggestionCardProps) {
  const delays = ["0ms", "75ms", "150ms"];
  
  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-primary/50 bg-gradient-to-br from-card to-muted/30"
      style={{ animationDelay: delays[index] || "0ms" }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 space-y-3">
          <p className="text-base leading-relaxed text-foreground/90">
            {teaser}
          </p>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">{targetTitle}</span>
            {targetTags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="shrink-0 p-2 rounded-full bg-primary/10 text-primary transition-transform duration-300 group-hover:translate-x-1">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Card>
  );
}

