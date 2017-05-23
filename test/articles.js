process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Articles', () => {

  /*
   * Test the /GET route
   */
    describe('/GET article', () => {
        it('it should GET all the articles', (done) => {
            chai.request(server)
                .get('/api/article')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });

});