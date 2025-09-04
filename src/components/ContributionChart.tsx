import React, { useMemo, memo, useState } from 'react'
import { getColor } from '../utils/utils';
import Tooltip from './Tooltip';
import { useGenerateYearlyData } from '../useGenerateYearlyData';
import { useGenerateMontlyData } from '../useGenerateMonthlyData';


export interface ChartData {
    count: number;
    date: Date;
}

export type TooltipData = {
    x: number;
    y: number;
    text: string;
} | null;

const DayCell = memo(({ day, color, onHover, onLeave, onDayClick }: { day: ChartData, color: string, onHover: (e: React.MouseEvent, day: ChartData) => void, onLeave: () => void; onDayClick: (day: ChartData) => void }) => {
    return (
        <div
            title={`${day.count ? day.count : "No"} contributions on ${day.date}`}
            onMouseEnter={(e) => onHover(e, day)}
            onMouseLeave={onLeave}
            onClick={() => onDayClick(day)}
            className={`w-[clamp(0.8rem,1.2vw,1rem)] h-[clamp(0.8rem,1.2vw,1rem)] rounded-sm ${getColor(
                day.count, color
            )}`}
        >
        </div>
    )
})

function ContributionChart({ color, year, onDayClick }: { color: string; year: string; onDayClick: (day: ChartData) => void }) {


    const [tooltip, setTooltip] = useState<TooltipData>(null);
    const {data, monthLabels} = useGenerateYearlyData(color, year);
    const {monthlyData} = useGenerateMontlyData(color, null, null);

    console.log(monthlyData)


    const handleHover = (e: React.MouseEvent, day: ChartData) => {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        setTooltip({
            x: rect.left + rect.width / 2,
            y: rect.top - 8,
            text: `${day.count} contributions on ${day.date.toDateString()}`,
        });
    };

    const handleLeave = () => setTooltip(null);

    const getLegendColors = () => {
        const colorMap = {
            green: ['bg-green-100/30', 'bg-green-200', 'bg-green-400', 'bg-green-500', 'bg-green-600', 'bg-green-800'],
            emerald: ['bg-emerald-100/30', 'bg-emerald-200', 'bg-emerald-400', 'bg-emerald-500', 'bg-emerald-600', 'bg-emerald-800'],
            amber: ['bg-amber-100/30', 'bg-amber-200', 'bg-amber-400', 'bg-amber-500', 'bg-amber-600', 'bg-amber-800'],
            cyan: ['bg-cyan-100/30', 'bg-cyan-200', 'bg-cyan-400', 'bg-cyan-500', 'bg-cyan-600', 'bg-cyan-800'],
            fuchsia: ['bg-fuchsia-100/30', 'bg-fuchsia-200', 'bg-fuchsia-400', 'bg-fuchsia-500', 'bg-fuchsia-600', 'bg-fuchsia-800'],
            rose: ['bg-rose-100/30', 'bg-rose-200', 'bg-rose-400', 'bg-rose-500', 'bg-rose-600', 'bg-rose-800'],
        };

        const colors = colorMap[color as keyof typeof colorMap] || colorMap.green;

        return colors;
    }

    const legendColors = [
        getLegendColors()[0],
        getLegendColors()[1],
        getLegendColors()[2],
        getLegendColors()[3],
        getLegendColors()[4],
        getLegendColors()[5],
    ];

    return (
        <div className='flex flex-col justify-start items-start gap-2  w-[380px]  md:w-[680px] lg:w-full  overflow-x-auto  '>
            {tooltip && (
                <Tooltip tooltipDta={tooltip} />
            )}

            {/*  */}
            <div className="flex text-xs text-gray-300 text-bold mb-1" style={{ width: `calc(52 * (clamp(0.8rem, 1.2vw, 1rem) + 0.25rem) - 0.25rem + 2.5rem)` }} >
                <div className="w-10"></div>
                {
                    data.map((_, weekIdx) => {
                        const label = monthLabels.find((m) => m.index === weekIdx);
                        return (
                            <div key={weekIdx} className='flex-1 text-center'>
                                {label ? label.name : ''}
                            </div>
                        )
                    })
                }
            </div>
            <div className='flex flex-col justify-start gap-4'>
                <div className='flex items-start justify-start gap-2   h-[calc(7*clamp(0.8rem,1.2vw,1rem)+6*0.25rem)]'>
                    <div className='flex flex-col justify-between items-start  text-xs h-full text-gray-300 text-bold'>
                        {
                            ['', 'Mon', '', 'Wed', '', 'Fri', ''].map((d, i) => (
                                <div key={i} className=''>
                                    {d}
                                </div>
                            ))
                        }
                    </div>
                    <div className='flex gap-1'>
                        {
                            data.map((week, weekIdx) => {
                                return (
                                    <div key={weekIdx} className='flex flex-col gap-1'>
                                        {
                                            week.map((day, dayIdx) => {
                                                return (
                                                    <DayCell key={dayIdx} day={day} color={color} onHover={handleHover} onLeave={handleLeave} onDayClick={onDayClick} />
                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 text-xs text-gray-300 text-bold">
                    <span >Less</span>
                    <div className='flex items-center justify-center gap-1'>
                        {legendColors.map((c, i) => (
                            <div
                                key={i}
                                className={`w-4 h-4 rounded-sm ${c}`}
                            ></div>
                        ))}
                    </div>
                    <span>More</span>
                </div>
            </div>


        </div>

    )
}

export default ContributionChart