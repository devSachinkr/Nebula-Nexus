import React from "react";
import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
type Props = {
  text: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
  delay?: number;
};

const Tooltip = ({ children, text, className, delay, position }: Props) => {
  return (
    <TooltipProvider>
      <ShadcnTooltip delayDuration={delay || 0}>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent className={className} side={position}>
          {text}
        </TooltipContent>
      </ShadcnTooltip>
    </TooltipProvider>
  );
};

export default Tooltip;
