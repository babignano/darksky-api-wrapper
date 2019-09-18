import captainsLog from "captains-log";
import config from "../../config";

export default class LoggingService {
    private logger: any;
    private debugMode = process.env.DEBUG;

    constructor() {
        this.logger = captainsLog({
            level: config.services.logging.level
        });
    }

    debug(...args:any[]) {
        if (this.debugMode) {
            this.logger.debug(...args);
        }
    }

    warn(...args:any[]) {
        this.logger.warn(...args);
    }

    error(...args:any[]) {
        this.logger.error(...args);
    }   
}
