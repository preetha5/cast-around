const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const {Home} = require('../models');
const { User } = require('../users');
const {app, runServer, closeServer} = require('../server');
const {createAuthToken} = require('../auth/authRouter');
//Import config data
const {TEST_DATABASE_URL, PORT} = require('../config');


chai.use(chaiHttp);

//Tests for the Search feature
describe('Search endpoints', function(){

    const username = 'exampleUser@test.com';
    const password = 'examplePass';
    const firstName = "joe";
    const lastName = "smith";
    let authToken;

    before(function(){
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
        return User.hashPassword(password).then(password =>
          User.create({
            username,
            password,
            firstName,
            lastName
          })
        );
      });
    
    beforeEach(function(done){
        User.findOne()
            .then(user =>{
            authToken = createAuthToken(user);
            console.log("beforeeach authtoken is :" , authToken);
            done();
            })
    });

    afterEach(function () {
        console.log("removing user");
        return User.remove({});
    });

    after(function(){
        return closeServer();
    });

    it('should return home details on searching by address', function(){
        const newPost = {
            address: "4580 Ohio St UNIT 17",
            citystatezip: "SanDiego CA"
        };
        return chai.request(app)
            .post('/user/search')
            .set('Authorization',`bearer ${authToken}`)
            .send(newPost)
            .then(function(res){
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                console.info("search result" ,res.body);
                expect(res.body).to.include.keys(["zpid", "address", "yearBuilt"]);
            });
    });
});//END Tests for Search endpoint


describe('Root path should return html', function(){

    before(function(){
        return runServer(TEST_DATABASE_URL);
    });

    after(function(){
        return closeServer();
    });

    it('should return index page on hitting root url', function(){
        return chai.request(app)
            .get('/')
            .then(function(res){
                expect(res).to.have.status(200);
                expect(res).to.be.html;
            });
    });
}); //END tests for ROOT endpoint
