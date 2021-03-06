//Global values
const GET_DEEP_URL = "http://www.zillow.com/webservice/GetDeepSearchResults.htm";
const GET_UPDATED_PROP_URL = "http://www.zillow.com/webservice/GetUpdatedPropertyDetails.htm";
const SEARCH_URL = "/user/search";
const HOME_DETAILS_URL = '/user/home_details';
let homeAddress = {};
const token = sessionStorage.getItem("authToken");
const currentUser = sessionStorage.getItem("user");

// BEGIN: Places Autocomplete feature using the Google Places API 
//to help users fill in the information.

var placeSearch, autocomplete;
var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};

//Redirect user to dashboard page on button click
function goToDashboardHandler(){
    $("#btn_goToDashboard").click((e) =>{
        e.preventDefault();
        location.href = "./dashboard.html";
    });
}

//If user clicks on logout, destroy the local JWT and redirect to Landing page
function logOutListener(){
    $('#linkLogout').click(function(e){
        e.preventDefault();
        localStorage.removeItem("home");
        sessionStorage.removeItem("authToken");
        window.location.href = "./index.html"
    })
}

//If an error is returned by server show it to the user inside a div
function handleError(err){
    if (err.status === 401){
        $('#loginModal').modal('show');
        return;
    } 
    $('.feedbackDiv').empty();
    $('.feedbackDiv').append(
          `<p>Error: Server returned ${err.status}. ${err.responseText} </p>`
        );
    $('#feedbackModal').modal('show');
}

//On getting a success status after saving, show confirm message to user.
function successMessage(){
    $('.feedbackDiv').empty();
    $('.feedbackDiv').append(
          `<p>Item has been saved to Dashboard. 
          Go <a href="./dashboard.html">here </a> to view list. </p>`
        );
    $('#feedbackModal').modal('show');
}

//Function to create a serialized array obj to be sent to URI endpoint
function makeHomeObj(){
    let formData = $("#showSearchForm").serializeArray();
    let myObj ={};
    $.each(formData, (index, item) =>{
      myObj[item.name] = item.value;
    });
    //Add the default fields for user notes also while creating records
    //So we can call update and update their values later
    myObj['offer'] = '';
    myObj['pros'] = '';
    myObj['cons'] = '';
    myObj['nickName'] = '';
    myObj['user'] = currentUser;
    return myObj;
  }
  
//A handler that listens to save to dashboard button being clicked
function saveSearchHandler(e){
  e.preventDefault();
  const homeObj = makeHomeObj();
  $.ajax({
    type: 'POST',
    url: HOME_DETAILS_URL,
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(homeObj),
    success:successMessage,
    error: handleError,
    beforeSend: function(xhr) { xhr.setRequestHeader('Authorization','Bearer ' + token); }
  });
}

//Populate and show the form with details returned by zillow API
function populateForm(data){
    $("#zillowLink").empty();
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
      <a target=_blank href="${data.links[0].mapthishome}">View this property on Zillow</a>
    `);
    $('#showSearchForm').show();
    $('#showSearchForm').attr("aria-hidden","false");
}

//Call Zillow API to return property details
function getDeepSearchResults(search_address){
    //Grab the JWT token from Session storage
    //Pass the search query object to the node 
    //server at endpoint at user/search
    
    $.ajax({
      type: 'POST',
      url: SEARCH_URL,
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(search_address),
      processData: false,
      success:populateForm,
      error: handleError,
      beforeSend: function(xhr) { xhr.setRequestHeader('Authorization','Bearer ' + token); }
    });
    
  }

function fillInAddress(place) {
    // Get each component of the address from the place details
    // and fill the corresponding field on the form.
    for (let i = 0; i < place.address_components.length; i++) {
        let addressType = place.address_components[i].types[0];
        
        if (componentForm[addressType]) {
        let val = place.address_components[i][componentForm[addressType]];
        homeAddress[addressType] = val;
        }
    }
    }

//Callback for successful geolocation API, to Get and display zillow home info
function getAndDisplayHomeInfo(data){
 if (data.status === "ZERO_RESULTS"){
    let err = {
        status : 400,
        responseText: "Address not found. Please check your input."
    }
    handleError(err);
    return;
 }
   fillInAddress(data.results[0]);
  let search_address = {
    address : `${homeAddress['street_number']} ${homeAddress['route']}}`,
    citystatezip : `${homeAddress['locality']} ${homeAddress['administrative_area_level_1']} ${homeAddress['postal_code']}`
  }
  console.log("search add is " , search_address);
    getDeepSearchResults(search_address);
}

//Search button event handler
function addressSearchHandler(e){
    e.preventDefault();
    //Hide the showsearch form div
    $('#showSearchForm').hide();
    $('#showSearchForm').attr("aria-hidden","true");

    //Get the new search address from input fields
    let address = encodeURIComponent($('#getAddress').val());
    if (!address){
        let err = {
            status : 400,
            responseText: "Address cannot be empty."
        }
        handleError(err);
        return;
    }
    $.ajax({
        type: "GET",
        url: "https://maps.googleapis.com/maps/api/geocode/json?address="+address+ "&key=AIzaSyBsOxH686DagXbVBUPmbmX8OShD64cAFqs",
        dataType: "json",
        success: getAndDisplayHomeInfo,
        error: handleError
      });
    
    //getAndDisplayHomeInfo();
    //Clear the address search fields
    // $('#unitNo').val('');
    $('#autocomplete').val('');

    //Clear the errors if already present
    //$("#showError").empty();
}

//Handler that listens to search button being clicked
function addressSearchListener(){
    $('#btn_searchHome').on('click', addressSearchHandler);
}

function savetoDashboardListener(){
  $('#save_search').on('click', saveSearchHandler);
}

$(function(){
    goToDashboardHandler();
    addressSearchListener();
    savetoDashboardListener();
    logOutListener();
})

