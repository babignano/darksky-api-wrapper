import assert from "assert";
import CacheService from "../../../src/services/cache";


function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Cache Service', function () {
    let cacheService: CacheService;

    describe('get()', function () {
        beforeEach(function () {
            cacheService = new CacheService('getting', {
                ttl: 0.1,
                max: 10,
                store: 'memory'
            });
        });

        it('should resolve value when successfully fetched', async function () {
            const expected = 'value';
            await cacheService.set('key', expected);
            const actual = await cacheService.get('key');
            assert(actual === expected);
        });

        it('should cache for the up to the exptected time', async function () {
            const expected = 'value';
            await cacheService.set('key', expected);

            const actualBefore = await cacheService.get('key');
            await timeout(200);
            const actualAfter = await cacheService.get('key');

            assert(actualBefore === expected);
            assert(!actualAfter);
        });
    });

    describe('set()', function () {
        beforeEach(function () {
            cacheService = new CacheService('setting', {
                ttl: 2,
                max: 10,
                store: 'memory'
            });
        });

        it('should resolve value when successfully set', async function () {
            const expected = 'value';
            const actual = await cacheService.set('key', expected);
            assert(actual === expected);
        });
    });
});
