//Global values
const GET_DEEP_URL = "http://www.zillow.com/webservice/GetDeepSearchResults.htm";
const GET_UPDATED_PROP_URL = "http://www.zillow.com/webservice/GetUpdatedPropertyDetails.htm";

const SEARCH_URL = "/user/search";
let homeAddress = {};


// BEGIN: Places Autocomplete feature using the Google Places API to help users fill in the information.

var placeSearch, autocomplete;
var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
      {types: ['geocode']});

  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();

  for (var component in componentForm) {
    document.getElementById(component).value = '';
    document.getElementById(component).disabled = false;
  }

  // Get each component of the address from the place details
  // and fill the corresponding field on the form.
  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];
    if (componentForm[addressType]) {
      var val = place.address_components[i][componentForm[addressType]];
      document.getElementById(addressType).value = val;
    }
  }
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}

// END: Places Autocomplete feature using the Google Places API to help users fill in the information.


var MOCK_ZILLOW_INFO = {
    "zillowInfo": [
        {
            'address': {
               'city': "SAN DIEGO",
               "state": "CA",
               "zipcode":"92111",
               "street":"11111 Knots Berry Farm"
            },
            'bathrooms':"2.5",
            'bedrooms':"3",
            'finishedSqFt': "1969",
            'yearBuilt': "1990",
            'zpid': "16825747"
        }
    ]
}
function populateForm(data){
    console.log(data);
    //Update Address in the forms
    $("#city").val(data.address[0].city);
    $("#state").val(data.address[0].state);
    $("#zip").val(data.address[0].zipcode);
    $("#streetAdd").val(data.address[0].street);

    //Update home details returned from zillow
    $("#beds").val(data.bedrooms);
    $("#baths").val(data.bathrooms);
    $("#built").val(data.yearBuilt);
}

//Call Zillow API to return property details
function getDeepSearchResults(search_address){
  //setTimeout(function(){ displayZillowInfo(MOCK_ZILLOW_INFO)}, 100);
  console.log("search add is ",search_address);
  //Pass the search query object to the node server at endpoint at user/search
  $.ajax({
    type: 'POST',
    url: SEARCH_URL,
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(search_address),
    processData: false,
    success:populateForm
  });
  
}

//Get and display zillow home info
function getAndDisplayHomeInfo(){
  homeAddress = {
    address : "7434 Ashford Pl",
    citystatezip : "SanDiego CA"
  }
    getDeepSearchResults(homeAddress)
}
//Search button event handler

function searchHandler(e){
    e.preventDefault();
    getAndDisplayHomeInfo();
}

function searchListener(){
    $('#btn_searchHome').on('click', searchHandler);
}


$(function(){
    searchListener();
})

