import assert from "assert";
import fixture from "./filter.fixture"
import WeatherControllerFilters from "../../../src/controllers/weather/filters";
import sinon from "sinon";


describe('Weather Controller Filters', function () {
    let filters: WeatherControllerFilters;

    beforeEach(function () {
        filters = new WeatherControllerFilters();
    })

    describe('filterTodaysHighLowTemprature()', function () {
        describe('with valid day data', function () {
            it('should filter for the expected day', function () {
                const actual = filters.filterTodaysHighLowTemprature(fixture);
                const expected = {
                    "high": 16,
                    "low": 12
                }
    
                assert.deepEqual(actual, expected);
            });
        });

        describe('without valid day data', function () {
            let clock: sinon.SinonFakeTimers;

            before(function () {
                clock = sinon.useFakeTimers(new Date(2016,2,15).getTime());
            });

            it('should throw an error when day not found', function () {
                const fn = function () {
                    filters.filterTodaysHighLowTemprature(fixture);
                }

                assert.throws(fn, function (error:Error) {
                    return error.message === "Unable to locate relevant day data";
                });
            });

            after(function () {
                clock.restore();
            });
        });
    });
});
