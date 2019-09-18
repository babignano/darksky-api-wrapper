import cacheManager from 'cache-manager';
import config from "../../config";

export default class CacheService {
    private cache: any;
    private namespace: string;

    constructor(namespace:string) {
        this.namespace = namespace;
        this.cache = cacheManager.caching(config.services.weather.cache);
    }
    
    public get(key: string):Promise<string> {
        return new Promise((resolve, reject) => {
            return this.cache.get(`${this.namespace}/${key}`, (error: any, value: any) => {
                if (error) {
                    return reject(error);
                }

                return resolve(value);
            });
        });
    }

    public set(key: string, value: any):Promise<string> {
        return new Promise((resolve, reject) => {
            return this.cache.set(`${this.namespace}/${key}`, value, {}, (error: any) => {
                if (error) {
                    return reject(error);
                }

                return resolve(value);
            })
        });
    }
}
