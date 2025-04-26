import React from "react";
import { Button } from "@/components/ui/button";

interface PaginationButtonsProps {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export default function PaginationButtons({ totalPages, currentPage, setCurrentPage }: PaginationButtonsProps) {
  const maxButtons = 7;
  let start = Math.max(1, currentPage - 3);
  let end = Math.min(totalPages, currentPage + 3);
  if (end - start < maxButtons - 1) {
    if (start === 1) {
      end = Math.min(totalPages, start + maxButtons - 1);
    } else if (end === totalPages) {
      start = Math.max(1, end - maxButtons + 1);
    }
  }
  const buttons = [];
  for (let i = start; i <= end; i++) {
    buttons.push(
      <Button
        key={i}
        variant={i === currentPage ? "default" : "outline"}
        size="sm"
        className={i === currentPage ? "font-bold border-primary" : ""}
        onClick={() => setCurrentPage(i)}
        disabled={i === currentPage}
      >
        {i}
      </Button>
    );
  }
  return <>{buttons}</>;
}
