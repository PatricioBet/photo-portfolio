import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function Card({ interactive = false, children, className = "", ...props }: CardProps) {
  return (
    <div className={`card${interactive ? " card--interactive" : ""} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
