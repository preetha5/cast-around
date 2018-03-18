//Globals
const HOME_DETAILS_URL = '/user/home_details';

var MOCK_HOME_INFO = {
    "homeInfo": [
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
            'zpid': "16825747",
            'offerPrice': "333333",
            'pros': "Explore the history of the classic Lorem Ipsum passage \
                 and generate your own text using any number of characters, words, sentences or paragraphs",
            'cons':"Lorem Ipsum is not simply random text. \
                It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. ",
            'nickName': "House with red door"
        }
    ]
}

function displayHomeInfo(data){
    //Show Address from the database
    $("#city").val(data.address.city);
    $("#state").val(data.address.state);
    $("#zip").val(data.address.zip);
    $("#streetAdd").val(data.address.streetAddress);

    //Show home details returned from database
    $("#beds").val(data.home_details.beds);
    $("#baths").val(data.home_details.baths);
    $("#built").val(data.home_details.year_built);
    $("#area").val(data.home_details.area);
    $('#zillowId').val(data.home_details.zillowId);

    //Show user saved Info returned from the database
    $("#pros").val(data.user_notes.pros);
    $("#cons").val(data.user_notes.cons);
    $("#nickName").val(data.user_notes.nick_name);
    $("#offer").val(data.user_notes.offer);
}

//Call Zillow API to return property details
function getHomeDetailsFromDB(displayHomeInfo){
    //setTimeout(function(){ displayHomeInfo(MOCK_HOME_INFO)}, 100);
}

//Get and display zillow home info
function getAndDisplayHomeInfo(){
    //getHomeDetailsFromDB(displayHomeInfo)
    let home = JSON.parse(localStorage.getItem('home'));
    console.log(home);
    displayHomeInfo(home);
}

function goToDashboardHandler(){
    $("#btn_goToDashboard").click((e) =>{
        e.preventDefault();
        location.href = "./dashboard.html";
    });
}

//If an error is returned by server show it to the user inside a div
function handleError(err){
    $('#feedback').empty();
    $('#feedback').append(
      `<p>Error: Server returned ${err.status}. ${err.responseText} </p>`
    );
  }


//On getting a success status after saving, show confirm message to user.
function successMessage (){
    $('#feedback').empty();
    $('#feedback').append(`
    <p>Your Information has been saved. </p>
    `);
  }

// Create an object from serialized object
function makeHomeObj(){
    let formData = $("#fm_userNotes").serializeArray();
    console.log(formData);
    let myObj ={};
    $.each(formData, (index, item) =>{
      myObj[item.name] = item.value;
    });
    return myObj;
  }


function saveUserNotesHandler(){
    $('#btn_saveNotes').click((e) => {
        console.log("user notes to be saved");
        e.preventDefault();
        //let userNotes = $("#fm_userNotes").serializeArray();
        const zpid = $('#zillowId').val();
        const userNotes = makeHomeObj();
        console.log(userNotes);
        //Save the user notes to the DB in AJAX call
        $.ajax({
            type: 'PATCH',
            url: HOME_DETAILS_URL+'/'+zpid,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(userNotes),
            processData: false,
            success:successMessage,
            error: handleError
          });
    });
}

$(function(){
    $("#homeDetailsForm :input").prop('readonly', true);
    getAndDisplayHomeInfo();
    goToDashboardHandler();
    saveUserNotesHandler();
})