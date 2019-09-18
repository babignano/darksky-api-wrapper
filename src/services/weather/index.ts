import request from "request-promise-native";
import LoggingService from "../../services/logger";
import CacheService from "../cache";
import { WeatherServiceConfig } from "../../config"
import lodash from "lodash";


export default class WeatherService {
    private cache: CacheService;
    private url: string;
    private logger: LoggingService;
    private args: string;

    constructor(loggingService: LoggingService, cacheService: CacheService, config: WeatherServiceConfig) {
        this.logger = loggingService;
        this.cache = cacheService;
        this.url = config.endpoint;
        this.args = this.makeParams(config.args);
    }

    private makeParams(args:object):string {
        return lodash.reduce(args, (acc:string, value:string, name:string) => {
            return `${acc}&${name}=${value}`;
        }, '');
    }
    
    public async get(latitude:Number, longitude:Number) {
        const location = `${latitude},${longitude}`;

        try {
            const value = await this.cache.get(location);
            if (value) {
                return value;
            } 
            this.logger.warn('cache miss');

        } catch (e) {
            const message = "Weather service internal error";
            this.logger.error(message, e); 
            throw new Error(message);
        }

        try {
            const response = await request(`${this.url}/${location}?${this.args}`, {
                json: true
            });
            await this.cache.set(location, response);
            return response;

        } catch (e) {
            const message = "Weather service upstream error";
            this.logger.error(message, e); 
            throw new Error(message);
        }
    }
}
