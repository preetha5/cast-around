/* Zillow testing*/

var Zillow = require('node-zillow');

var zillow = new Zillow('X1-ZWz18qqrkplhjf_7zykg');

var parameters = {
    address: "11130 Ivy Hill Dr",
    citystatezip: "SanDiego CA 92131"
  };

//Get the property details from zillow
//Input params are address, city-state-zip
const house_info = zillow.get('GetDeepSearchResults', parameters)
.then(function(results) {
    console.log(results.response.results.result[0]);
    return results.response.results.result[0]; 
});

// const city = zillow.get('GetDeepSearchResults', parameters)
// .then(function(results) {
//     return {city: results.response.address.city};
//     // results here is an object { message: {}, request: {}, response: {}}  
// });

module.exports = {house_info};