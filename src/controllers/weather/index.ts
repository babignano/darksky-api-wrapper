import express from "express";
import WeatherService from "../../services/weather";
import LoggingService from '../../services/logger';
import WeatherServiceFilters from "./filters";


export default class WeatherController {
    private weatherService: WeatherService;
    private logger: LoggingService;
    private filters: WeatherServiceFilters

    constructor() {
        this.logger = new LoggingService();
        this.weatherService = new WeatherService();
        this.filters = new WeatherServiceFilters();
    }

    private parse(coord: string):number {
        const parsed = parseFloat(coord);

        if (isNaN(parsed)) {
            throw new Error('invalid');
        }

        return parsed;
    }

    async index(req: express.Request, res: express.Response) {
        let latitude:number;
        let longitude:number;

        try {
            latitude = this.parse(req.params.latlong.split(',')[0]);
            longitude = this.parse(req.params.latlong.split(',')[1]);
    
        } catch (e) {
            this.logger.warn(e);
            return res.sendStatus(400);
        }

        try {
            const data = await this.weatherService.get(latitude, longitude);
            const todaysHighAndLow = this.filters.filterTodaysHighLowTemprature(data);
            return res.json(todaysHighAndLow);

        } catch  (e) {
            this.logger.error(e);
            return res.status(500).send(e.message);
        }
    }
}
