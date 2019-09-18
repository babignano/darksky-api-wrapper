import express from "express";
import WeatherService from "../../services/weather";
import LoggingService from '../../services/logger';
import WeatherServiceFilters from "./filters";


export default class WeatherController {
    private weatherService: WeatherService;
    private logger: LoggingService;
    private filters: WeatherServiceFilters

    constructor(loggingService: LoggingService,
                weatherService: WeatherService,
                weatherServiceFilters: WeatherServiceFilters) {

        this.logger = loggingService;
        this.weatherService = weatherService;
        this.filters = weatherServiceFilters;
    }

    private parse(coord: string):number {
        const parsed = parseFloat(coord);

        if (isNaN(parsed)) {
            throw new Error('invalid');
        }

        return parsed;
    }

    private isLatitude(lat:number):boolean {
        return Math.abs(lat) <= 90;
    }
      
    private isLongitude(lng:number):boolean {
        return Math.abs(lng) <= 180;
    }

    async index(req: express.Request, res: express.Response) {
        let latlong:string = req.params.latlong || '';
        let latitude:number;
        let longitude:number;
        let data:any = {};

        try {
            latitude = this.parse(latlong.split(',')[0]);
            longitude = this.parse(latlong.split(',')[1]);
        } catch (e) {
            this.logger.debug(e);
            return res.sendStatus(400);
        }

        if (!this.isLatitude(latitude) || !this.isLongitude(longitude)) {
            this.logger.debug('Invalid latitude/longitude');
            return res.sendStatus(400);
        }

        try {
            data = await this.weatherService.get(latitude, longitude);
        } catch (e) {
            this.logger.error(e);
            return res.status(502).send({
                "error": e.message
            });
        }

        try {
            const todaysHighAndLow = this.filters.filterTodaysHighLowTemprature(data);
            return res.json(todaysHighAndLow);
        } catch  (e) {
            this.logger.error(e);
            return res.status(500).send({
                "error": e.message
            });
        }
    }
}
