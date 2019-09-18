import WeatherService from "../services/weather";
import LoggingService from '../services/logger';
import WeatherServiceFilters from "../controllers/weather/filters";
import WeatherController from '../controllers/weather';
import CacheService from "../services/cache";
import config from "../config";
import { Application } from "express";

export default class Routes {

    public weatherController: WeatherController = new WeatherController(
        new LoggingService(),
        new WeatherService(
            new LoggingService(),
            new CacheService('weather', config.services.weather.cache),
            config.services.weather
        ),
        new WeatherServiceFilters()
    );
  
    public routes(app: Application): void {

        // Useless arrow function sigh...
        // https://stackoverflow.com/questions/40018472/implement-express-controller-class-with-typescript
        app.route("/weather/:latlong").get((req, res) => this.weatherController.index(req, res));
    }
}
