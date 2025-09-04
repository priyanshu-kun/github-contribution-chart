import { useMemo, useEffect, useState } from "react";

function ActivityCalendar({ data, blockSize, blockMargin, labels, theme, isMobile, selectedMonth }) {
  const getColor = (level) => {
    switch (level) {
      case 0: return theme.level0;
      case 1: return theme.level1;
      case 2: return theme.level2;
      case 3: return theme.level3;
      case 4: return theme.level4;
      default: return theme.level0;
    }
  };

  const yearlyData = useMemo(() => {
    const weeks = [];
    const monthLabels = [];
    
    // Start from the first Sunday before our data range
    const firstDate = new Date(data[0]?.date);
    const startOfWeek = new Date(firstDate);
    startOfWeek.setDate(firstDate.getDate() - firstDate.getDay());
    
    // Create a map for quick data lookup
    const dataMap = new Map(data.map(d => [d.date, d.count]));
    
    // Generate weeks and track month changes
    let currentMonth = -1;
    for (let week = 0; week < 53; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startOfWeek);
        currentDate.setDate(startOfWeek.getDate() + week * 7 + day);
        const dateStr = currentDate.toISOString().slice(0, 10);
        const count = dataMap.get(dateStr) || 0;
        weekDays.push({ date: dateStr, count, dateObj: new Date(currentDate) });
      }
      weeks.push(weekDays);
      
      // Track month labels
      const weekMonth = weekDays[0].dateObj.getMonth();
      if (weekMonth !== currentMonth) {
        monthLabels.push({
          weekIndex: week,
          month: weekDays[0].dateObj.toLocaleDateString('en-US', { month: 'short' })
        });
        currentMonth = weekMonth;
      }
    }
    
    return { weeks, monthLabels };
  }, [data]);

  const monthlyData = useMemo(() => {
    if (!selectedMonth) return null;
    
    const monthData = data.filter(d => {
      const date = new Date(d.date);
      return date.getMonth() === selectedMonth.month && date.getFullYear() === selectedMonth.year;
    });
    
    // Group by weeks for the month
    const weeks = [];
    const firstDay = new Date(selectedMonth.year, selectedMonth.month, 1);
    const startOfWeek = new Date(firstDay);
    startOfWeek.setDate(firstDay.getDate() - firstDay.getDay());
    
    const dataMap = new Map(monthData.map(d => [d.date, d.count]));
    
    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startOfWeek);
        currentDate.setDate(startOfWeek.getDate() + week * 7 + day);
        const dateStr = currentDate.toISOString().slice(0, 10);
        const count = dataMap.get(dateStr) || 0;
        const isCurrentMonth = currentDate.getMonth() === selectedMonth.month;
        weekDays.push({ date: dateStr, count, dateObj: new Date(currentDate), isCurrentMonth });
      }
      weeks.push(weekDays);
    }
    
    return weeks;
  }, [data, selectedMonth]);

  if (isMobile && selectedMonth) {
    // Monthly view for mobile
    return (
      <div className="activity-calendar">
        <div className="flex flex-col space-y-2">
          {/* Day labels */}
          <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 text-center mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="font-medium">{day}</div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {monthlyData?.flat().map((day, index) => (
              <div
                key={index}
                className={`rounded-sm flex items-center justify-center text-xs font-medium ${day.isCurrentMonth ? 'text-gray-800' : 'text-gray-300'}`}
                style={{
                  width: blockSize * 2,
                  height: blockSize * 2,
                  backgroundColor: day.isCurrentMonth ? getColor(day.count) : theme.level0,
                }}
                title={`${day.date}: ${day.count} contributions`}
              >
                {day.dateObj.getDate()}
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-600 mt-4">
            <span>{labels.legend.less}</span>
            {[0, 1, 2, 3, 4].map(level => (
              <div
                key={level}
                className="rounded-sm"
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: getColor(level),
                }}
              />
            ))}
            <span>{labels.legend.more}</span>
          </div>
        </div>
      </div>
    );
  }

  // Yearly view
  return (
    <div className="activity-calendar">
      <div className="flex flex-col space-y-2">
        {/* Month labels */}
        <div className="relative mb-2">
          <div className="flex" style={{ marginLeft: '20px' }}>
            {yearlyData.monthLabels.map((label, index) => (
              <div
                key={index}
                className="text-xs text-gray-500 font-medium"
                style={{
                  position: 'absolute',
                  left: `${label.weekIndex * (blockSize + blockMargin)}px`,
                  top: '-20px'
                }}
              >
                {label.month}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex">
          {/* Day labels */}
          <div className="flex flex-col justify-between mr-2 text-xs text-gray-500" style={{ height: `${7 * (blockSize + blockMargin)}px` }}>
            <div></div>
            <div>Mon</div>
            <div></div>
            <div>Wed</div>
            <div></div>
            <div>Fri</div>
            <div></div>
          </div>
          
          {/* Calendar grid */}
          <div className="overflow-x-auto">
            <div className="grid grid-flow-col gap-1" style={{ gridTemplateRows: 'repeat(7, 1fr)' }}>
              {yearlyData.weeks.map((week, weekIndex) => (
                week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className="rounded-sm"
                    style={{
                      width: blockSize,
                      height: blockSize,
                      backgroundColor: getColor(day.count),
                      margin: blockMargin / 2,
                    }}
                    title={`${day.date}: ${day.count} contributions`}
                  />
                ))
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <span>{labels.legend.less}</span>
          {[0, 1, 2, 3, 4].map(level => (
            <div
              key={level}
              className="rounded-sm"
              style={{
                width: 10,
                height: 10,
                backgroundColor: getColor(level),
              }}
            />
          ))}
          <span>{labels.legend.more}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Helper: format a Date to YYYY-MM-DD (ISO, no time)
 */
function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

/**
 * Generate dummy contribution data for the past `daysCount` days.
 * Returns data ordered from oldest -> newest (what most calendars expect).
 */
function generateContributionData(daysCount = 365) {
  const today = new Date();
  const days = [];
  for (let i = 0; i < daysCount; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push({
      date: isoDate(d),
      count: Math.floor(Math.random() * 5), // 0–4 random
    });
  }
  // IMPORTANT: do not mutate the original array
  return days.slice().reverse(); // oldest → newest
}

/**
 * Runtime "tests" to validate data shape and ordering without a test runner.
 * These will render below the calendar so you can confirm everything is OK.
 */
function runDataTests(data) {
  const results = [];

  // Test 1: length should be 365
  results.push({
    name: "Length is 365",
    pass: data.length === 365,
    info: `length=${data.length}`,
  });

  // Test 2: dates should be unique and sorted ascending by day
  const uniqueDates = new Set(data.map((d) => d.date));
  const isUnique = uniqueDates.size === data.length;
  const isSorted = data.every((d, i) => {
    if (i === 0) return true;
    const prev = new Date(data[i - 1].date);
    const curr = new Date(d.date);
    const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
    return diffDays === 1; // strictly next day
  });
  results.push({ name: "Dates unique", pass: isUnique, info: `unique=${uniqueDates.size}` });
  results.push({ name: "Dates contiguous (daily)", pass: isSorted });

  // Test 3: first date is today-364, last is today
  const today = isoDate(new Date());
  const day364 = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 364);
    return isoDate(d);
  })();
  results.push({ name: "First date is today-364", pass: data[0]?.date === day364, info: `${data[0]?.date} vs ${day364}` });
  results.push({ name: "Last date is today", pass: data[data.length - 1]?.date === today, info: `${data[data.length - 1]?.date} vs ${today}` });

  // Test 4: counts in range 0..4 (integers)
  const countsValid = data.every((d) => Number.isInteger(d.count) && d.count >= 0 && d.count <= 4);
  results.push({ name: "Counts 0..4 & integer", pass: countsValid });

  return results;
}

/**
 * Adaptive block size for mobile responsiveness.
 * Shrinks blocks on small screens, grows on larger screens.
 */
function useAdaptiveBlockSize() {
  const [size, setSize] = useState(12);
  const [margin, setMargin] = useState(3);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const compute = () => {
      const w = typeof window !== "undefined" ? window.innerWidth : 1024;
      setIsMobile(w < 768);
      
      if (w < 360) {
        setSize(8);
        setMargin(2);
      } else if (w < 480) {
        setSize(9);
        setMargin(2);
      } else if (w < 640) {
        setSize(10);
        setMargin(2);
      } else if (w < 768) {
        setSize(11);
        setMargin(3);
      } else if (w < 1024) {
        setSize(12);
        setMargin(3);
      } else {
        setSize(13);
        setMargin(3);
      }
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  return { size, margin, isMobile };
}

export default function GitHubContributionHeatmap() {
  // Data (memoized)
  const data = useMemo(() => generateContributionData(365), []);

  // Runtime tests
  const testResults = useMemo(() => runDataTests(data), [data]);

  // Responsive sizing
  const { size, margin, isMobile } = useAdaptiveBlockSize();
  
  // Mobile month selector
  const [selectedMonth, setSelectedMonth] = useState(null);
  
  // Generate month options
  const monthOptions = useMemo(() => {
    const months = [];
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push({
        month: date.getMonth(),
        year: date.getFullYear(),
        label: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      });
    }
    return months;
  }, []);

  // Set default month for mobile
  useEffect(() => {
    if (isMobile && !selectedMonth) {
      setSelectedMonth(monthOptions[0]);
    }
  }, [isMobile, selectedMonth, monthOptions]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-5xl space-y-6">
        <div className="w-full overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
          {isMobile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Activity Calendar</h3>
                <select
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  value={selectedMonth ? `${selectedMonth.year}-${selectedMonth.month}` : ''}
                  onChange={(e) => {
                    const [year, month] = e.target.value.split('-');
                    const option = monthOptions.find(m => m.year === parseInt(year) && m.month === parseInt(month));
                    setSelectedMonth(option);
                  }}
                >
                  {monthOptions.map((option) => (
                    <option key={`${option.year}-${option.month}`} value={`${option.year}-${option.month}`}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <ActivityCalendar
                data={data}
                blockSize={size}
                blockMargin={margin}
                labels={{
                  legend: { less: "Less", more: "More" },
                }}
                theme={{
                  level0: "#ebedf0",
                  level1: "#9be9a8",
                  level2: "#40c463",
                  level3: "#30a14e",
                  level4: "#216e39",
                }}
                isMobile={isMobile}
                selectedMonth={selectedMonth}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Activity Calendar - Past Year</h3>
              <ActivityCalendar
                data={data}
                blockSize={size}
                blockMargin={margin}
                labels={{
                  legend: { less: "Less", more: "More" },
                }}
                theme={{
                  level0: "#ebedf0",
                  level1: "#9be9a8",
                  level2: "#40c463",
                  level3: "#30a14e",
                  level4: "#216e39",
                }}
                isMobile={isMobile}
                selectedMonth={selectedMonth}
              />
            </div>
          )}
        </div>

        {/* <div className="rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Runtime Data Tests</h2>
          <ul className="space-y-1 text-sm">
            {testResults.map((t, i) => (
              <li key={i} className={`flex items-center gap-2 ${t.pass ? "text-green-700" : "text-red-700"}`}>
                <span aria-hidden>{t.pass ? "✅" : "❌"}</span>
                <span className="font-medium">{t.name}</span>
                {t.info ? <span className="text-gray-500">— {t.info}</span> : null}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-gray-500">
            These checks validate the generated 365-day dataset without a separate test runner. If you need Jest tests, say the word and I'll add them.
          </p>
        </div> */}
      </div>
    </div>
  );
}