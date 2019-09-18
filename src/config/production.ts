import { StoreConfig } from 'cache-manager';

export default {
    services: {
        logging: {
            level: 'warn'
        },
        weather: {
            endpoint: `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}`,
            cache: {
                ttl: 60 * 60, // 1 hour
                store: 'memory' as StoreConfig["store"],
                max: 100
            },
            args: {

                // Return celsius over fahrenheit
                units: "si",

                // Do not over-request as we only want daily
                exclude: "hourly,currently,flags"
            }
        }
    }
}
