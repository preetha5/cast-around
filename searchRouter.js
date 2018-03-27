const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

/* Zillow Node Package config*/
const Zillow = require('node-zillow');
const zillow = new Zillow('X1-ZWz18qqrkplhjf_7zykg');

//when a get request comes to root we take the params and call Get Deep search Zillow API
let house_info = {}
router.post('/', (req, res) =>{
    zillow.get('GetDeepSearchResults', req.body)
    .then(function(data) {
        console.log('data is ', data.message);
        if(data.message.code === '508'){
            const message = `No results found for ${req.body.address}. Please verify address on <a href="https://www.zillow.com/" target="_blank">zillow.</a>`;
            console.error(data.message.text);
            return res.status(400).send(message);
        }
        console.log("results", data.response.results.result[0]);
        res.status(200).json(data.response.results.result[0]);
    })
    .catch(err =>{
        console.error('Error is  ',err);
    })
    
})

module.exports = router;