const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;
const faker = require('faker');
const {Home} = require('../models');
const { User } = require('../users');
const {createAuthToken} = require('../auth/authRouter');
const {app, runServer, closeServer} = require('../server');

//Import config data
const {TEST_DATABASE_URL, PORT} = require('../config');

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
            }
        });
      }
      // this will return a promise
      return Home.insertMany(seedData);
    }

//Tests for the Dashboard feature
describe('Home Details endpoints', function(){
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

   //Tests for the Home details feature
    describe('POST to /user/home_details', function(){
    
    //Make a post request with fake data and verify the same got posted to DB
    it('should add new Home record with right details on POSTing', function(){
        const newHome = {
                streetAddress: faker.address.streetAddress(),
                city: faker.address.city(),
                state: faker.address.state(),
                zip: faker.address.zipCode(),
                property_type: faker.random.arrayElement(["townhouse", "condo", "single Family"]),
                beds: faker.random.number({min:1, max:6}),
                baths : faker.random.number({min:1, max:5}),
                year_built : faker.random.arrayElement(["1992", "1985", "2010"]),
                area: faker.random.number({min:1200, max:3000}),
                zillowId: faker.random.number({min:1122333, max:3322445})
        };

        return chai.request(app)
            .post('/user/home_details')
            .set('Authorization',`bearer ${authToken}`)
            .send(newHome)
            .then(function(res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.include.keys(
                    'address', 'home_details', 'user_notes');
                res.body.home_details.zillowId.should.equal(newHome.zillowId);
                res.body._id.should.not.be.null;
                res.body.address.streetAddress.should.equal(newHome.streetAddress);
                return Home.findById(res.body._id);
            })
            .then(function(dbHome){
                dbHome.home_details.zillowId.should.equal(newHome.zillowId);
            });
        });//End test for creating new home data in DB

        //Find a random record from DB and grab zid,
        //use the ZID to pull the right record back on GET call
        it('should get the right home details for the zillowID', function(){
            let home;
          return Home.findOne()
            .then( dbHome=>{
                home = dbHome;
                zid = dbHome.home_details.zillowId;
                return chai.request(app)
                    .get(`/user/home_details/${zid}`)
                    .set('Authorization',`bearer ${authToken}`);
            })
            .then(res =>{
                res.should.have.status(200);
                res.should.be.json;
                res.body.address.streetAddress.should.equal(home.address.streetAddress);
                res.body.home_details.zillowId.should.equal(home.home_details.zillowId);
            })
        });//End test for getting details for a specific ZID
    
    });//END Tests for Home details endpoint
});//END testsuite Home Details endpoints