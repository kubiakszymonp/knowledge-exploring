"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AVAILABLE_STYLES,
  AVAILABLE_EDGE_STYLES,
  STYLE_LABELS,
  EDGE_STYLE_LABELS,
  ArticleStyle,
  EdgeStyle,
} from "@/lib/loadStylizations";

interface StyleSettingsProps {
  articleStyle: ArticleStyle;
  edgeStyle: EdgeStyle;
  onArticleStyleChange: (style: ArticleStyle) => void;
  onEdgeStyleChange: (style: EdgeStyle) => void;
}

export function StyleSettings({
  articleStyle,
  edgeStyle,
  onArticleStyleChange,
  onEdgeStyleChange,
}: StyleSettingsProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-card/50 backdrop-blur-sm border rounded-xl">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Styl artykułu:</span>
        <Select value={articleStyle} onValueChange={(v) => onArticleStyleChange(v as ArticleStyle)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {AVAILABLE_STYLES.map((style) => (
              <SelectItem key={style} value={style}>
                {STYLE_LABELS[style]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Styl zajawek:</span>
        <Select value={edgeStyle} onValueChange={(v) => onEdgeStyleChange(v as EdgeStyle)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {AVAILABLE_EDGE_STYLES.map((style) => (
              <SelectItem key={style} value={style}>
                {EDGE_STYLE_LABELS[style]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

