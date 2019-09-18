import request from "request-promise-native";
import LoggingService from "../../services/logger";
import CacheService from "../cache"
import config from "../../config";
import lodash from "lodash";

export default class WeatherService {
    private cache: CacheService;
    private url: string;
    private logger: LoggingService;
    private args: string;

    constructor() {
        this.logger = new LoggingService();
        this.cache = new CacheService('darksky');
        this.url = config.services.weather.endpoint;
        this.args = this.makeParams(config.services.weather.args);
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
            this.logger.error('Cache service resolution error', e.error); 
            throw new Error('Weather service internal error');
        }

        try {
            const response = await request(`${this.url}/${location}?${this.args}`, {
                json: true
            });
            await this.cache.set(location, response);
            return response;
        } catch (e) {
           this.logger.error('Darksky service resolution error', e.error); 
           throw new Error('Weather service upstream error');
        }
    }
}
