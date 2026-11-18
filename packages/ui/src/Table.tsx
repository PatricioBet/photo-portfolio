import React from "react";

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  caption?: string;
}

export function Table({ caption, children, ...props }: TableProps) {
  return (
    <div className="table-wrapper">
      <table {...props}>
        {caption && <caption className="sr-only">{caption}</caption>}
        {children}
      </table>
    </div>
  );
}
