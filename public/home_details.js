//Globals
const HOME_DETAILS_URL = '/user/home_details';
const token = sessionStorage.getItem("authToken");

//If user clicks on logout, destroy the local JWT and redirect to Landing page
function logOutListener(){
    $('#btn_logout').click(function(e){
        e.preventDefault();
        localStorage.removeItem("home");
        sessionStorage.removeItem("authToken");
        window.location.href = "./index.html"
    })
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

    //Show user notes Info returned from the database
    $("#pros").val(data.user_notes.pros);
    $("#cons").val(data.user_notes.cons);
    $("#nickName").val(data.user_notes.nickName);
    $("#offer").val(data.user_notes.offer);
}


//Get and display zillow home info
function getAndDisplayHomeInfo(){
    let home = JSON.parse(localStorage.getItem('home'));
    displayHomeInfo(home);
}

//Redirect user to dashboard page on button click
function goToDashboardHandler(){
    $("#btn_goToDashboard").click((e) =>{
        e.preventDefault();
        location.href = "./dashboard.html";
    });
}

//If an error is returned by server show it to the user inside a div
function handleError(err){
    $('.feedbackDiv').empty();

    if (err.status ===500){
        $('.feedbackDiv').append(
            `<p>Error: No changes have been made to the notes fields. </p>`
          );
          $('#feedbackModal').modal('show');
          return;
    }
    $('.feedbackDiv').append(
          `<p>Error: Server returned ${err.status}. ${err.responseText} </p>`
        );
    $('#feedbackModal').modal('show');
  }


//On getting a success status after saving, show confirm message to user.
function successMessage (){
    $('.feedbackDiv').empty();
    $('.feedbackDiv').append(
          `<p>Your Information has been saved.</p>`
        );
    $('#feedbackModal').modal('show');
  }

// Create an object from serialized object to be passed to AJAX call
function makeHomeObj(){
    let formData = $("#fm_userNotes").serializeArray();
    let myObj ={};
    $.each(formData, (index, item) =>{
      myObj[item.name] = item.value;
    });
    return myObj;
  }

//Save the data added by the user in the "user notes" form to the DB
//for the corresponding home document
function saveUserNotesHandler(){
    $('#btn_saveNotes').click((e) => {
        console.log("user notes to be saved");
        e.preventDefault();
        const zpid = $('#zillowId').val();
        const userNotes = makeHomeObj();
        //Save the user notes to the DB in AJAX call
        $.ajax({
            type: 'PATCH',
            url: HOME_DETAILS_URL+'/'+zpid,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(userNotes),
            processData: false,
            success:successMessage,
            error: handleError,
            beforeSend: function(xhr) { xhr.setRequestHeader('Authorization','Bearer ' + token); }
          });
    });
}

$(function(){
    $("#homeDetailsForm :input").prop('readonly', true);
    getAndDisplayHomeInfo();
    goToDashboardHandler();
    saveUserNotesHandler();
    logOutListener();
})