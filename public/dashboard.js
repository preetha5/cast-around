const DASHBOARD_URL = '/user/dashboard';
const HOME_DETAILS_URL = '/user/home_details';
const GOOGLE_API_KEY = 'AIzaSyD8N5rOofifOf4lKK7qLlHR7b6y8HlT_2E';

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

    $.getJSON(DASHBOARD_URL, function(data) {
        displayList(data);
    });
}

function listItemListener(){
    $('#savedHomes').on('click', 'li', function(){
        const zpid = $(this).data('zpid');
        $.getJSON(HOME_DETAILS_URL+'/'+zpid, function(data){
            //store the object in localstorage
            localStorage.setItem('home', JSON.stringify(data));

            //redirect the user to home_details.html
            window.location.href = "./home_details.html";
        })
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
            }
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
})