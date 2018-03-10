const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

/* Zillow testing*/

var Zillow = require('node-zillow');

var zillow = new Zillow('X1-ZWz18qqrkplhjf_7zykg');

var parameters = {
    address: "11130 Ivy Hill Dr",
    citystatezip: "SanDiego CA 92131"
  };

//when a get request comes to root we take the params and call Get Deep search Zillow API
let house_info = {}
router.post('/', (req, res) =>{
    console.log('printing request going to zillow' , req.body);
    zillow.get('GetDeepSearchResults', req.body)
    .then(function(results) {
    console.log("results", results.response.results.result[0]);
    return results.response.results.result[0]; 
    })
    .then(info => {
        res.status(201).json(info);
    });
    
})
//Get the property details from zillow
//Input params are address, city-state-zip


// const city = zillow.get('GetDeepSearchResults', parameters)
// .then(function(results) {
//     return {city: results.response.address.city};
//     // results here is an object { message: {}, request: {}, response: {}}  
// });

module.exports = router;