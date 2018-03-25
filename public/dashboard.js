const DASHBOARD_URL = '/user/dashboard';
const HOME_DETAILS_URL = '/user/home_details';
const GOOGLE_API_KEY = 'AIzaSyD8N5rOofifOf4lKK7qLlHR7b6y8HlT_2E';
const token = sessionStorage.getItem("authToken");
const currentUser = sessionStorage.getItem("user");


//If user clicks on logout, destroy the local JWT and redirect to Landing page
function logOutListener(){
    $('#btn_logout').click(function(e){
        e.preventDefault();
        localStorage.removeItem("home");
        sessionStorage.removeItem("authToken");
        window.location.href = "./index.html";
    })
}

function handleError(err){
    if (err.status === 401){
        $('#loginModal').modal('show');
        return;
    }
    $('#feedback').append(
      `<p>Error: Server returned ${err.status}. ${err.responseText} </p>`
    );
  }

//Create list html template for each home property
//saved in the database (Homes collection)
function displayList(data){
    for (index in data.homes) {
        console.log(data.homes);
        let imgLink = encodeURI(`https://maps.googleapis.com/maps/api/streetview?size=400x200&location=${data.homes[index].streetAddress}+${data.homes[index].city}+${data.homes[index].zip}&key=${GOOGLE_API_KEY}`);
        let directionLink = encodeURI(`https://www.google.com/maps/dir/?api=1&destination=${data.homes[index].streetAddress}+${data.homes[index].city}+${data.homes[index].zip}`);
        console.log(imgLink);
        $('#savedHomes').append(
        `
         <li  class="col-md-6" data-zpid = ${data.homes[index].zillowId} >
         <h5 class="home_add">${data.homes[index].streetAddress} ${data.homes[index].city} ${data.homes[index].zip}</h5>
         <img src=${imgLink} alt="street view of the home" class="home_img" />
         <div>
         <button type="button" class="btn btn-sm btn-success btn_addNotes">Add/View Notes </button>
         <button type="button" class=" btn btn-sm btn-danger btn_deleteHome">Delete Item </button>
         <a href="${directionLink}" target="_blank" class="btn_getDirections">Get Directions </a>
         </div></li>`);
     }
}

//Call Zillow API to return property details
function getListOfHomesFromDB(){
    //Make an ajax get request to 'user/dashboard
    //on success callback Work on response to create list item template
    //with returned data.
    
    $.ajax({
        type: 'GET',
        url: DASHBOARD_URL+'/'+currentUser,
        dataType: "json",
        success:displayList,
        error: handleError,
        beforeSend: function(xhr) { xhr.setRequestHeader('Authorization','Bearer ' + token); }
      });
}

function listItemListener(){
    $('#savedHomes').on('click', '.btn_addNotes', function(){
        const zpid = $(this).closest('li').data('zpid');
        $.ajax({
            type: 'GET',
            url: HOME_DETAILS_URL+'/'+zpid,
            dataType: "json",
            success:function(data){
                //store the object in localstorage and redirect user
                localStorage.setItem('home', JSON.stringify(data));
                window.location.href = "./home_details.html";
            },
            error: handleError,
            beforeSend: function(xhr) { xhr.setRequestHeader('Authorization','Bearer ' + token); }
          });
    })
}

function deleteItemListener(){
    $('#savedHomes').on('click', '.btn_deleteHome', function(event){
        event.stopPropagation();
        //find the associated list item
        const liElem = $(this).closest("li");
        const zpid = liElem.data('zpid');
        $.ajax({
            url: DASHBOARD_URL+'/'+zpid,
            type: 'DELETE',
            success: function(result) {
                // Do something with the result
                console.log('item deleted');
                //Hide the elem from view
                liElem.hide();
            },
            beforeSend: function(xhr) { xhr.setRequestHeader('Authorization','Bearer ' + token); }
        });
    });
}

//Get and display zillow home info
function getAndDisplayHomes(){
    getListOfHomesFromDB()
}

$(function(){
    getAndDisplayHomes();
    listItemListener();
    deleteItemListener();
    logOutListener();
})