
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../src/server');
const Post = require('../models/post');

chai.use(chaiHttp);

describe('POST /api/v1/posts', () => {
    it("should return post created with code status 201", async () => {
        const body = {
            title: "Post title",
            content: "Post content",
        }
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoyMjI1LCJpYXQiOjE2MzIzMDc5OTF9.031i2YPQFiWorEVyZEaMnjwjP7WblK797yfheYzL-bM'
        const res = await chai.
                    request(app)
                    .post('/api/v1/posts')
                    .set({ "x-auth": token })
                    .send(body);
        expect(res.status).to.equal(201);
    });
});

describe('POST /api/v1/posts', () => {
    it("should return unauthorized with code status 401", async () => {
        const body = {
            title: "Post title",
            content: "Post content",
        }
        let token = ''
        const res = await chai.
                    request(app)
                    .post('/api/v1/posts')
                    .set({ "x-auth": token })
                    .send(body);
        expect(res.status).to.equal(401);
    });
});