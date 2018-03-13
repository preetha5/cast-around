const express =  require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {Home} = require('./models');

const app = express();

//A POST endpoint to save home details from zillow to DB
router.post('/', (req, res) =>{
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

module.exports = router;