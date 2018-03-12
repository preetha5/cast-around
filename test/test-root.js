const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const {app, runServer, closeServer} = require('../server');

chai.use(chaiHttp);


describe('Root', function(){

    before(function(){
        return runServer;
    });

    after(function(){
        return closeServer;
    });

    it('should return html on hitting root url', function(){
        return chai.request(app)
            .get('/')
            .then(function(res){
                expect(res).to.have.status(200);
                expect(res).to.be.html;
            });
    });
}); //END tests for ROOT endpoint

//Tests for the Dashboard feature
describe('Dashboard', function(){

    before(function(){
        return runServer;
    });

    after(function(){
        return closeServer;
    });

    it('should return html on hitting dashboard url', function(){
        return chai.request(app)
            .get('/user/dashboard')
            .then(function(res){
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
            });
    });
});//END Tests for Dashboard endpoint

//Tests for the Search feature
describe('Search', function(){

    before(function(){
        return runServer;
    });

    after(function(){
        return closeServer;
    });

    it('should return html on hitting search url', function(){
        return chai.request(app)
            .get('/user/search')
            .then(function(res){
                expect(res).to.have.status(200);
                expect(res).to.be.a('object');
            });
    });
});//END Tests for Search endpoint

//Tests for the Home details feature
describe('Home details', function(){

    before(function(){
        return runServer;
    });

    after(function(){
        return closeServer;
    });

    it('should return html on hitting home details url', function(){
        return chai.request(app)
            .get('/user/home_details/:id')
            .then(function(res){
                expect(res).to.have.status(200);
                expect(res).to.be.html;
            });
    });
});//END Tests for Home details endpoint