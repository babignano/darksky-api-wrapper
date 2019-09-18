import production from "./production";
import development from "./development";
import { StoreConfig } from 'cache-manager';

interface WeatherServiceConfig {
    cache: StoreConfig,
    endpoint: string,
    args: object
}

interface  LoggingServiceConfig {
    level: string
}

interface ServicesConfig {
    weather: WeatherServiceConfig,
    logging: LoggingServiceConfig
}

interface Config {
    services: ServicesConfig
}

function resolveConfig(env:string):Config {
    if (env === "production") {
        return production;
    }
    return development;
}

const config: Config = resolveConfig(process.env.NODE_ENV || "development");

export default config;
