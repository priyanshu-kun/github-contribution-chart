import { useMemo } from "react";
import type { ChartData } from "./components/ContributionChart";


const weeks: Record<number, string>  = {
    0: 'Mon',
    1: 'Tue',
    2: 'Wed',
    3: 'Thu',
    4: 'Fri',
    5: 'Sat',
    6: 'Sun',
}


export const useGenerateMontlyData = (color: any, year: string | null, month: string | null) => {

    function calendarWeeksInMonth(year: number, month: number) {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const totalSlots = firstDay + daysInMonth;
        return Math.ceil(totalSlots / 7);
    }

    const { startDate, weeksCount } = useMemo(() => {
        const currentYear = year ? parseInt(year, 10) : new Date().getFullYear();
        const currentMonth = month ? parseInt(month, 10) : new Date().getMonth();
        const startDate = new Date(currentYear, currentMonth, 1);
        const weeksCount = calendarWeeksInMonth(currentYear, currentMonth);
        return {
            startDate,
            weeksCount
        }
    }, [year, month]);

    const currentDate = new Date();

    const monthlyData: ChartData[][] = useMemo(() => {
        const currentMonth = startDate.getMonth();
        const currentYear = startDate.getFullYear();

        return Array.from({ length: weeksCount }, (_, weekIdx) => (
            Array.from({ length: 7 }, (_, dayIdx) => {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + weekIdx * 7 + dayIdx);

                if (date.getMonth() !== currentMonth || date.getFullYear() !== currentYear) {
                    return null;
                }

                if (date > currentDate) {
                    return {
                        count: 0,
                        date
                    }
                }

                return {
                    count: Math.floor(Math.random() * 6),
                    date,
                };
            }).filter(Boolean)
        )).filter(week => week.length > 0) as ChartData[][]
    }, [startDate, currentDate]);

    const weeksLables: { index: number; name: string }[] = useMemo(() => {
        const labels: { index: number; name: string }[] = [];
        monthlyData.forEach((_, weekIdx: number) => {
            labels.push({
                index: weekIdx,
                name: weeks[weekIdx] 
            })
        })
        return labels;
    }, [monthlyData, color])

    return {
        monthlyData,
        startDate,
        weeksLables
    }
}