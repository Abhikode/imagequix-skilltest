
const chai = require('chai');
const assert = require('assert');
const chaiHttp = require('chai-http');
const app = require('../src/server');

chai.use(chaiHttp);
chai.should();
describe('api http server status', ()=> {
    describe('GET /', () => {
        it("should return status 200", (done) => {
            chai.request(app)
                .get('/').end((e, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                })
        })
    })
})