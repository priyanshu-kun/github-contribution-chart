import { validYears } from "./validYears"

export const transformActivityGraphArray = () => {
    let activityGraphData: any[] = [];
    const years = validYears();
    years.forEach(year => {
        year.forEach(month => {
            activityGraphData.push();
        })
    })
   return activityGraphData; 
}