import assert from "assert";
import WeatherService from "../../../src/services/weather";
import LoggerService from "../../../src/services/logger";
import CacheService from "../../../src/services/cache";
import { StoreConfig } from 'cache-manager';
import nock from "nock";
import { stubObject } from "ts-sinon";


describe('Weather Service', function () {
    let weatherService: WeatherService;
    let cacheServiceStub;
    let loggingServiceStub;

    describe('get()', function () {
        beforeEach(function () {
            const cacheConfig = {
                ttl: 1,
                max: 1,
                store: 'memory' as StoreConfig['store']
            }
            const cacheService = new CacheService('weather', cacheConfig);
            const loggingService = new LoggerService();
    
            cacheServiceStub = stubObject<CacheService>(cacheService);
            loggingServiceStub = stubObject<LoggerService>(loggingService);
            weatherService = new WeatherService(loggingServiceStub, cacheServiceStub, {
                endpoint: 'https://www.example.com/forecast',
                cache: cacheConfig,
                args: {
                    foo: 'bar'
                }
            });
        });

        it('should return the value from upstream successfully', async function () {
            const expected = {
                foo: 'bar'
            };

            nock('https://www.example.com')
                .get('/forecast/30,-150?&foo=bar')
                .reply(200, expected);

            const actual = await weatherService.get(30, -150);
            assert.deepEqual(actual, expected);
            assert(cacheServiceStub.set.calledWith('30,-150', expected))
        });

        it('should throw an expected error on an upstream error', async function () {
            const expected = {
                foo: 'bar'
            };

            nock('https://www.example.com')
                .get('/forecast/30,-150?&foo=bar')
                .reply(500);

            try {
                await weatherService.get(30, -150);
            } catch (e) {
                assert(e.message === "Weather service upstream error");
            }
        });
    });
});
