"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

// DayPicker 및 관련 타입 제거
// Calendar 컴포넌트는 현재 비활성화 상태로 남겨둡니다.
// 필요시 대체 달력 라이브러리 또는 커스텀 UI로 교체할 수 있습니다.

// export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar() {
  return (
    <div className="p-3 text-red-500">달력 컴포넌트가 비활성화되었습니다. (react-day-picker 미사용)</div>
  );
}
Calendar.displayName = "Calendar"

export { Calendar }
