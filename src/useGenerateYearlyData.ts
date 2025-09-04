import { useMemo } from "react";
import type { ChartData } from "./components/ContributionChart";

export const useGenerateYearlyData = (color: any, year: string) => {
  const startDate = useMemo(() => {
        const currentYear = parseInt(year, 10);
        return new Date(currentYear, 0, 1)
    }, [year]);

    const currentDate = new Date();

    const data: ChartData[][] = useMemo(() => {
        return Array.from({ length: 52 }, (_, weekIdx) => (
            Array.from({ length: 7 }, (_, dayIdx) => {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + weekIdx * 7 + dayIdx);

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
            })
        ))
    }, [startDate, color])


    const monthLabels: { index: number; name: string }[] = useMemo(() => {
        const labels: { index: number; name: string }[] = [];
        data.forEach((week, weekIdx) => {
            const firstDay = week[0].date;
            if (firstDay.getDate() <= 7) {
                labels.push({
                    index: weekIdx,
                    name: firstDay.toLocaleDateString('default', { month: 'short' })
                })
            }
        })
        return labels;
    }, [data, color])


    return {
        data,
        startDate,
        monthLabels
    }
}