const DASHBOARD_URL = '/user/dashboard';
const HOME_DETAILS_URL = '/user/home_details';
const GOOGLE_API_KEY = 'AIzaSyD8N5rOofifOf4lKK7qLlHR7b6y8HlT_2E';
const token = sessionStorage.getItem("authToken");
const currentUser = sessionStorage.getItem("user");

//If user clicks on logout, destroy the local JWT and redirect to Landing page
function logOutListener(){
    $('#btn_logout').click(function(e){
        e.preventDefault();
        alert('logout');
        localStorage.removeItem("home");
        sessionStorage.removeItem("authToken");
        window.location.href = "./index.html"
    })
}

function handleError(err){
    $('#feedback').append(
      `<p>Error: Server returned ${err.status}. ${err.responseText} </p>`
    );
  }

function displayList(data){
    for (index in data.homes) {
        console.log(data.homes);
        let imgLink = encodeURI(`https://maps.googleapis.com/maps/api/streetview?size=400x200&location=${data.homes[index].streetAddress}+${data.homes[index].city}+${data.homes[index].zip}&key=${GOOGLE_API_KEY}`);
        console.log(imgLink);
        $('#savedHomes').append(
         `<li data-zpid = ${data.homes[index].zillowId}>
         <a href='#'>${data.homes[index].streetAddress} ${data.homes[index].city} ${data.homes[index].zip}<a>
         <img src=${imgLink} alt="street view of the home" class="home_img" />
         <button type="button" class="btn_deleteHome">Delete Item </button>
         </li>`);
     }
}

//Call Zillow API to return property details
function getListOfHomesFromDB(){
    console.log('Retrieving homes...')
    //Make an ajax get request to 'user/dashboard
    //on success callback Work on response to create template.
    //setTimeout(function(){ displayList(MOCK_LIST_HOMES)}, 100);

    // $.getJSON(DASHBOARD_URL, function(data) {
    //     displayList(data);
    // });
    
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
    $('#savedHomes').on('click', 'li', function(){
        const zpid = $(this).data('zpid');
        // $.getJSON(HOME_DETAILS_URL+'/'+zpid, function(data){
        //     //store the object in localstorage
        //     localStorage.setItem('home', JSON.stringify(data));

        //     //redirect the user to home_details.html
        //     window.location.href = "./home_details.html";
        // });

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