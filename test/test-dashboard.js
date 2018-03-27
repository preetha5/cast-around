const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const faker = require('faker');
const mongoose = require('mongoose');
const {Home} = require('../models');
const {app, runServer, closeServer} = require('../server');
const request = require('supertest');
//Import config data
const {TEST_DATABASE_URL, PORT} = require('../config');
const jwt = require('jsonwebtoken');
const { User } = require('../users');
const { JWT_SECRET } = require('../config');
const {createAuthToken} = require('../auth/authRouter');
chai.use(chaiHttp);

//This function is used to teardownDb
function tearDownDB(){
    return new Promise((resolve, reject) => {
        console.warn("Deleting test DB collection...");
        mongoose.connection.dropDatabase()
        .then(result => resolve(result))
        .catch(err => reject(err));
    })
}

//function to create fake home details in DB before running the tests
function seedHomeData(){
    console.info("seed HOME db collection");
    const seedData = [];
    for (let i = 1; i <= 5; i++) {
        seedData.push({
            address: {
                streetAddress: faker.address.streetAddress(),
                city: faker.address.city(),
                state: faker.address.state(),
                zip: faker.address.zipCode(),
            },
            home_details: {
                property_type: faker.random.arrayElement(["townhouse", "condo", "single Family"]),
                beds: faker.random.number({min:1, max:6}),
                baths : faker.random.number({min:1, max:5}),
                year_built : faker.random.arrayElement(["1992", "1985", "2010"]),
                area: faker.random.number({min:1200, max:3000}),
                zillowId: faker.random.number({min:1122333, max:3322445})
            },
            user_notes:{
                offer: faker.commerce.price(300000, 999999, 0),
                pros: faker.lorem.sentences(3,3),
                cons: faker.lorem.sentences(3,3),
                nickName: faker.lorem.words(4)
            },
            username: "exampleUser@test.com"
        });
      }
      // this will return a promise
      return Home.insertMany(seedData);
    }

//Tests for the Dashboard feature
describe('Dashboard endpoints', function(){
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

    beforeEach(function () {
        return seedHomeData();
      });
    afterEach(function () {
        console.log("removing user");
        return User.remove({});
    });
    afterEach(function () {
    // tear down database so we ensure no state from this test
    // effects any coming after.
    return tearDownDB();
    });

    after(function(){
        return closeServer();
    });

    //Test should find all homes for a given user
    describe('GET endpoint', function () { 
        it('should get list of homes on requesting to user\\dashboard\\:username', function(){
            return chai.request(app)
            .get(`/user/dashboard/${username}`)
            .set('Authorization',`bearer ${authToken}`)
            .then(function(res){
                expect(res).to.have.status(200);
                expect(res.body.homes).to.be.a('array');
                expect(res.body.homes.length).to.be.greaterThan(1);
                const expectedKeys =
                   ['id', 'streetAddress', 'city', 'state', 'zip', 'zillowId'];
                res.body.homes.forEach(function(item){
                    expect(item).to.be.a('object');
                    expect(item).to.include.keys(expectedKeys);
                });
            });
        });
    });
    

    //Test should find a record in DB by zid, delete it and make sure its deleted
    describe('DELETE endpoint', function () {
        it('should remove item from DB on DELETE post to user\\dashboard\\zid', function(){
            let homeToDelete;
            return Home
                .findOne()
            .then( dbHome=>{
                console.log("trying to delete" , dbHome);
                homeToDelete = dbHome;
                zid = homeToDelete.home_details.zillowId;
                return chai.request(app)
                    .delete(`/user/dashboard/${zid}`)
                    .set('Authorization',`bearer ${authToken}`)         
            .then(res =>{
                expect(res).to.have.status(204);
                return Home.find({"home_details.zillowId" : homeToDelete.home_details.zillowId})
            });
            }); 
        });
    }); 
});//END Tests for all Dashboard endpoint