const DASHBOARD_URL = '/user/dashboard';
const HOME_DETAILS_URL = '/user/home_details';

var MOCK_LIST_HOMES = {
    "listHomes": [
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
            'nickName': "House with red door"
        },
        {
            'address': {
               'city': "SAN DIEGO",
               "state": "CA",
               "zipcode":"92127",
               "street":"8419 Run Of The Knls"
            },
            'bathrooms':"3",
            'bedrooms':"3",
            'finishedSqFt': "2900",
            'yearBuilt': "2004",
            'zpid': "16825748",
            'nickName': "House near golf course"
        }
    ]
}

function displayList(data){

    for (index in data.homes) {
        console.log(data.homes);
        $('#savedHomes').append(
         `<li data-zpid = ${data.homes[index].zillowId}>
         <a href='#'>${data.homes[index].streetAddress} ${data.homes[index].city} ${data.homes[index].zip}<a>
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
//Get and display zillow home info
function getAndDisplayHomes(){
    getListOfHomesFromDB()
}

$(function(){
    getAndDisplayHomes();
    listItemListener();
})