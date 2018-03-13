//Global values
const GET_DEEP_URL = "http://www.zillow.com/webservice/GetDeepSearchResults.htm";
const GET_UPDATED_PROP_URL = "http://www.zillow.com/webservice/GetUpdatedPropertyDetails.htm";

const SEARCH_URL = "/user/search";
const SAVE_HOME_URL = "/user/home_details";
let homeAddress = {};


// BEGIN: Places Autocomplete feature using the Google Places API to help users fill in the information.

var placeSearch, autocomplete;
var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  //country: 'long_name',
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

  console.log(place);

  // for (var component in componentForm) {
  //   document.getElementById(component).value = '';
  //   document.getElementById(component).disabled = false;
  // }

  // Get each component of the address from the place details
  // and fill the corresponding field on the form.
  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];
    //console.log(addressType);
    
    if (componentForm[addressType]) {
      var val = place.address_components[i][componentForm[addressType]];
      homeAddress[addressType] = val;
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

//If an error is returned by server show it to the user inside a div
function handleError(err){
  $('#showError').append(
    `<p>Error: Server returned ${err.status}. ${err.responseText} </p>`
  );
}

//Populate the form with data returned by zillow API
function populateForm(data){
    console.log(data);
    //Update Address in the forms
    $("#city").val(data.address[0].city);
    $("#state").val(data.address[0].state);
    $("#zip").val(data.address[0].zipcode);
    $("#streetAddress").val(data.address[0].street);

    //Update home details returned from zillow
    $("#beds").val(data.bedrooms);
    $("#baths").val(data.bathrooms);
    $("#built").val(data.yearBuilt);
    $('#homeType').val(data.useCode);
    $("#sqft").val(data.finishedSqFt);
    $('#zillowId').val(data.zpid);
    $("#zillowLink").append(`
      <a target=_blank href="${data.links[0].mapthishome}">View this on Zillow</a>
    `);
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
    success:populateForm,
    error: handleError
  });
  
}

//Get and display zillow home info
function getAndDisplayHomeInfo(){
  console.log(homeAddress['unitNo']);
  let search_address = {
    address : `${homeAddress['street_number']} ${homeAddress['route']} ${homeAddress['unitNo']}`,
    citystatezip : `${homeAddress['locality']} ${homeAddress['administrative_area_level_1']} ${homeAddress['postal_code']}`
  }
  console.log("search add is " , search_address);
    getDeepSearchResults(search_address)
}
//Search button event handler

function searchHandler(e){
    e.preventDefault();
    //Append the unit number if entered to home_address object
    let unitNo = '';
    let unitElemVal = $('#unitNo').val();
    if(unitElemVal !== null){
      unitNo = unitElemVal;
    }
    homeAddress['unitNo'] = "Unit " + unitNo;
    getAndDisplayHomeInfo();
    //Clear the address search fields
    $('#unitNo').val('');
    $('#autocomplete').val('');

    //Clear the errors if already present
    $("#showError").empty();
}

function makeHomeObj(){
  let formData = $("#showSearchForm").serializeArray();
  console.log(formData);
  let myObj ={};
  $.each(formData, (index, item) =>{
    myObj[item.name] = item.value;
  });
  console.log(myObj);
  return myObj;
}

//On getting a success status after saving, show confirm message to user.
function successMessage (){
  $('body').append(`
  <p>Item has been saved to Dashboard. Go <a href="./dashboard.html">here </a> to view list. </p>
  `);
}
//A handler that listens to save to dahsboard button being clicked
function saveSearchHandler(e){
  e.preventDefault();
  let formData = JSON.stringify($("#showSearchForm").serializeArray());
  const homeObj = makeHomeObj();
  $.ajax({
    type: 'POST',
    url: SAVE_HOME_URL,
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(homeObj),
    success:successMessage,
    error: handleError
  });
}

//Handler that listens to search button being clicked
function searchBtnListener(){
    $('#btn_searchHome').on('click', searchHandler);
}

function savetoDashboardListener(){
  $('#save_search').on('click', saveSearchHandler);
}

$(function(){
    searchBtnListener();
    savetoDashboardListener();
})

