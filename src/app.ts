import express from "express";
import bodyParser from "body-parser";
import Routes from "./routes";

export default class App {
    public app: express.Application;
    private routePrv: Routes = new Routes();
  
    constructor() {
      this.app = express();
      this.config();
      this.routePrv.routes(this.app);
    } 
  
    private config(): void {
      this.app.set("port", process.env.PORT || 3000);
      this.app.use(bodyParser.json());
      this.app.use(bodyParser.urlencoded({ extended: false }));
    }
}