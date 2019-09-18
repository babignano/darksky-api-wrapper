import nock from "nock";
import assert from "assert";
import supertest from "supertest";
import app from 

describe('weather controller', function () {

    const app 

    before(function () {
        nock('https://api.github.com')
            .get('/repos/atom/atom/license')
            .reply(200, {
                license: {
                key: 'mit',
                name: 'MIT License',
                spdx_id: 'MIT',
                url: 'https://api.github.com/licenses/mit',
                node_id: 'MDc6TGljZW5zZTEz',
                },
            })
    });
    it('should return a common result', function () {

    })
})
 
const scope = nock('https://api.github.com')
  .get('/repos/atom/atom/license')
  .reply(200, {
    license: {
      key: 'mit',
      name: 'MIT License',
      spdx_id: 'MIT',
      url: 'https://api.github.com/licenses/mit',
      node_id: 'MDc6TGljZW5zZTEz',
    },
  })


  var 
  describe('Array', function() {
    describe('#indexOf()', function() {
      it('should return -1 when the value is not present', function() {
        assert.equal([1, 2, 3].indexOf(4), -1);
      });
    });
  });