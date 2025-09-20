import React, { useState } from 'react'
import ContributionChart from './ContributionChart'
import { validYears } from '../utils/validYears';

function GithubContributionsHeatmap() {
    const [color, setColor] = useState('green');
    const [year, setYear] = useState('2025');

    console.log("validYears: ", validYears());


    const handleClickOnDay = (day: any) => {
        console.log(day)
    }

    return (

        <div className='flex flex-col gap-8  items-center justify-center min-h-screen '>
            <div className='flex items-bottom  gap-4 justify-center '>
                <div className="w-34">
                    <label
                        htmlFor="choose-year"
                        className="block mb-2 text-[8px] font-medium text-gray-300"
                    >
                        Choose Year
                    </label>
                    <div className="relative flex items-center w-full">

                        <select
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setYear(e.target.value)}
                            id="choose-year"
                            name="year"
                            className="block w-full appearance-none rounded-lg border border-gray-500/30 bg-white/10 py-1 pl-4 pr-10 text-sm text-blue-500 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            defaultValue={'2025'}
                        >
                            <option value="">--Please choose an option--</option>
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                            <option value="2021">2021</option>
                            <option value="2020">2020</option>
                        </select>

                    </div>
                </div>


                <div className="w-34">
                    <label
                        htmlFor="choose-year"
                        className="block mb-2 text-sm font-medium text-gray-300"
                    >
                        Choose Month
                    </label>
                    <div className="relative">
                        <select
                            onChange={() => { }}
                            id="choose-theme"
                            name="theme"
                            className="block w-full appearance-none rounded-lg border border-gray-500/30 bg-white/10 py-1 pl-4 pr-10 text-sm text-blue-500 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            defaultValue={'green'}
                        >
                            <option value="">--Please choose an option--</option>
                            <option value={'green'}>green</option>
                            <option value={'emerald'}>emerald</option>
                            <option value={'amber'}>amber</option>
                            <option value={'cyan'}>cyan</option>
                            <option value={'fuchsia'}>fuchsia</option>
                            <option value={'rose'}>rose</option>
                        </select>
                    </div>
                </div>

                <div className='max-w-28 bg-blue-500'>
                    <button className='text-white'>
                        <span>&#10094;</span>
                    </button>
                    <button className='text-white'>
                        <span>&#10095;</span>
                    </button>
                </div>
            </div>

            <div className='flex flex-col items-start justify-center gap-2'>
                {/* <h3 className="text-lg font-semibold">Activity Calendar</h3> */}
                <ContributionChart color={color} year={year} onDayClick={handleClickOnDay} />
            </div>
            <div className='flex items-center  justify-around gap-2 h-12 max-w-[320px]  w-full'>
                <button onClick={() => setColor('green')} className={`h-full w-1/6 rounded-lg bg-green-500 `}></button>
                <button onClick={() => setColor('emerald')} className='h-full w-1/6 rounded-lg bg-emerald-500'></button>
                <button onClick={() => setColor('amber')} className='h-full w-1/6 rounded-lg bg-amber-500'></button>
                <button onClick={() => setColor('cyan')} className='h-full w-1/6 rounded-lg bg-cyan-500'></button>
                <button onClick={() => setColor('fuchsia')} className='h-full w-1/6 rounded-lg bg-fuchsia-500'></button>
                <button onClick={() => setColor('rose')} className='h-full w-1/6 rounded-lg bg-rose-500'></button>
            </div>
        </div>
    )
}

export default GithubContributionsHeatmap