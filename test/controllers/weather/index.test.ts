import assert from "assert";
import WeatherController from "../../../src/controllers/weather";
import WeatherService from "../../../src/services/weather";
import CacheService from "../../../src/services/cache";
import LoggingService from '../../../src/services/logger';
import WeatherServiceFilters from "../../../src/controllers/weather/filters";
import config from "../../../src/config";
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
      let requestStub;

      beforeEach(function () {
        loggingService = new LoggingService();
  
        weatherService = new WeatherService(
          new LoggingService(),
          new CacheService('weather', config.services.weather.cache),
          config.services.weather
        );
  
        weatherServiceFilters = new WeatherServiceFilters();

        loggingServiceStub = stubObject<LoggingService>(loggingService);
        weatherServiceStub = stubObject<WeatherService>(weatherService);
        weatherServiceFiltersStub = stubObject<WeatherServiceFilters>(weatherServiceFilters);
        requestStub = stubObject<WeatherServiceFilters>(weatherServiceFilters);

        controller = new WeatherController(
          loggingServiceStub,
          weatherServiceStub,
          weatherServiceFiltersStub
        );
      });
  
      it('should return an 400 error status when missing params', async function () {
        const req = mockReq();
        const res = mockRes();
        await controller.index(req, res);

        assert(res.sendStatus.calledWith(400));
      });

      it('should return an 502 when the upstream request fails', async function () {
        const message = "Weather service upstream error";
        const res = mockRes();
        const req = mockReq({
          params: {
            latlong: '33,-150'
          }
        });

        weatherServiceStub.get.returns(Promise.reject(new Error(message)));
        await controller.index(req, res);

        assert(res.status.calledWith(502));
        assert(res.send.calledWith({ error: message }));
    });

    it('should return an 500 when unable to resolve day', async function () {
      const message = "foobar";
      const res = mockRes();
      const req = mockReq({
        params: {
          latlong: '33,-150'
        }
      });

      weatherServiceStub.get.returns(Promise.resolve());
      weatherServiceFiltersStub.filterTodaysHighLowTemprature.throws(new Error(message));
      await controller.index(req, res);

      assert(res.status.calledWith(500));
      assert(res.send.calledWith({ error: message }));
    });

    it('should return an 200 when able to resolve the day', async function () {
      const expected = {
        high: 2,
        low: 1
      }
      const res = mockRes();
      const req = mockReq({
        params: {
          latlong: '33,-150'
        }
      });

      weatherServiceStub.get.returns(Promise.resolve());
      weatherServiceFiltersStub.filterTodaysHighLowTemprature.returns(expected);
      await controller.index(req, res);

      assert(res.json.calledWith(expected));
    });
  });
});
