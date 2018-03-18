const express =  require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const hbs = require('handlebars');
const {Home} = require('./models');

const app = express();




//A GET endpoint to retreive a home record from the DB
router.get('/:zid', (req,res) => {
    //console.log('inside home details GET by zid ', req.params.zid);
    Home
        .findOne({"home_details.zillowId" : req.params.zid})
        .then(item =>{
            //console.log(item);
            res.status(200).json(item);
        })
        .catch(err =>{
            console.log(err);
        })
});

//A POST endpoint to save home details(JSON object) from client to DB
router.post('/', jsonParser, (req, res) =>{
    console.log('inside the home details router');
    console.log(req.body);
    const requiredFields = ['streetAddress', 'city', 'state', 'zip', 'zillowId'];
    for (let i=0; i<requiredFields.length; i++){
        const field = requiredFields[i];
        if(!(field in req.body)){
            const message = `Request is missing field: ${field}`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    Home
        .create({
            address:{
                streetAddress: req.body.streetAddress,
                city: req.body.city,
                state: req.body.state,
                zip: req.body.zip
            },
            home_details:{
                property_type: req.body.homeType,
                beds: req.body.beds,
                baths : req.body.baths,
                year_built : req.body.built,
                area: req.body.area,
                zillowId: req.body.zillowId
            }

        })
        .then(home => res.status(201).json(home))
        .catch(err =>{
            console.log(err);
            res.status(500).json({error: 'something went wrong'});
        });
});

//PATCH endpoint to user/home_Details URI , (eg: patch user notes to the corresponding record)
router.patch('/:zid', jsonParser, (req,res) => {
    console.log('inside home details PATCH, params is ', req.params.zid);
    console.log('inside home details PATCH, body is ', req.body);
    const requiredFields = ['offer', 'pros', 'cons', 'nickName'];
    for (let i=0; i<requiredFields.length; i++){
        const field = requiredFields[i];
        if(!(field in req.body)){
            const message = `Request is missing field: ${field}`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
   const user_notes = {}, updated = {};
   const updateableFields = ['offer', 'pros', 'cons', 'nickName'];
    updateableFields.forEach(field => {
        if (field in req.body) {
        updated[field] = req.body[field];
        }
    });

    Home
        .update({"home_details.zillowId" : req.params.zid},
            { $set: {user_notes:{
                offer: req.body.offer,
                pros: req.body.pros,
                cons : req.body.cons,
                nickName : req.body.nickName,
            }} }
        )
        .then(result =>{
            console.log(result);
            if(result.nModified === 1){
               return res.status(204).end();
            }
            res.status(500).send('Unable to modify record');
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({error: 'something went wrong'});
        });
});


module.exports = router;