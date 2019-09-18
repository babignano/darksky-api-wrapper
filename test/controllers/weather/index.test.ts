import assert from "assert";
import fixture from "./filter.fixture"
import WeatherController from "../../../src/controllers/weather";
import WeatherService from "../../../src/services/weather";
import LoggingService from '../../../src/services/logger';
import WeatherServiceFilters from "../../../src/controllers/weather/filters";
import { stubObject } from "ts-sinon";
import { mockReq, mockRes } from 'sinon-express-mock'


describe('Weather Controller', function () {

    describe('index()', function () {

      let controller: WeatherController;
      let loggingService: LoggingService;
      let weatherService: WeatherService;
      let weatherServiceFilters: WeatherServiceFilters;
      let loggingServiceStub;
      let weatherServiceStub;
      let weatherServiceFiltersStub;

      before(function () {

        loggingService = new LoggingService();
        weatherService = new WeatherService();
        weatherServiceFilters = new WeatherServiceFilters();

        loggingServiceStub = stubObject<LoggingService>(loggingService);
        weatherServiceStub = stubObject<WeatherService>(weatherService);
        weatherServiceFiltersStub = stubObject<WeatherServiceFilters>(weatherServiceFilters);

        controller = new WeatherController(
          loggingServiceStub,
          weatherServiceStub,
          weatherServiceFiltersStub
        );
      });
  
      it('should return an error status when missing params', function () {
          const req = mockReq();
          const res = mockRes();
          controller.index(req, res);
          assert(res.sendStatus.calledWith(400));
      });
      it('should return an error status when missing params', function () {
        const req = mockReq();
        const res = mockRes();
        controller.index(req, res);
        assert(res.sendStatus.calledWith(400));
    });
    });
});
