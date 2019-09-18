import lodash from "lodash";
import moment from "moment-timezone";


interface WeatherServiceResponse {
    high: number,
    low: number
}

export default class WeatherControllerFilters {

    constructor() { }

    filterTodaysHighLowTemprature(data: any):WeatherServiceResponse {
        const tz = data.timezone;
        const startOfDay = moment.tz(tz).startOf('day');

        // First day item with a start of day that matches the 
        // start of today in the timezone in the response 
        const today = lodash.find(data.daily.data, (value:any) => {
            return moment.unix(value.time).tz(tz).isSame(startOfDay);
        });

        if (!today) {
            throw new Error("Unable to locate relevant day data");
        }

        return {
            high: Math.round(today.temperatureHigh),
            low: Math.round(today.temperatureLow)
        }
    }

    // Other filters can go here...
}
