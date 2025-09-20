import { apiData } from "../data" 

export const validYears = () => {
    const filteredyears = apiData.filter((year, yearIdx) => {
        let yearLabel = 2020 + yearIdx;
        return year.find(month => month.length > 0) && { year,  yearLabel: yearIdx};
    })
    return filteredyears;
}